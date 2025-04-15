
import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { ScanResult } from '../types';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  isScanning: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, isScanning }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [scanningLine, setScanningLine] = useState<number>(25);
  const scannerHeight = 300; // hauteur fixe du scanner

  // Animation de la ligne de scan
  useEffect(() => {
    if (isScanning) {
      let direction = 1;
      let position = 25;
      
      const animationInterval = setInterval(() => {
        position += 3 * direction;
        
        if (position >= 75) {
          direction = -1;
        } else if (position <= 25) {
          direction = 1;
        }
        
        setScanningLine(position);
      }, 50);
      
      return () => clearInterval(animationInterval);
    }
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning || !videoRef.current) return;

    // Configuration de Quagga
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: videoRef.current,
        constraints: {
          width: { min: 300 },
          height: { min: 300 },
          facingMode: "environment", // utiliser la caméra arrière
          aspectRatio: { min: 1, max: 2 }
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 2,
      frequency: 10,
      decoder: {
        readers: ["ean_reader", "ean_8_reader", "code_128_reader"]
      },
      locate: true
    }, (err) => {
      if (err) {
        console.error("Erreur d'initialisation de Quagga:", err);
        return;
      }
      
      // Démarrer Quagga
      Quagga.start();
      
      // Configuration de la détection de code-barres
      Quagga.onDetected((data: ScanResult) => {
        // Arrêter Quagga après la détection
        Quagga.stop();
        
        // Appeler le callback avec le code-barres détecté
        if (data && data.codeResult) {
          onDetected(data.codeResult.code);
        }
      });
    });

    // Nettoyage lors du démontage du composant
    return () => {
      Quagga.stop();
    };
  }, [isScanning, onDetected]);

  return (
    <div className="w-full relative overflow-hidden">
      <div 
        ref={videoRef} 
        className="w-full rounded-lg overflow-hidden"
        style={{ height: `${scannerHeight}px` }}
      />
      
      {isScanning && (
        <>
          {/* Cadre de viseur */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-primary w-4/5 h-2/3 rounded-lg"></div>
          </div>
          
          {/* Ligne de scan */}
          <div 
            className="absolute left-0 right-0 h-0.5 bg-primary/50 pointer-events-none"
            style={{ top: `${scanningLine}%`, boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)' }}
          />
        </>
      )}
      
      <style>
        {`
          .drawingBuffer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default BarcodeScanner;
