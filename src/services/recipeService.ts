
import { Recipe, Product } from '../types';

// Données fictives pour simuler une API de recettes
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Pasta Carbonara',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=300',
    ingredients: [
      { id: '2', name: 'Pâtes complètes', brand: 'Panzani', price: 1.89 },
      { id: '3', name: 'Œufs', price: 2.50 },
      { id: '4', name: 'Parmesan', price: 3.75 },
      { id: '5', name: 'Lardons', price: 2.30 }
    ],
    duration: 20,
    difficulty: 'facile',
    costPerServing: 2.61,
    totalCost: 10.44,
    tags: ['rapide', 'budget'],
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
      { id: '6', name: 'Quinoa', price: 3.99 },
      { id: '7', name: 'Courgette', price: 1.20 },
      { id: '8', name: 'Poivron', price: 1.50 },
      { id: '9', name: 'Feta', price: 2.80 }
    ],
    duration: 25,
    difficulty: 'moyen',
    costPerServing: 2.37,
    totalCost: 9.49,
    tags: ['santé'],
    instructions: [
      'Cuire le quinoa selon les instructions du paquet.',
      'Couper les légumes et les faire griller.',
      'Mélanger le quinoa et les légumes grillés.',
      'Ajouter la feta émiettée et un filet d\'huile d\'olive.'
    ]
  },
  {
    id: '3',
    name: 'Risotto aux champignons',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=300',
    ingredients: [
      { id: '10', name: 'Riz arborio', price: 2.99 },
      { id: '11', name: 'Champignons de Paris', price: 2.50 },
      { id: '12', name: 'Oignon', price: 0.80 },
      { id: '13', name: 'Bouillon de légumes', price: 1.20 },
      { id: '14', name: 'Vin blanc', price: 4.50 }
    ],
    duration: 40,
    difficulty: 'difficile',
    costPerServing: 3.00,
    totalCost: 11.99,
    tags: ['budget'],
    instructions: [
      'Faire revenir l\'oignon émincé.',
      'Ajouter le riz et le faire nacrer.',
      'Déglacer avec le vin blanc.',
      'Ajouter le bouillon petit à petit en remuant.',
      'Incorporer les champignons et finir la cuisson.'
    ]
  },
  {
    id: '4',
    name: 'Bowl de lait et céréales',
    imageUrl: 'https://images.unsplash.com/photo-1521483451569-e33803c5027c?auto=format&fit=crop&q=80&w=300',
    ingredients: [
      { id: '15', name: 'Lait demi-écrémé', brand: 'Lactel', price: 1.15 },
      { id: '16', name: 'Céréales', price: 3.20 },
      { id: '17', name: 'Fruits rouges', price: 3.50 }
    ],
    duration: 5,
    difficulty: 'facile',
    costPerServing: 3.93,
    totalCost: 7.85,
    tags: ['rapide', 'santé'],
    instructions: [
      'Verser les céréales dans un bol.',
      'Ajouter le lait.',
      'Garnir de fruits rouges.'
    ]
  }
];

// Simuler un délai réseau avec Promise
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRecommendedRecipes = async (
  scannedProducts: Product[],
  filters: string[] = []
): Promise<Recipe[]> => {
  // Simuler un délai réseau
  await delay(1000);
  
  // Filtrer les recettes en fonction des filtres sélectionnés
  let filteredRecipes = [...mockRecipes];
  
  if (filters.length > 0) {
    filteredRecipes = mockRecipes.filter(recipe => 
      filters.some(filter => recipe.tags?.includes(filter))
    );
  }
  
  // Simuler la pertinence en fonction des produits scannés
  // Dans un cas réel, ce serait fait par l'API
  if (scannedProducts.length > 0) {
    // Tri basique : si un produit scanné est dans les ingrédients, la recette est mise en avant
    filteredRecipes.sort((a, b) => {
      const aHasScannedProduct = a.ingredients.some(ingredient => 
        scannedProducts.some(product => product.name.toLowerCase().includes(ingredient.name.toLowerCase()))
      );
      
      const bHasScannedProduct = b.ingredients.some(ingredient => 
        scannedProducts.some(product => product.name.toLowerCase().includes(ingredient.name.toLowerCase()))
      );
      
      if (aHasScannedProduct && !bHasScannedProduct) return -1;
      if (!aHasScannedProduct && bHasScannedProduct) return 1;
      return 0;
    });
  }
  
  return filteredRecipes;
};

