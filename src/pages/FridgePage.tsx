
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, Refrigerator } from 'lucide-react';

const FridgePage = () => {
  const { fridgeItems, updateFridgeItemQuantity, removeFromFridge } = useAppContext();

  const totalItems = fridgeItems.reduce((total, item) => total + item.quantity, 0);
  
  // Fonction pour formater une date d'expiration
  const formatExpiryDate = (date?: Date) => {
    if (!date) return 'Pas de date';
    return new Date(date).toLocaleDateString();
  };
  
  // Fonction pour déterminer si un produit est sur le point d'expirer (dans les 2 jours)
  const isAboutToExpire = (date?: Date) => {
    if (!date) return false;
    const today = new Date();
    const expiryDate = new Date(date);
    const diffDays = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };
  
  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Mon Frigo</h1>
      
      {fridgeItems.length > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-6">{totalItems} produit{totalItems > 1 ? 's' : ''} dans votre frigo</p>
          
          <div className="divide-y">
            {fridgeItems.map(item => (
              <div key={item.product.id} className="py-4 flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Refrigerator size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  {item.expiryDate && (
                    <p className={`text-sm ${isAboutToExpire(item.expiryDate) ? 'text-orange-500' : 'text-gray-500'}`}>
                      Expire le {formatExpiryDate(item.expiryDate)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                    onClick={() => updateFridgeItemQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="mx-2 w-6 text-center">{item.quantity}</span>
                  
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                    onClick={() => updateFridgeItemQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                  
                  <button
                    className="ml-4 text-red-500"
                    onClick={() => removeFromFridge(item.product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Button variant="outline" className="w-full">
              Ajouter des produits
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Refrigerator size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Votre frigo est vide</p>
          <p className="text-sm text-gray-400 mt-2 mb-6">Ajoutez des produits à votre frigo pour recevoir des suggestions de recettes</p>
          
          <Button variant="outline" onClick={() => window.location.href = '#/scanner'}>
            Scanner des produits
          </Button>
        </div>
      )}
    </div>
  );
};

export default FridgePage;
