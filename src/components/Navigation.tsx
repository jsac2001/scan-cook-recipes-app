
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scan, ChefHat, ShoppingCart, Refrigerator } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navigation = () => {
  const { cartItems } = useAppContext();
  
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-200 h-16 px-4">
      <NavLink 
        to="/scanner" 
        className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`}
      >
        <Scan size={20} />
        <span className="text-xs mt-1">Scanner</span>
      </NavLink>
      
      <NavLink 
        to="/suggestions" 
        className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`}
      >
        <ChefHat size={20} />
        <span className="text-xs mt-1">Suggestions</span>
      </NavLink>
      
      <NavLink 
        to="/cart" 
        className={({ isActive }) => `flex flex-col items-center relative ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`}
      >
        <ShoppingCart size={20} />
        {totalCartItems > 0 && (
          <span className="absolute -top-1 -right-2 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {totalCartItems > 9 ? '9+' : totalCartItems}
          </span>
        )}
        <span className="text-xs mt-1">Panier</span>
      </NavLink>
      
      <NavLink 
        to="/fridge" 
        className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`}
      >
        <Refrigerator size={20} />
        <span className="text-xs mt-1">Mon Frigo</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
