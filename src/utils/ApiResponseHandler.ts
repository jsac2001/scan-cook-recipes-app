
import { Product, Recipe, FridgeItem } from '../types';

// Types pour les réponses API
export interface ApiBaseResponse {
  status: string;
  action: string;
  response_type: "batch" | "single";
  metadata: {
    timestamp: string;
    api_version: string;
    source: string;
  };
}

export interface RecipeRecommendationBatchResponse extends ApiBaseResponse {
  response_type: "batch";
  batch_size: number;
  action: "RECIPE_RECOMMENDATION";
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
  }[];
}

export interface FridgeCheckResponse extends ApiBaseResponse {
  response_type: "single";
  action: "FRIDGE_CHECK";
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
}

// Type pour représenter n'importe quel type de réponse
export type ApiResponse = RecipeRecommendationBatchResponse | FridgeCheckResponse;

// Classe utilitaire qui gère les réponses API
export class ApiResponseHandler {
  private response: ApiResponse | null;

  constructor(response: ApiResponse | null = null) {
    this.response = response;
  }

  // Setter pour mettre à jour la réponse
  setResponse(response: ApiResponse): void {
    this.response = response;
  }

  // Détermine le type de réponse
  getResponseType(): string | null {
    if (!this.response) return null;
    return this.response.action;
  }

  // Vérifie si la réponse est un batch de recettes
  isRecipeBatch(): boolean {
    return this.response?.action === 'RECIPE_RECOMMENDATION' && this.response?.response_type === 'batch';
  }

  // Vérifie si la réponse est une analyse de frigo
  isFridgeCheck(): boolean {
    return this.response?.action === 'FRIDGE_CHECK';
  }

  // Normalise les données de recettes dans le format attendu par l'application
  normalizeRecipes(): Recipe[] {
    if (!this.isRecipeBatch() || !this.response) return [];

    const batchResponse = this.response as RecipeRecommendationBatchResponse;
    
    return batchResponse.data.map((item, index) => {
      const recipeData = item.recipe;
      
      return {
        id: `recipe-${index}-${Date.now()}`,
        name: recipeData.name,
        imageUrl: recipeData.image_url,
        ingredients: recipeData.ingredients.map((ingredient, idx) => ({
          id: `ingredient-${idx}`,
          name: ingredient,
        })),
        duration: recipeData.preparation_time,
        difficulty: this.normalizeDifficulty(recipeData.difficulty),
        instructions: recipeData.instructions,
        tags: recipeData.dietary_type,
        totalCost: recipeData.estimated_cost,
        costPerServing: recipeData.estimated_cost / 2, // Estimation basique
      };
    });
  }

  // Normalise les données du frigo dans le format attendu
  normalizeFridgeItems(): { items: FridgeItem[], summary: any } {
    if (!this.isFridgeCheck() || !this.response) return { items: [], summary: null };

    const fridgeResponse = this.response as FridgeCheckResponse;
    
    const items = fridgeResponse.data.detected_items.map(item => ({
      product: {
        id: item.id,
        name: item.name,
        category: item.category,
      },
      quantity: 1, // Par défaut
      expiryDate: item.expiry_estimation 
        ? new Date(Date.now() + this.parseExpiryDays(item.expiry_estimation) * 24 * 60 * 60 * 1000) 
        : undefined,
    }));

    return {
      items,
      summary: fridgeResponse.data.fridge_summary,
    };
  }

  // Normalise le niveau de difficulté
  private normalizeDifficulty(difficulty: string): "facile" | "moyen" | "difficile" {
    const difficultyMap: Record<string, "facile" | "moyen" | "difficile"> = {
      'easy': 'facile',
      'medium': 'moyen',
      'hard': 'difficile',
      'facile': 'facile',
      'moyen': 'moyen',
      'difficile': 'difficile',
    };

    return difficultyMap[difficulty.toLowerCase()] || 'moyen';
  }

  // Parse le nombre de jours d'expiration à partir d'une chaîne comme "7 jours"
  private parseExpiryDays(expiryString: string): number {
    const match = expiryString.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 30; // Défaut à 30 jours si non parsable
  }

  // Vérifie si la réponse indique un succès
  isSuccess(): boolean {
    return this.response?.status === 'success';
  }

  // Vérifie si l'API a retourné des métadonnées
  hasMetadata(): boolean {
    return !!this.response?.metadata;
  }

  // Récupère les métadonnées
  getMetadata(): any | null {
    return this.response?.metadata || null;
  }

  // Récupère la taille du batch (pour les recettes)
  getBatchSize(): number {
    if (this.isRecipeBatch() && this.response) {
      return (this.response as RecipeRecommendationBatchResponse).batch_size || 0;
    }
    return 0;
  }
}

export default ApiResponseHandler;
