
import { useState } from 'react';
import { Recipe } from '../types';
import ApiResponseHandler, { ApiResponse } from '../utils/ApiResponseHandler';

export const useScanCookAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiHandler] = useState(new ApiResponseHandler());

  const fetchFromAPI = async (url: string, payload: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      apiHandler.setResponse(data as ApiResponse);
      setIsLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const normalizeRecipeData = (apiResponse: ApiResponse | null): Recipe[] => {
    if (!apiResponse) return [];

    apiHandler.setResponse(apiResponse as ApiResponse);
    return apiHandler.normalizeRecipes();
  };

  const normalizeFridgeData = (apiResponse: ApiResponse | null) => {
    if (!apiResponse) return { items: [], summary: null };

    apiHandler.setResponse(apiResponse as ApiResponse);
    return apiHandler.normalizeFridgeItems();
  };

  return {
    isLoading,
    error,
    fetchFromAPI,
    normalizeRecipeData,
    normalizeFridgeData,
    apiHandler,
  };
};

export default useScanCookAPI;
