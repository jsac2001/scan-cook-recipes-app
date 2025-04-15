
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ChefHat, ArrowRight } from 'lucide-react';

// Données fictives pour simuler des recettes suggérées
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Pasta Carbonara',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=300',
    ingredients: [
      { id: '2', name: 'Pâtes complètes' },
      { id: '3', name: 'Œufs' },
      { id: '4', name: 'Parmesan' },
      { id: '5', name: 'Lardons' }
    ],
    duration: 20,
    difficulty: 'facile',
    instructions: [
      'Faire cuire les pâtes al dente.',
      'Dans un bol, battre les œufs avec le parmesan râpé.',
      'Faire revenir les lardons à sec.',
      'Égoutter les pâtes et les mélanger hors du feu avec les œufs et les lardons.'
    ]
  },
  {
    id: '2',
    name: 'Salade de quinoa aux légumes grillés',
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=300',
    ingredients: [
      { id: '6', name: 'Quinoa' },
      { id: '7', name: 'Courgette' },
      { id: '8', name: 'Poivron' },
      { id: '9', name: 'Feta' }
    ],
    duration: 25,
    difficulty: 'moyen',
    instructions: [
      'Cuire le quinoa selon les instructions du paquet.',
      'Couper les légumes et les faire griller.',
      'Mélanger le quinoa et les légumes grillés.',
      'Ajouter la feta émiettée et un filet d\'huile d\'olive.'
    ]
  }
];

const SuggestionsPage = () => {
  const { scannedProducts, fridgeItems } = useAppContext();
  
  // Dans une version réelle, on utiliserait les produits scannés et les produits du frigo
  // pour obtenir des recettes pertinentes via une API
  
  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Suggestions de recettes</h1>
      
      {scannedProducts.length > 0 || fridgeItems.length > 0 ? (
        <p className="text-sm text-gray-600 mb-6">
          Basées sur {scannedProducts.length} produits scannés et {fridgeItems.length} produits dans votre frigo
        </p>
      ) : (
        <p className="text-sm text-gray-600 mb-6">
          Scannez des produits ou ajoutez-les à votre frigo pour obtenir des suggestions personnalisées
        </p>
      )}
      
      <div className="grid gap-6">
        {mockRecipes.map(recipe => (
          <Card key={recipe.id} className="overflow-hidden">
            <div className="flex">
              {recipe.imageUrl && (
                <div className="w-1/3 h-32 bg-cover bg-center" style={{ backgroundImage: `url(${recipe.imageUrl})` }} />
              )}
              <div className="w-2/3">
                <CardHeader className="p-3">
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center text-sm text-gray-600 gap-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {recipe.duration} min
                    </div>
                    <div className="flex items-center">
                      <ChefHat size={16} className="mr-1" />
                      {recipe.difficulty}
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    {recipe.ingredients.slice(0, 2).map(i => i.name).join(', ')}
                    {recipe.ingredients.length > 2 ? ` et ${recipe.ingredients.length - 2} autres` : ''}
                  </p>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <div className="text-primary flex items-center text-sm">
                    Voir la recette <ArrowRight size={16} className="ml-1" />
                  </div>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {mockRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune suggestion pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPage;
