import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Refrigerator, 
  Camera, 
  X, 
  Upload, 
  PlusCircle,
  ArrowRight,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const FridgePage = () => {
  const { fridgeItems, addToFridge, updateFridgeItemQuantity, removeFromFridge } = useAppContext();
  const [isFirstTime, setIsFirstTime] = useState(() => {
    return localStorage.getItem('fridgeVisited') !== 'true';
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newProduct, setNewProduct] = useState<{name: string, quantity: number, expiryDate?: string}>({
    name: '',
    quantity: 1,
    expiryDate: undefined
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const totalItems = fridgeItems.reduce((total, item) => total + item.quantity, 0);
  
  useEffect(() => {
    if (!isFirstTime) {
      localStorage.setItem('fridgeVisited', 'true');
    }
  }, [isFirstTime]);
  
  const formatExpiryDate = (date?: Date) => {
    if (!date) return 'Pas de date';
    return new Date(date).toLocaleDateString();
  };
  
  const isAboutToExpire = (date?: Date) => {
    if (!date) return false;
    const today = new Date();
    const expiryDate = new Date(date);
    const diffDays = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      toast.error('Impossible d\'accéder à la caméra');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        setIsPreviewOpen(true);
        
        stopCamera();
      }
    }
  };
  
  const sendFridgeImage = async (imageBase64: string) => {
    setIsProcessing(true);
    
    const base64Data = imageBase64.split(',')[1];
    
    const payload = {
      user_id: "test_user_123",
      request_type: "image_analysis",
      content: {
        text: "Voici une photo de mon frigo, identifie les produits qu'il contient",
        image: base64Data,
        context: {
          location: "fridge_page",
          first_time: isFirstTime
        }
      }
    };
    
    try {
      const response = await fetch("http://localhost:5678/webhook-test/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.detected_products && Array.isArray(data.detected_products)) {
          data.detected_products.forEach((product: any) => {
            const fridgeProduct: Product = {
              id: `detected-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: product.name,
              category: product.category || 'Non catégorisé',
              price: product.price || 0
            };
            
            addToFridge(fridgeProduct, product.quantity || 1);
          });
          
          toast.success(`${data.detected_products.length} produits ajoutés à votre frigo`);
        } else {
          simulateDetectedProducts();
        }
        
        setIsFirstTime(false);
      } else {
        toast.error(`Erreur API: ${response.status}`);
        simulateDetectedProducts();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image:", error);
      toast.error("Impossible de contacter le serveur");
      simulateDetectedProducts();
    } finally {
      setIsProcessing(false);
      setIsPreviewOpen(false);
      setCapturedImage(null);
    }
  };
  
  const simulateDetectedProducts = () => {
    const detectedProducts = [
      { id: `p${Date.now()}-1`, name: 'Lait', brand: 'Lactel', category: 'Produits laitiers', price: 1.15 },
      { id: `p${Date.now()}-2`, name: 'Œufs', brand: 'Fermiers', category: 'Produits frais', price: 2.50 },
      { id: `p${Date.now()}-3`, name: 'Tomates', brand: 'Local', category: 'Légumes', price: 1.80 }
    ];
    
    detectedProducts.forEach(product => {
      addToFridge(product);
    });
    
    toast.success(`${detectedProducts.length} produits ajoutés à votre frigo`);
    
    setIsFirstTime(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageData = event.target.result.toString();
          setCapturedImage(imageData);
          setIsPreviewOpen(true);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageData = event.target.result.toString();
          setCapturedImage(imageData);
          setIsPreviewOpen(true);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddManualProduct = () => {
    setIsAddProductOpen(true);
  };
  
  const submitNewProduct = () => {
    if (!newProduct.name.trim()) {
      toast.error('Veuillez entrer un nom de produit');
      return;
    }
    
    const product: Product = {
      id: `manual-${Date.now()}`,
      name: newProduct.name,
      category: 'Ajout manuel',
      price: 0
    };
    
    const expiryDate = newProduct.expiryDate ? new Date(newProduct.expiryDate) : undefined;
    addToFridge(product, newProduct.quantity, expiryDate);
    
    toast.success(`${newProduct.name} ajouté à votre frigo`);
    
    setNewProduct({ name: '', quantity: 1, expiryDate: undefined });
    setIsAddProductOpen(false);
    
    setIsFirstTime(false);
  };
  
  const navigateToSuggestions = () => {
    navigate('/suggestions');
  };
  
  return (
    <div className="p-6 pb-20 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Mon Frigo</h1>
      
      {fridgeItems.length > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-6">{totalItems} produit{totalItems > 1 ? 's' : ''} dans votre frigo</p>
          
          <div 
            className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => !isCapturing && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isCapturing ? (
              <div className="relative w-full">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={captureImage} className="flex-1">
                    <Camera size={18} className="mr-2" /> Capturer
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    <X size={18} className="mr-2" /> Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {isProcessing ? (
                  <div className="py-10 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Analyse des produits...</p>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileInput}
                    />
                    <Upload size={32} className="text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 mb-2">Glissez une photo ou cliquez pour sélectionner</p>
                    <Button variant="outline" onClick={startCamera} className="mt-2">
                      <Camera size={18} className="mr-2" /> Prendre une photo
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {fridgeItems.map(item => (
              <Card key={item.product.id} className={`overflow-hidden hover:shadow-md transition-shadow`}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                    <button
                      className="text-red-500 -mt-1 -mr-1"
                      onClick={() => removeFromFridge(item.product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {item.expiryDate && (
                    <p className={`text-xs mb-1 ${isAboutToExpire(item.expiryDate) ? 'text-orange-500' : 'text-gray-500'}`}>
                      Expire: {formatExpiryDate(item.expiryDate)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-1">
                    <button
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300"
                      onClick={() => updateFridgeItemQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    
                    <span className="text-sm">{item.quantity}</span>
                    
                    <button
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300"
                      onClick={() => updateFridgeItemQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={handleAddManualProduct} className="flex items-center">
              <PlusCircle size={18} className="mr-2" /> Ajouter manuellement
            </Button>
            <Button onClick={navigateToSuggestions} className="flex items-center">
              <ArrowRight size={18} className="mr-2" /> Générer des plats
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          {isFirstTime ? (
            <>
              <Refrigerator size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">Bienvenue dans votre frigo virtuel !</p>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Prenez une photo de vos aliments ou ajoutez-les manuellement pour commencer à recevoir des suggestions de recettes.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button onClick={startCamera} className="flex items-center justify-center">
                  <Camera size={18} className="mr-2" /> Prendre une photo
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center">
                  <Upload size={18} className="mr-2" /> Importer une image
                </Button>
                <Button variant="outline" onClick={handleAddManualProduct} className="flex items-center justify-center">
                  <PlusCircle size={18} className="mr-2" /> Ajouter manuellement
                </Button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </div>
            </>
          ) : (
            <>
              <Refrigerator size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Votre frigo est vide</p>
              <p className="text-sm text-gray-400 mt-2 mb-6">Ajoutez des produits à votre frigo pour recevoir des suggestions de recettes</p>
              
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button onClick={startCamera} className="flex items-center justify-center">
                  <Camera size={18} className="mr-2" /> Prendre une photo
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center">
                  <Upload size={18} className="mr-2" /> Importer une image
                </Button>
                <Button variant="outline" onClick={handleAddManualProduct} className="flex items-center justify-center">
                  <PlusCircle size={18} className="mr-2" /> Ajouter manuellement
                </Button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </div>
            </>
          )}
        </div>
      )}

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium">Nom du produit</label>
              <Input 
                id="product-name"
                placeholder="Ex: Tomates"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-quantity" className="text-sm font-medium">Quantité</label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setNewProduct({...newProduct, quantity: Math.max(1, newProduct.quantity - 1)})}
                >
                  <Minus size={14} />
                </Button>
                <Input
                  id="product-quantity"
                  type="number"
                  min="1"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 1})}
                  className="h-8 mx-2 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setNewProduct({...newProduct, quantity: newProduct.quantity + 1})}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-expiry" className="text-sm font-medium">Date d'expiration (optionnelle)</label>
              <Input 
                id="product-expiry"
                type="date"
                value={newProduct.expiryDate}
                onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
              Annuler
            </Button>
            <Button onClick={submitNewProduct}>
              <Plus size={18} className="mr-2" /> Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prévisualisation de l'image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Prévisualisation" 
                className="rounded-lg max-h-80 object-contain"
              />
            )}
            <div className="flex space-x-4 w-full">
              <Button variant="outline" onClick={() => {
                setCapturedImage(null);
                setIsPreviewOpen(false);
              }} className="flex-1">
                <X size={18} className="mr-2" /> Annuler
              </Button>
              <Button onClick={() => capturedImage && sendFridgeImage(capturedImage)} className="flex-1" disabled={isProcessing}>
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Check size={18} className="mr-2" />
                )}
                {isProcessing ? 'Traitement...' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FridgePage;
