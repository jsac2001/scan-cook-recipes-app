
import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { ScanResult } from '../types';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  isScanning: boolean;
}

const BarcodeScanner = ({ onDetected, isScanning }: BarcodeScannerProps) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isScanning) {
      Quagga.stop();
      return;
    }

    if (scannerRef.current) {
      const initQuagga = async () => {
        try {
          await Quagga.init({
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: scannerRef.current!,
              constraints: {
                facingMode: 'environment', // Utiliser la caméra arrière
                width: { min: 450 },
                height: { min: 300 },
                aspectRatio: { min: 1, max: 2 }
              },
            },
            locator: {
              patchSize: 'medium',
              halfSample: true
            },
            numOfWorkers: navigator.hardwareConcurrency || 4,
            frequency: 10,
            decoder: {
              readers: ['ean_reader', 'ean_8_reader', 'code_128_reader']
            },
            locate: true
          });

          Quagga.start();
          setCameraError(null);
        } catch (error) {
          console.error('Erreur d\'initialisation de la caméra:', error);
          setCameraError('Impossible d\'accéder à la caméra. Veuillez vérifier les autorisations.');
        }
      };

      // Gestionnaire d'événement pour la détection de code-barres
      Quagga.onDetected((result: ScanResult) => {
        if (result.codeResult.code) {
          // Vibration si disponible
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
          
          onDetected(result.codeResult.code);
          
          // Arrêter brièvement le scanner pour éviter les scans multiples
          Quagga.stop();
          setTimeout(() => {
            if (isScanning && scannerRef.current) {
              Quagga.start();
            }
          }, 1500);
        }
      });

      initQuagga();

      // Nettoyer lors du démontage du composant
      return () => {
        Quagga.offDetected();
        Quagga.stop();
      };
    }
  }, [onDetected, isScanning]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-black">
      {cameraError ? (
        <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-900 text-white p-4 text-center">
          <p>{cameraError}</p>
        </div>
      ) : (
        <>
          <div 
            ref={scannerRef} 
            className="w-full aspect-[4/3] overflow-hidden"
          >
            {/* Le flux vidéo sera injecté ici par Quagga */}
          </div>
          <div className="scan-line"></div>
        </>
      )}
      <style jsx>{`
        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background-color: rgba(59, 130, 246, 0.7);
          top: 50%;
          animation: scan 2s linear infinite;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
        }
        
        @keyframes scan {
          0% {
            top: 20%;
          }
          50% {
            top: 80%;
          }
          100% {
            top: 20%;
          }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
