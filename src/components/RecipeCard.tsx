
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, Tag, ShoppingCart, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
  onShowDetails?: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onShowDetails }) => {
  const navigate = useNavigate();
  const { addRecipeToCart } = useAppContext();
  
  const handleAddToCart = () => {
    addRecipeToCart(recipe);
  };
  
  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails(recipe);
    }
    // Rediriger vers la page de détail de la recette
    navigate(`/recipe/${recipe.id}`);
  };
  
  return (
    <Card className="overflow-hidden mb-4 transition-all duration-200 hover:shadow-md animate-fade-in">
      <div className="flex flex-col md:flex-row">
        <div 
          className="w-full md:w-1/3 h-32 bg-cover bg-center"
          style={{ backgroundImage: recipe.imageUrl ? `url(${recipe.imageUrl})` : 'none' }}
        >
          {!recipe.imageUrl && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Tag size={24} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{recipe.name}</h3>
            
            <div className="flex items-center text-sm text-gray-600 gap-4 mb-2">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                {recipe.duration} min
              </div>
              {recipe.difficulty && (
                <div className="flex items-center">
                  <ChefHat size={16} className="mr-1" />
                  {recipe.difficulty}
                </div>
              )}
            </div>
            
            {recipe.totalCost && (
              <div className="flex flex-col text-sm mb-2">
                <span className="text-primary font-bold">
                  {recipe.totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
                {recipe.costPerServing && (
                  <span className="text-xs text-gray-500">
                    {recipe.costPerServing.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} / portion
                  </span>
                )}
              </div>
            )}
            
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {recipe.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      tag === 'budget' ? 'bg-blue-100 text-blue-800' : 
                      tag === 'santé' ? 'bg-green-100 text-green-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 pt-0 gap-2">
            <Button 
              variant="default" 
              className="flex-1" 
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} className="mr-2" /> Bundle
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleShowDetails}
            >
              <ArrowRight size={16} className="mr-2" /> Détails
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
