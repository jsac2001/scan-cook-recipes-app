
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';
import { fetchRecommendedRecipes } from '../services/recipeService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from 'lucide-react';
import FilterTags from '../components/FilterTags';
import RecipeCard from '../components/RecipeCard';
import { toast } from 'sonner';

const SuggestionsPage: React.FC = () => {
  const { scannedProducts, fridgeItems, suggestedRecipes, setSuggestedRecipes } = useAppContext();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedRecipe, setDisplayedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoading(true);
      try {
        const recipes = await fetchRecommendedRecipes(scannedProducts, selectedFilters);
        setSuggestedRecipes(recipes);
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes :', error);
        toast.error('Impossible de charger les recettes');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [scannedProducts, selectedFilters, setSuggestedRecipes]);

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleShowDetails = (recipe: Recipe) => {
    setDisplayedRecipe(recipe);
    toast.info(`Affichage des détails de ${recipe.name}`);
    // Dans une version plus complète, on naviguerait vers une page de détails
  };

  return (
    <div className="p-6 pb-20 animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Suggestions de recettes</h1>
        
        <p className="text-sm text-gray-600 mt-1">
          Basées sur {scannedProducts.length} produit{scannedProducts.length > 1 ? 's' : ''} scanné{scannedProducts.length > 1 ? 's' : ''} et {fridgeItems.length} produit{fridgeItems.length > 1 ? 's' : ''} dans votre frigo
        </p>
      </div>
      
      <FilterTags 
        selectedFilters={selectedFilters} 
        onChange={handleFilterChange} 
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={32} className="text-primary animate-spin mb-4" />
          <p className="text-gray-500">Recherche des meilleures recettes...</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-230px)] pr-4">
          {suggestedRecipes.length > 0 ? (
            suggestedRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onShowDetails={handleShowDetails} 
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">Aucune recette ne correspond à vos critères</p>
              {selectedFilters.length > 0 && (
                <p className="text-sm text-gray-400">
                  Essayez de modifier vos filtres ou de scanner d'autres produits
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default SuggestionsPage;
