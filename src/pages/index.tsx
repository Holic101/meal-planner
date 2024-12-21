import { useState, useEffect } from 'react';
import Head from 'next/head';
import RecipeManager from '../components/RecipeManager';
import WeekPlanner from '../components/WeekPlanner';
import ShoppingList from '../components/ShoppingList';

export default function Home() {
  const [recipes, setRecipes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recipes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [weekPlans, setWeekPlans] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weekPlans');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('weekPlans', JSON.stringify(weekPlans));
  }, [weekPlans]);

  return (
    <>
      <Head>
        <title>Familien Meal Planner</title>
        <meta name="description" content="Plane deine Familienmahlzeiten" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Familien Meal Planner
        </h1>
        
        <div className="space-y-8">
          <WeekPlanner 
            weekPlans={weekPlans}
            setWeekPlans={setWeekPlans}
            recipes={recipes}
          />
          
          <ShoppingList 
            weekPlan={weekPlans[Object.keys(weekPlans)[0]]} 
            recipes={recipes}
          />
          
          <RecipeManager 
            recipes={recipes}
            onAddRecipe={(recipe) => setRecipes(prev => [...prev, recipe])}
          />
        </div>
      </main>
    </>
  );
}
