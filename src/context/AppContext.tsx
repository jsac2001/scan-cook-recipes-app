
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Recipe, CartItem, FridgeItem } from '../types';
import { toast } from "sonner";

interface AppContextType {
  scannedProducts: Product[];
  lastScannedProduct: Product | null;
  cartItems: CartItem[];
  fridgeItems: FridgeItem[];
  suggestedRecipes: Recipe[];
  addScannedProduct: (product: Product) => void;
  setLastScannedProduct: (product: Product) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  addToFridge: (product: Product, quantity?: number, expiryDate?: Date) => void;
  removeFromFridge: (productId: string) => void;
  updateFridgeItemQuantity: (productId: string, quantity: number) => void;
  setSuggestedRecipes: (recipes: Recipe[]) => void;
  addRecipeToCart: (recipe: Recipe) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);

  const addScannedProduct = (product: Product) => {
    // Vérifier si le produit existe déjà
    if (!scannedProducts.some(p => p.id === product.id)) {
      setScannedProducts([...scannedProducts, product]);
      toast.success(`${product.name} a été scanné`);
      
      // Définir comme dernier produit scanné
      setLastScannedProduct(product);
      
      // Dans une version réelle, on pourrait appeler une API pour obtenir des recettes suggérées
      // basées sur les produits scannés
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateCartItemQuantity(product.id, existingItem.quantity + quantity);
    } else {
      setCartItems([...cartItems, { product, quantity }]);
      toast.success(`${product.name} a été ajouté au panier`);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast.info("Produit retiré du panier");
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addToFridge = (product: Product, quantity = 1, expiryDate?: Date) => {
    const existingItem = fridgeItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateFridgeItemQuantity(product.id, existingItem.quantity + quantity);
    } else {
      setFridgeItems([...fridgeItems, { product, quantity, expiryDate }]);
      toast.success(`${product.name} a été ajouté à votre frigo`);
    }
  };

  const removeFromFridge = (productId: string) => {
    setFridgeItems(fridgeItems.filter(item => item.product.id !== productId));
    toast.info("Produit retiré du frigo");
  };

  const updateFridgeItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromFridge(productId);
      return;
    }

    setFridgeItems(
      fridgeItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const addRecipeToCart = (recipe: Recipe) => {
    // Ajouter tous les ingrédients de la recette au panier
    recipe.ingredients.forEach(ingredient => {
      addToCart(ingredient, 1);
    });
    
    toast.success(`Tous les ingrédients de ${recipe.name} ont été ajoutés au panier`);
  };

  const value = {
    scannedProducts,
    lastScannedProduct,
    cartItems,
    fridgeItems,
    suggestedRecipes,
    addScannedProduct,
    setLastScannedProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    addToFridge,
    removeFromFridge,
    updateFridgeItemQuantity,
    setSuggestedRecipes,
    addRecipeToCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
