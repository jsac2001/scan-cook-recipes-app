
import { useState } from 'react';
import { Recipe, Product } from '../types';

interface RecipeRecommendation {
  status: string;
  action: string;
  recipe_index: number;
  total_recipes: number;
  data: {
    product: {
      id: string;
      name: string;
      brand: string;
      image_url: string;
      categories: string[];
    };
    recipe: {
      name: string;
      image_url: string;
      preparation_time: number;
      difficulty: string;
      ingredients: string[];
      instructions: string[];
      estimated_cost: number;
      dietary_type: string[];
      compatibility: number;
    };
  };
  message: {
    type: string;
    content: string;
  };
}

interface FridgeAnalysis {
  status: string;
  action: string;
  data: {
    detected_items: {
      id: string;
      name: string;
      category: string;
      confidence: number;
      quantity_estimation: string;
      expiry_estimation: string;
    }[];
    fridge_summary: {
      total_items: number;
      categories: string[];
      expiring_soon: string[];
    };
  };
  messages: {
    type: string;
    content: string;
  }[];
}

type APIPossibleResponse = RecipeRecommendation[] | FridgeAnalysis;

export const useScanCookAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setIsLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const normalizeRecipeData = (apiResponse: APIPossibleResponse): Recipe[] => {
    if (!apiResponse) return [];

    // Vérifier s'il s'agit d'un tableau (batch de recettes)
    if (Array.isArray(apiResponse)) {
      return apiResponse.map((item: RecipeRecommendation) => {
        const recipeData = item.data.recipe;
        
        return {
          id: `recipe-${item.recipe_index}-${Date.now()}`,
          name: recipeData.name,
          imageUrl: recipeData.image_url,
          ingredients: recipeData.ingredients.map((ingredient, index) => ({
            id: `ingredient-${index}`,
            name: ingredient,
          })),
          duration: recipeData.preparation_time,
          difficulty: recipeData.difficulty as 'facile' | 'moyen' | 'difficile',
          instructions: recipeData.instructions,
          tags: recipeData.dietary_type,
          totalCost: recipeData.estimated_cost,
          costPerServing: recipeData.estimated_cost / 2, // Estimation basique
        };
      });
    }

    // Si c'est un objet unique et une analyse de frigo, retourner un tableau vide
    return [];
  };

  const normalizeFridgeData = (apiResponse: APIPossibleResponse) => {
    if (!apiResponse || Array.isArray(apiResponse)) return { items: [], summary: null };

    if (apiResponse.action === 'FRIDGE_CHECK') {
      const fridgeAnalysis = apiResponse as FridgeAnalysis;
      
      const items = fridgeAnalysis.data.detected_items.map(item => ({
        product: {
          id: item.id,
          name: item.name,
          category: item.category,
        },
        quantity: 1, // Par défaut, on suppose 1 unité
        expiryDate: item.expiry_estimation ? new Date(Date.now() + parseInt(item.expiry_estimation) * 24 * 60 * 60 * 1000) : undefined,
      }));

      return {
        items,
        summary: fridgeAnalysis.data.fridge_summary,
      };
    }

    return { items: [], summary: null };
  };

  return {
    isLoading,
    error,
    fetchFromAPI,
    normalizeRecipeData,
    normalizeFridgeData,
  };
};
