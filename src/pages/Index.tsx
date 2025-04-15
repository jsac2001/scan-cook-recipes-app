
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page scanner
    navigate('/scanner');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold text-primary mb-4">ScanCook</h1>
        <p className="text-xl text-gray-600">Chargement de l'application...</p>
        <div className="mt-8 w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
