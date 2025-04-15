
import { Product } from '../types';

// Données fictives pour simuler une base de données de produits
const productDatabase: Record<string, Product> = {
  '3256540000080': {
    id: '1',
    name: 'Lait demi-écrémé',
    brand: 'Lactel',
    barcode: '3256540000080',
    category: 'Produits laitiers',
    imageUrl: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&q=80&w=300',
    price: 1.15,
    nutrients: {
      calories: 46,
      protein: 3.2,
      carbs: 4.8,
      fat: 1.6
    }
  },
  '3038350208705': {
    id: '2',
    name: 'Pâtes complètes',
    brand: 'Panzani',
    barcode: '3038350208705',
    category: 'Féculents',
    imageUrl: 'https://images.unsplash.com/photo-1603729362753-f8162ac6c3df?auto=format&fit=crop&q=80&w=300',
    price: 1.89,
    nutrients: {
      calories: 350,
      protein: 12,
      carbs: 70,
      fat: 2
    }
  },
  '3560070976553': {
    id: '3',
    name: 'Yaourt nature',
    brand: 'Activia',
    barcode: '3560070976553',
    category: 'Produits laitiers',
    imageUrl: 'https://images.unsplash.com/photo-1584278858536-52532423b9ea?auto=format&fit=crop&q=80&w=300',
    price: 2.45,
    nutrients: {
      calories: 59,
      protein: 4.2,
      carbs: 5.5,
      fat: 3.0
    }
  }
};

// Simuler un délai réseau avec Promise
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
  // Simuler un délai réseau
  await delay(800);
  
  // Vérifier si le produit existe dans notre base de données fictive
  if (barcode in productDatabase) {
    return productDatabase[barcode];
  }
  
  // Si le code-barres n'est pas trouvé, retourner un produit générique
  return {
    id: Date.now().toString(),
    name: 'Produit inconnu',
    barcode,
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1598026595010-5c748532645b?auto=format&fit=crop&q=80&w=300'
  };
};
