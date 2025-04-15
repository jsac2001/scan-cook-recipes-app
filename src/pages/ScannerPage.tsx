
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Camera, Zap, Eye, ArrowRight } from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';
import ScannedProductCard from '../components/ScannedProductCard';
import { fetchProductByBarcode } from '../services/productService';
import { toast } from 'sonner';

const ScannerPage = () => {
  const { addScannedProduct, lastScannedProduct, setLastScannedProduct } = useAppContext();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const navigate = useNavigate();
  
  const handleStartScanning = () => {
    setIsScanning(true);
  };

  const fetchRecommendations = async (product) => {
    try {
      const response = await fetch("http://localhost:5678/webhook/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "user_id": "user_123", // À remplacer par l'ID réel de l'utilisateur
          "request_type": "text_query",
          "content": {
            "text": `Je viens de scanner ${product.name}, que peux-tu me suggérer ?`,
            "context": {
              "location": "scanner_page",
              "scanned_products": [
                {
                  "id": product.id,
                  "name": product.name,
                  "category": product.category || "Non catégorisé"
                }
              ]
            }
          }
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.recommendations || "Aucune suggestion disponible pour le moment.");
        toast.success("Recommandations mises à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations:", error);
    }
  };

  const handleDetected = async (barcode: string) => {
    setIsScanning(false);
    setIsLoading(true);
    
    try {
      // Appel au service qui simule une API
      const product = await fetchProductByBarcode(barcode);
      
      if (product) {
        // Vibration de confirmation
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        
        addScannedProduct(product);
        toast.success(`Produit scanné: ${product.name}`);
        
        // Récupérer des recommandations depuis l'API n8n
        fetchRecommendations(product);
      } else {
        toast.error("Produit non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      toast.error("Erreur lors du scan");
    } finally {
      setIsLoading(false);
    }
  };

  const goToSuggestions = () => {
    navigate('/suggestions');
  };

  return (
    <div className="flex flex-col p-6 pb-20 h-full animate-fade-in">
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Scanner un produit</h1>
        <p className="text-gray-600 text-sm">
          Positionnez le code-barres dans le cadre pour scanner un produit
        </p>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="w-full mb-6">
          {isScanning ? (
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <BarcodeScanner 
                onDetected={handleDetected}
                isScanning={isScanning}
              />
              
              <Button 
                variant="outline" 
                className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm"
                onClick={() => setIsScanning(false)}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <div className="relative w-full aspect-video border-2 border-dashed border-primary rounded-lg mb-8 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4">
                {isLoading ? (
                  <>
                    <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500">Recherche du produit...</p>
                  </>
                ) : (
                  <>
                    <Camera size={60} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Prêt à scanner</p>
                    <p className="text-sm text-gray-500 mb-4">Activez la caméra pour commencer</p>
                    <Button onClick={handleStartScanning} className="mx-auto gap-2">
                      <Eye /> Activer la caméra
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        {lastScannedProduct && (
          <div className="mb-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-2">Dernier produit scanné</h2>
            <ScannedProductCard product={lastScannedProduct} />
          </div>
        )}
        
        {suggestions && (
          <div className="mb-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-2">Recommandations</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">{suggestions}</p>
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          <Button
            onClick={goToSuggestions}
            className="w-full py-6 text-lg gap-2"
            disabled={!lastScannedProduct}
          >
            Voir les suggestions <ArrowRight size={18} />
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Basé sur {lastScannedProduct ? '1' : '0'} produit scanné
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
