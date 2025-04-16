
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterTags from '../components/FilterTags';
import RecipeCard from '../components/RecipeCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useScanCookAPI } from '../hooks/useScanCookAPI';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SuggestionsPage: React.FC = () => {
  const { scannedProducts, fridgeItems, suggestedRecipes, setSuggestedRecipes } = useAppContext();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedRecipe, setDisplayedRecipe] = useState<Recipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { fetchFromAPI, normalizeRecipeData, isLoading: apiLoading, error } = useScanCookAPI();
  
  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Crée un payload pour notre API n8n
      const payload = {
        user_id: "test_user_123",
        request_type: "recipe_recommendation",
        content: {
          text: "Suggère-moi des recettes basées sur mes produits scannés",
          context: {
            location: "suggestions_page",
            scanned_products: scannedProducts.map(product => ({
              id: product.id,
              name: product.name,
              category: product.category || "Non catégorisé",
              barcode: product.barcode
            })),
            fridge_items: fridgeItems.map(item => ({
              id: item.product.id,
              name: item.product.name,
              category: item.product.category || "Non catégorisé",
              quantity: item.quantity,
              expiry_date: item.expiryDate
            })),
            filters: selectedFilters
          }
        }
      };
      
      // Appel à l'API n8n
      const response = await fetchFromAPI("http://localhost:5678/webhook-test/assistant", payload);
      
      if (response) {
        // Normalise les données de recettes
        const normalizedRecipes = normalizeRecipeData(response);
        setSuggestedRecipes(normalizedRecipes);
        
        // Met à jour la pagination si c'est un batch
        if (Array.isArray(response) && response.length > 0) {
          setTotalPages(response[0].total_recipes || 1);
        }
      } else {
        // Si l'API échoue, utilise le service de recettes local comme fallback
        const fakeFetch = async () => {
          const { fetchRecommendedRecipes } = await import('../services/recipeService');
          const fallbackRecipes = await fetchRecommendedRecipes(scannedProducts, selectedFilters);
          setSuggestedRecipes(fallbackRecipes);
        };
        fakeFetch();
        toast.info("Utilisation des recettes locales (API indisponible)");
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes :', error);
      toast.error('Impossible de charger les recettes');
    } finally {
      setIsLoading(false);
    }
  }, [scannedProducts, fridgeItems, selectedFilters, fetchFromAPI, normalizeRecipeData, setSuggestedRecipes]);
  
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);
  
  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };
  
  const handleShowDetails = (recipe: Recipe) => {
    setDisplayedRecipe(recipe);
    toast.info(`Affichage des détails de ${recipe.name}`);
    // Dans une version plus complète, on naviguerait vers une page de détails
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Dans une implémentation réelle, on pourrait recharger les données ou filtrer le lot actuel
    toast.info(`Page ${page}/${totalPages}`);
  };
  
  const filteredRecipes = suggestedRecipes.filter(recipe => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.some(filter => recipe.tags?.includes(filter));
  });
  
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
      
      {(isLoading || apiLoading) ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={32} className="text-primary animate-spin mb-4" />
          <p className="text-gray-500">Recherche des meilleures recettes...</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)] pr-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
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
      
      {filteredRecipes.length > 0 && totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    onClick={() => handlePageChange(page)} 
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPage;
