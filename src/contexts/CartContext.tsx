import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'guide' | 'physical' | 'consultation' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro';
  isDigital: boolean;
  quantity: number;
  badge?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  promoCode: string;
  promoDiscount: number;
  promoDiscountType: 'percentage' | 'fixed';
  currency: string;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_PROMO'; payload: { code: string; discount: number; discountType: 'percentage' | 'fixed' } }
  | { type: 'REMOVE_PROMO' }
  | { type: 'LOAD_CART'; payload: CartState };

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  shippingCost: 0,
  total: 0,
  promoCode: '',
  promoDiscount: 0,
  promoDiscountType: 'percentage',
};

// Helper functions
const calculateTotals = (items: CartItem[], promoDiscount: number = 0, discountType: 'percentage' | 'fixed' = 'percentage'): Partial<CartState> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = items.some(item => !item.isDigital) ? 2.000 : 0;

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * promoDiscount) / 100;
  } else if (discountType === 'fixed') {
    discountAmount = promoDiscount;
  }

  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  return {
    totalItems,
    subtotal,
    shippingCost,
    total,
  };
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const totals = calculateTotals(newItems, state.promoDiscount, state.promoDiscountType);
      return { ...state, items: newItems, ...totals };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateTotals(newItems, state.promoDiscount, state.promoDiscountType);
      return { ...state, items: newItems, ...totals };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id: action.payload.id } });
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totals = calculateTotals(newItems, state.promoDiscount, state.promoDiscountType);
      return { ...state, items: newItems, ...totals };
    }

    case 'CLEAR_CART': {
      return { ...initialState };
    }

    case 'APPLY_PROMO': {
      const totals = calculateTotals(state.items, action.payload.discount, action.payload.discountType);
      return {
        ...state,
        promoCode: action.payload.code,
        promoDiscount: action.payload.discount,
        promoDiscountType: action.payload.discountType,
        ...totals,
      };
    }

    case 'REMOVE_PROMO': {
      const totals = calculateTotals(state.items, 0, 'percentage');
      return {
        ...state,
        promoCode: '',
        promoDiscount: 0,
        promoDiscountType: 'percentage',
        ...totals,
      };
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
};

// Context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('growgarden-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Clear any promo codes when loading from localStorage to prevent automatic discounts
        const cleanCart = {
          ...parsedCart,
          promoCode: '',
          promoDiscount: 0,
          promoDiscountType: 'percentage' as const
        };
        // Recalculate totals without any promo discount
        const totals = calculateTotals(cleanCart.items, 0, 'percentage');
        const finalCart = { ...cleanCart, ...totals };
        dispatch({ type: 'LOAD_CART', payload: finalCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('growgarden-cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper functions for common operations
export const useCartActions = () => {
  const { dispatch } = useCart();

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyPromo = (code: string, discount: number, discountType: 'percentage' | 'fixed' = 'percentage') => {
    dispatch({ type: 'APPLY_PROMO', payload: { code, discount, discountType } });
  };

  const removePromo = () => {
    dispatch({ type: 'REMOVE_PROMO' });
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
  };
};
