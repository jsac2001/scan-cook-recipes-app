
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import { Button } from '@/components/ui/button';
import { Camera, Zap } from 'lucide-react';

// Données fictives pour simuler un scan
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Lait demi-écrémé',
    brand: 'Lactel',
    barcode: '3256540000080',
    category: 'Produits laitiers',
    imageUrl: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '2',
    name: 'Pâtes complètes',
    brand: 'Panzani',
    barcode: '3038350208705',
    category: 'Féculents',
    imageUrl: 'https://images.unsplash.com/photo-1603729362753-f8162ac6c3df?auto=format&fit=crop&q=80&w=300'
  }
];

const ScannerPage = () => {
  const { addScannedProduct } = useAppContext();
  const [scanning, setScanning] = useState(false);
  
  const startScanning = () => {
    setScanning(true);
    
    // Simulation d'un scan après 2 secondes
    setTimeout(() => {
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      addScannedProduct(randomProduct);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-between p-6 h-full animate-fade-in">
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Scanner un produit</h1>
        <p className="text-gray-600">
          Positionnez le code-barres dans le cadre pour scanner un produit
        </p>
      </div>
      
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm aspect-square border-2 border-dashed border-primary rounded-lg mb-8 flex items-center justify-center bg-gray-50">
          {scanning ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-primary animate-pulse"></div>
                <div className="h-full w-0.5 bg-primary animate-pulse"></div>
              </div>
              <p className="text-lg font-semibold">Scanning...</p>
            </>
          ) : (
            <Camera size={80} className="text-gray-400" />
          )}
        </div>
        
        <Button 
          onClick={startScanning} 
          disabled={scanning}
          className="flex items-center gap-2 px-8 py-6 text-lg"
        >
          {scanning ? (
            <>
              <Zap className="animate-pulse" /> Analyse en cours...
            </>
          ) : (
            <>
              <Camera /> Scanner un produit
            </>
          )}
        </Button>
      </div>
      
      <div className="w-full mt-6">
        <p className="text-sm text-gray-500 text-center">
          Vous pouvez également rechercher un produit manuellement
        </p>
      </div>
    </div>
  );
};

export default ScannerPage;
