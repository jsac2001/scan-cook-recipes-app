
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useAppContext();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product.price || 0) * item.quantity,
    0
  );
  const taxRate = 0.20; // TVA 20%
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Handle payment process
  const handlePayment = () => {
    setIsProcessingPayment(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Paiement réussi! Merci pour votre achat.");
      setIsProcessingPayment(false);
      // In a real app, you would redirect to a confirmation page
    }, 1500);
  };
  
  // Handle item removal with confirmation
  const handleRemoveItem = (productId: string, productName: string) => {
    if (window.confirm(`Voulez-vous retirer "${productName}" de votre panier?`)) {
      removeFromCart(productId);
    }
  };
  
  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Mon Panier</h1>
      
      {cartItems.length > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-6">{totalItems} article{totalItems > 1 ? 's' : ''} dans votre panier</p>
          
          <div className="divide-y">
            {cartItems.map(item => (
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
                      <ShoppingBag size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  {item.product.price && (
                    <p className="text-sm text-gray-500">
                      {item.product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                    onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                    aria-label="Diminuer la quantité"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="mx-2 w-6 text-center">{item.quantity}</span>
                  
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                    onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                    aria-label="Augmenter la quantité"
                  >
                    <Plus size={16} />
                  </button>
                  
                  <button
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary section */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">TVA (20%)</span>
              <span>{taxAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              className="w-full py-6" 
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Traitement en cours...' : 'Finaliser le paiement'}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Votre panier est vide</p>
          <p className="text-sm text-gray-400 mt-2 mb-6">Scannez des produits pour les ajouter à votre panier</p>
          
          <Button variant="outline" onClick={() => window.location.href = '#/scanner'}>
            Scanner des produits
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
