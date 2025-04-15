
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Recipe, Product } from '../types';
import { fetchRecipeById } from '../services/recipeService';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, ShoppingCart, Plus, Minus, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addRecipeToCart } = useAppContext();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [servings, setServings] = useState(4);
  const [adjustedIngredients, setAdjustedIngredients] = useState<Product[]>([]);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const recipeData = await fetchRecipeById(id);
        setRecipe(recipeData);
        
        // Initialiser les ingrédients ajustés
        if (recipeData?.ingredients) {
          setAdjustedIngredients(recipeData.ingredients);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la recette:', error);
        toast.error('Impossible de charger les détails de cette recette');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipe();
  }, [id]);

  // Ajuster les quantités en fonction du nombre de portions
  useEffect(() => {
    if (!recipe) return;
    
    // Pour une implémentation complète, il faudrait des quantités spécifiques
    // Ici on simule juste l'ajustement en fonction des parts
    const baseServings = 4; // Supposons que toutes les recettes sont pour 4 personnes par défaut
    const ratio = servings / baseServings;
    
    // Ajuster les prix des ingrédients en fonction du ratio
    const adjusted = recipe.ingredients.map(ingredient => {
      if (ingredient.price) {
        return {
          ...ingredient,
          price: parseFloat((ingredient.price * ratio).toFixed(2))
        };
      }
      return ingredient;
    });
    
    setAdjustedIngredients(adjusted);
  }, [recipe, servings]);

  const handleAddToCart = () => {
    if (!recipe) return;
    
    // Utiliser les ingrédients ajustés pour le panier
    const recipeWithAdjustedIngredients = {
      ...recipe,
      ingredients: adjustedIngredients
    };
    
    addRecipeToCart(recipeWithAdjustedIngredients);
  };

  const increaseServings = () => {
    if (servings < 12) {  // Maximum 12 portions
      setServings(servings + 1);
    }
  };

  const decreaseServings = () => {
    if (servings > 1) {  // Minimum 1 portion
      setServings(servings - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-2">Recette non trouvée</h2>
        <p className="text-gray-600 mb-6">Nous n'avons pas trouvé la recette demandée.</p>
        <Button variant="outline" onClick={() => navigate('/suggestions')}>
          <ArrowLeft size={18} className="mr-2" />
          Retour aux suggestions
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fade-in">
      <div className="relative">
        {/* Image de la recette */}
        <div 
          className="w-full h-[30vh] bg-cover bg-center"
          style={{ 
            backgroundImage: recipe.imageUrl ? `url(${recipe.imageUrl})` : 'none',
            backgroundPosition: 'center 40%'
          }}
        >
          {!recipe.imageUrl && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <img src="/placeholder.svg" alt="placeholder" className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Bouton retour */}
          <div className="absolute top-4 left-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} className="mr-1" />
              Retour
            </Button>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
          
          <div className="flex items-center text-sm text-gray-600 gap-4 mb-6">
            {recipe.duration && (
              <div className="flex items-center">
                <Clock size={18} className="mr-1" />
                {recipe.duration} min
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center">
                <ChefHat size={18} className="mr-1" />
                {recipe.difficulty}
              </div>
            )}
            <div className="ml-auto">
              <div className="flex items-center rounded-full bg-gray-100 p-1">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  onClick={decreaseServings}
                  disabled={servings <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{servings}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  onClick={increaseServings}
                  disabled={servings >= 12}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">portions</p>
            </div>
          </div>
          
          {/* Ingrédients */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Ingrédients</h2>
            <div className="space-y-2">
              {adjustedIngredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex justify-between items-center">
                  <span className="text-gray-800">{ingredient.name}</span>
                  <span className="text-gray-600 font-medium">
                    {ingredient.price?.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </span>
                  {index < adjustedIngredients.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Préparation</h2>
            <ol className="list-decimal pl-5 space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-800">{instruction}</li>
              ))}
            </ol>
          </div>
          
          {/* Prix total */}
          {recipe.totalCost && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Prix total</span>
                <span className="text-lg font-semibold text-primary">
                  {(recipe.totalCost * (servings / 4)).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              {recipe.costPerServing && (
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <span>Prix par portion</span>
                  <span>
                    {recipe.costPerServing.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Bouton d'ajout au panier */}
          <Button 
            className="w-full py-6"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} className="mr-2" />
            Ajouter bundle au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
