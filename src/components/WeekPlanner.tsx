import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';

interface WeekPlannerProps {
  weekPlans: Record<string, Record<string, number | null>>;
  setWeekPlans: React.Dispatch<React.SetStateAction<Record<string, Record<string, number | null>>>>;
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

const WeekPlanner: React.FC<WeekPlannerProps> = ({ weekPlans, setWeekPlans, recipes }) => {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });

  const currentWeekKey = currentWeek.toISOString().split('T')[0];

  // Initialisiere aktuelle Woche falls noch nicht vorhanden
  if (!weekPlans[currentWeekKey]) {
    setWeekPlans(prev => ({
      ...prev,
      [currentWeekKey]: {
        Montag: null,
        Dienstag: null,
        Mittwoch: null,
        Donnerstag: null,
        Freitag: null,
        Samstag: null,
        Sonntag: null
      }
    }));
  }

  const navigateWeek = (direction: number) => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  const getDateForDay = (day: string) => {
    const dayIndex = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].indexOf(day);
    const date = new Date(currentWeek);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  const copyFromPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    const prevWeekKey = prevWeek.toISOString().split('T')[0];
    
    if (weekPlans[prevWeekKey]) {
      setWeekPlans(prev => ({
        ...prev,
        [currentWeekKey]: {...weekPlans[prevWeekKey]}
      }));
    }
  };

  const updateMeal = (day: string, mealId: number | null) => {
    setWeekPlans(prev => ({
      ...prev,
      [currentWeekKey]: {
        ...prev[currentWeekKey],
        [day]: mealId
      }
    }));
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigateWeek(-1)} size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            Woche {currentWeek.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
          <Button onClick={() => navigateWeek(1)} size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={copyFromPreviousWeek} size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Vorwoche kopieren
        </Button>
      </div>

      <div className="space-y-2">
        {weekPlans[currentWeekKey] && Object.entries(weekPlans[currentWeekKey]).map(([day, mealId]) => (
          <div key={day} className="flex items-center p-2 border rounded">
            <div className="flex items-center gap-2 w-40">
              <span className="font-medium">{day}</span>
              <span className="text-sm text-gray-500">{getDateForDay(day)}</span>
            </div>
            <select 
              className="flex-1 p-2 border rounded ml-2"
              value={mealId || ''}
              onChange={(e) => updateMeal(day, e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Mahlzeit auswählen</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeekPlanner;
