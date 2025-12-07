import { CurrencyPrices } from '@/types/currency';

export interface Product {
    id: string;
    seqId?: number; // Sequential ID
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    price: number | CurrencyPrices; // Support both legacy single price and new multi-currency
    originalPrice?: number | CurrencyPrices;
    image: string;
    images?: string[];
    category?: 'guide' | 'physical' | 'consultation' | 'tshirts' | 'playstation' | 'xbox' | 'nintendo' | 'pc' | 'mobile' | 'accessories' | 'giftcards' | 'preorders' | 'retro'; // Legacy single category support
    categories?: string[]; // New multiple categories support
    isNew?: boolean;
    isLimited?: boolean;
    isDigital: boolean;
    stock?: number;
    sku?: string;
    tags: string[];
    status: 'active' | 'inactive' | 'draft';
    rating?: number; // Product rating
    createdAt: string;
    updatedAt: string;
}
