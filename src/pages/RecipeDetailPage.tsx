
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Recipe, Product } from '../types';
import { fetchRecipeById } from '../services/recipeService';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Clock, 
  ShoppingCart, 
  Plus, 
  Minus,
  Utensils,
  Star 
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-5xl mb-4">👨‍🍳</div>
        <h2 className="font-heading text-xl font-semibold mb-2">Recette non trouvée</h2>
        <p className="text-muted mb-6 text-center">
          Nous n'avons pas trouvé la recette que vous cherchez.
        </p>
        <Button variant="outline" onClick={() => navigate('/suggestions')} className="font-medium">
          <ArrowLeft size={18} className="mr-2" />
          Retour aux suggestions
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-background animate-fade-in">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="w-full h-[40vh] bg-cover bg-center relative"
          style={{ 
            backgroundImage: recipe.imageUrl ? `url(${recipe.imageUrl})` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10" />
          
          {!recipe.imageUrl && (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <Utensils className="w-16 h-16 text-neutral-400" />
            </div>
          )}
          
          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 backdrop-blur-sm hover:bg-white/95"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} className="mr-1" />
              Retour
            </Button>
          </div>
        </div>

        {/* Recipe Info Card */}
        <Card className="mx-4 -mt-20 relative z-10">
          <CardContent className="pt-6">
            <h1 className="font-heading text-2xl font-bold mb-2">{recipe.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
              {recipe.duration && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-primary" />
                  {recipe.duration} min
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-secondary" />
                  {recipe.difficulty}
                </div>
              )}
              {recipe.tags && recipe.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="bg-accent/5 hover:bg-accent/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Servings Control */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium">Portions</span>
              <div className="flex items-center rounded-full bg-neutral-100 p-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={decreaseServings}
                  disabled={servings <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-10 text-center font-medium">{servings}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={increaseServings}
                  disabled={servings >= 12}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="font-heading font-semibold text-xl mb-4">Ingrédients</h2>
              <Card className="bg-neutral-50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {adjustedIngredients.map((ingredient, index) => (
                      <div key={ingredient.id} className="flex justify-between items-center">
                        <span className="text-gray-800">{ingredient.name}</span>
                        <span className="text-primary font-medium">
                          {ingredient.price?.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </span>
                        {index < adjustedIngredients.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="font-heading font-semibold text-xl mb-4">Préparation</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-none">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-gray-700 flex-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Prix total */}
            {recipe.totalCost && (
              <Card className="bg-primary/5 mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Prix total</span>
                    <span className="text-lg font-semibold text-primary">
                      {(recipe.totalCost * (servings / 4)).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </div>
                  {recipe.costPerServing && (
                    <div className="flex justify-between items-center text-sm text-muted mt-1">
                      <span>Prix par portion</span>
                      <span>
                        {recipe.costPerServing.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full py-6 hover:scale-[1.02] transition-transform"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} className="mr-2" />
              Ajouter bundle au panier
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
