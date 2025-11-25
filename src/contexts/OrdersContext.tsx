import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  titleEn: string;
  price: number;
  quantity: number;
  image: string;
  category: 'guide' | 'physical' | 'consultation';
  isDigital: boolean;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  robloxUsername?: string;
}

export interface OrderShipping {
  address: string;
  city: string;
  area: string;
  building?: string;
  floor?: string;
  apartment?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  shipping?: OrderShipping;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'knet' | 'visa' | 'mastercard';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  promoCode?: string;
  promoDiscount: number;
  isDigitalOnly: boolean;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  notes?: string;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface OrdersContextType extends OrdersState {
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
  addOrderNote: (id: string, note: string) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  searchOrders: (query: string, status?: string, dateFrom?: string, dateTo?: string) => Order[];
  getOrderStats: () => {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  };
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

interface OrdersProviderProps {
  children: ReactNode;
}

// Mock orders data - in production, this would come from your backend API
const INITIAL_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-0001',
    customer: {
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed.mohamed@example.com',
      phone: '+965 55123456',
      robloxUsername: 'AhmedGamer123'
    },
    shipping: {
      address: 'شارع سالم المبارك، بناية 15',
      city: 'الكويت',
      area: 'السالمية',
      building: '15',
      floor: '3',
      apartment: '12'
    },
    items: [
      {
        id: '1',
        productId: '1',
        title: 'دليل الحيوانات الشامل',
        titleEn: 'Complete Pets Guide',
        price: 3.50,
        quantity: 1,
        image: '/src/assets/pets-guide-cover.jpg',
        category: 'guide',
        isDigital: true
      },
      {
        id: '2',
        productId: '2',
        title: 'تيشيرت Queen Bee',
        titleEn: 'Queen Bee T-Shirt',
        price: 12.75,
        quantity: 2,
        image: '/src/assets/queen-bee-tshirt.jpg',
        category: 'physical',
        isDigital: false
      }
    ],
    subtotal: 29.00,
    shippingCost: 2.50,
    discount: 0,
    total: 31.50,
    status: 'processing',
    paymentMethod: 'knet',
    paymentStatus: 'paid',
    promoDiscount: 0,
    isDigitalOnly: false,
    createdAt: '2025-01-05T10:30:00.000Z',
    updatedAt: '2025-01-05T14:20:00.000Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-0002',
    customer: {
      firstName: 'فاطمة',
      lastName: 'العلي',
      email: 'fatima.ali@example.com',
      phone: '+965 66789123',
      robloxUsername: 'FatimaGarden'
    },
    items: [
      {
        id: '3',
        productId: '3',
        title: 'جلسة إرشادية شخصية',
        titleEn: 'Personal Consultation Session',
        price: 18.00,
        quantity: 1,
        image: '/src/assets/consultation-session.jpg',
        category: 'consultation',
        isDigital: true
      }
    ],
    subtotal: 18.00,
    shippingCost: 0,
    discount: 1.80,
    total: 16.20,
    status: 'delivered',
    paymentMethod: 'visa',
    paymentStatus: 'paid',
    promoCode: 'GARDEN10',
    promoDiscount: 10,
    isDigitalOnly: true,
    createdAt: '2025-01-04T09:15:00.000Z',
    updatedAt: '2025-01-04T16:45:00.000Z',
    deliveredAt: '2025-01-04T16:45:00.000Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-0003',
    customer: {
      firstName: 'خالد',
      lastName: 'الشمري',
      email: 'khalid.shamri@example.com',
      phone: '+965 99456789'
    },
    shipping: {
      address: 'شارع الخليج العربي، مجمع الأفنيوز',
      city: 'الكويت',
      area: 'الري',
      notes: 'التوصيل مساءً بعد الساعة 6'
    },
    items: [
      {
        id: '4',
        productId: '5',
        title: 'ملصقات حيوانات المزرعة',
        titleEn: 'Farm Animals Sticker Pack',
        price: 4.50,
        quantity: 3,
        image: '/src/assets/sticker-pack.jpg',
        category: 'physical',
        isDigital: false
      },
      {
        id: '5',
        productId: '6',
        title: 'دليل بناء المزرعة المثالية',
        titleEn: 'Perfect Farm Building Guide',
        price: 4.00,
        quantity: 1,
        image: '/src/assets/pets-guide-cover.jpg',
        category: 'guide',
        isDigital: true
      }
    ],
    subtotal: 17.50,
    shippingCost: 2.50,
    discount: 0,
    total: 20.00,
    status: 'shipped',
    paymentMethod: 'mastercard',
    paymentStatus: 'paid',
    promoDiscount: 0,
    isDigitalOnly: false,
    createdAt: '2025-01-03T14:22:00.000Z',
    updatedAt: '2025-01-05T11:15:00.000Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-0004',
    customer: {
      firstName: 'نورا',
      lastName: 'الحسن',
      email: 'nora.hassan@example.com',
      phone: '+965 77234567',
      robloxUsername: 'NoraBuilder'
    },
    items: [
      {
        id: '6',
        productId: '4',
        title: 'خارطة الفعاليات الحالية',
        titleEn: 'Current Events Map',
        price: 2.25,
        quantity: 2,
        image: '/src/assets/pets-guide-cover.jpg',
        category: 'guide',
        isDigital: true
      }
    ],
    subtotal: 4.50,
    shippingCost: 0,
    discount: 0,
    total: 4.50,
    status: 'pending',
    paymentMethod: 'knet',
    paymentStatus: 'pending',
    promoDiscount: 0,
    isDigitalOnly: true,
    createdAt: '2025-01-05T16:45:00.000Z',
    updatedAt: '2025-01-05T16:45:00.000Z'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-0005',
    customer: {
      firstName: 'سعد',
      lastName: 'الكندري',
      email: 'saad.kandari@example.com',
      phone: '+965 55987654'
    },
    items: [
      {
        id: '7',
        productId: 'new-1',
        title: 'دليل تجميع العملات الذهبية',
        titleEn: 'Gold Coins Collection Guide',
        price: 2.50,
        quantity: 1,
        image: '/src/assets/pets-guide-cover.jpg',
        category: 'guide',
        isDigital: true
      }
    ],
    subtotal: 2.50,
    shippingCost: 0,
    discount: 0,
    total: 2.50,
    status: 'cancelled',
    paymentMethod: 'visa',
    paymentStatus: 'refunded',
    promoDiscount: 0,
    isDigitalOnly: true,
    createdAt: '2025-01-05T12:30:00.000Z',
    updatedAt: '2025-01-05T13:15:00.000Z',
    notes: 'العميل طلب الإلغاء بسبب تغيير الرأي'
  }
];

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const [ordersState, setOrdersState] = useState<OrdersState>({
    orders: [],
    isLoading: true,
    error: null,
  });

  const refreshOrders = async (): Promise<void> => {
    setOrdersState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be an API call to fetch orders
      const savedOrders = localStorage.getItem('admin_orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS;
      
      setOrdersState({
        orders,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setOrdersState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load orders',
      }));
    }
  };

  const getOrderById = (id: string): Order | undefined => {
    return ordersState.orders.find(order => order.id === id);
  };

  const updateOrderStatus = async (id: string, status: Order['status']): Promise<boolean> => {
    try {
      const updatedOrders = ordersState.orders.map(order => 
        order.id === id 
          ? { 
              ...order, 
              status, 
              updatedAt: new Date().toISOString(),
              deliveredAt: status === 'delivered' ? new Date().toISOString() : order.deliveredAt
            }
          : order
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_orders', JSON.stringify(updatedOrders));
      
      setOrdersState(prev => ({
        ...prev,
        orders: updatedOrders,
      }));

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const addOrderNote = async (id: string, note: string): Promise<boolean> => {
    try {
      const updatedOrders = ordersState.orders.map(order =>
        order.id === id
          ? {
              ...order,
              notes: note,
              updatedAt: new Date().toISOString()
            }
          : order
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_orders', JSON.stringify(updatedOrders));

      setOrdersState(prev => ({
        ...prev,
        orders: updatedOrders,
      }));

      return true;
    } catch (error) {
      console.error('Error adding order note:', error);
      return false;
    }
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      const updatedOrders = ordersState.orders.filter(order => order.id !== id);

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_orders', JSON.stringify(updatedOrders));

      setOrdersState(prev => ({
        ...prev,
        orders: updatedOrders,
      }));

      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  };

  const searchOrders = (query: string, status?: string, dateFrom?: string, dateTo?: string): Order[] => {
    let filtered = ordersState.orders;

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(order => new Date(order.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(order => new Date(order.createdAt) <= new Date(dateTo));
    }

    // Filter by search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customer.firstName.toLowerCase().includes(searchTerm) ||
        order.customer.lastName.toLowerCase().includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm) ||
        order.customer.phone.includes(searchTerm) ||
        order.items.some(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.titleEn.toLowerCase().includes(searchTerm)
        )
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getOrderStats = () => {
    const orders = ordersState.orders;
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.total, 0)
    };
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const value: OrdersContextType = {
    ...ordersState,
    getOrderById,
    updateOrderStatus,
    addOrderNote,
    deleteOrder,
    searchOrders,
    getOrderStats,
    refreshOrders,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export default OrdersProvider;