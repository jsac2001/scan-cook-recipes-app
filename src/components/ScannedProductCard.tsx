
import React from 'react';
import { Product } from '../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ScannedProductCardProps {
  product: Product;
}

const ScannedProductCard = ({ product }: ScannedProductCardProps) => {
  const { addToCart } = useAppContext();

  return (
    <Card className="w-full overflow-hidden animate-fade-in shadow-sm border border-gray-200">
      <div className="flex p-4">
        <div className="w-1/3 mr-4">
          {product.imageUrl ? (
            <div 
              className="w-full aspect-square rounded-md bg-cover bg-center" 
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            />
          ) : (
            <div className="w-full aspect-square rounded-md bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Aucune image</span>
            </div>
          )}
        </div>

        <div className="w-2/3">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          {product.brand && <p className="text-gray-500 text-sm">{product.brand}</p>}
          
          {product.price !== undefined && (
            <p className="text-primary font-bold mt-1">
              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
          )}
          
          {product.barcode && (
            <p className="text-gray-500 text-xs mt-1">
              Code-barres: {product.barcode}
            </p>
          )}
        </div>
      </div>

      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          className="w-1/2" 
          onClick={() => addToCart(product, 1)}
        >
          <ShoppingCart size={18} className="mr-2" /> Ajouter
        </Button>
        <Button 
          variant="default" 
          className="w-1/2"
        >
          <PlusCircle size={18} className="mr-2" /> Détails
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScannedProductCard;
