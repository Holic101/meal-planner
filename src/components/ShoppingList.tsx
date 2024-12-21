import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ShoppingListProps {
  weekPlan: Record<string, number | null>;
  recipes: Array<{
    id: number;
    name: string;
    ingredients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  }>;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ weekPlan = {}, recipes = [] }) => {
  const generateShoppingList = () => {
    const shoppingList: Record<string, { name: string; amount: number; unit: string }> = {};
    
    if (weekPlan) {
      Object.values(weekPlan).forEach(mealId => {
        if (mealId) {
          const recipe = recipes.find(r => r.id === mealId);
          if (recipe) {
            recipe.ingredients.forEach(ing => {
              if (shoppingList[ing.name]) {
                shoppingList[ing.name].amount += ing.amount;
              } else {
                shoppingList[ing.name] = { ...ing };
              }
            });
          }
        }
      });
    }

    return Object.values(shoppingList);
  };

  const items = generateShoppingList();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Einkaufsliste</h2>
        <FileText className="h-5 w-5 text-gray-500" />
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Noch keine Mahlzeiten geplant
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">
                {item.amount} {item.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ShoppingList;
