
export interface Product {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  barcode?: string;
  nutrients?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  price?: number;
}

export interface Recipe {
  id: string;
  name: string;
  imageUrl?: string;
  ingredients: Product[];
  duration?: number; // en minutes
  difficulty?: 'facile' | 'moyen' | 'difficile';
  instructions: string[];
  tags?: string[];
  totalCost?: number;
  costPerServing?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FridgeItem {
  product: Product;
  quantity: number;
  expiryDate?: Date;
}

export interface ScanResult {
  codeResult: {
    code: string;
    format: string;
  };
}
