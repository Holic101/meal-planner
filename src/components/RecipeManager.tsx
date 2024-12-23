import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Camera, Link, Wand2 } from 'lucide-react';

interface Recipe {
  id: number;
  name: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

interface RecipeManagerProps {
  recipes: Recipe[];
  onAddRecipe: (recipe: Recipe) => void;
}

const RecipeManager: React.FC<RecipeManagerProps> = ({ 
  recipes = [],
  onAddRecipe = () => {}
}) => {
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id'>>({
    name: '',
    ingredients: [{ name: '', amount: 0, unit: '' }]
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newRecipe: Recipe = {
        id: Date.now(),
        name: `Rezept aus Foto (${file.name})`,
        ingredients: [
          { name: 'Zutat 1', amount: 100, unit: 'g' },
          { name: 'Zutat 2', amount: 1, unit: 'Stück' }
        ]
      };
      onAddRecipe(newRecipe);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      try {
        const hostname = new URL(urlInput).hostname;
        const newRecipe: Recipe = {
          id: Date.now(),
          name: `Rezept von ${hostname}`,
          ingredients: [
            { name: 'Zutat 1', amount: 100, unit: 'g' },
            { name: 'Zutat 2', amount: 1, unit: 'Stück' }
          ]
        };
        onAddRecipe(newRecipe);
        setUrlInput('');
        setShowUrlInput(false);
      } catch (error) {
        console.error('Ungültige URL:', error);
      }
    }
  };

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Rezeptgenerierung');
      }

      const recipe = await response.json();
      onAddRecipe({
        id: Date.now(),
        ...recipe
      });
      setAiPrompt('');
      setShowAiPrompt(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Fehler bei der Rezeptgenerierung: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Rezepte</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowAiPrompt(!showAiPrompt)} size="sm">
            <Wand2 className="h-4 w-4 mr-2" />
            KI
          </Button>
          <Button onClick={() => setShowUrlInput(!showUrlInput)} size="sm">
            <Link className="h-4 w-4 mr-2" />
            URL
          </Button>
          <label className="cursor-pointer">
            <Button size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Foto
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
          <Button onClick={() => setShowRecipeForm(!showRecipeForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Neu
          </Button>
        </div>
      </div>

      {showAiPrompt && (
        <div className="mb-4 space-y-2">
          <Input
            placeholder="Beschreibe das gewünschte Rezept (z.B. 'Ein vegetarisches Curry mit Kichererbsen')"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <Button 
            onClick={handleAiGeneration} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generiere Rezept...' : 'Rezept generieren'}
          </Button>
        </div>
      )}

      {showUrlInput && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Rezept-URL eingeben"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button onClick={handleUrlSubmit}>Importieren</Button>
        </div>
      )}

      {showRecipeForm && (
        <RecipeForm
          recipe={newRecipe}
          onChange={setNewRecipe}
          onSave={() => {
            if (newRecipe.name.trim() === '') return;
            onAddRecipe({
              id: Date.now(),
              ...newRecipe
            });
            setNewRecipe({ name: '', ingredients: [{ name: '', amount: 0, unit: '' }] });
            setShowRecipeForm(false);
          }}
        />
      )}

      <div className="space-y-2 mt-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Card>
  );
};

interface RecipeFormProps {
  recipe: Omit<Recipe, 'id'>;
  onChange: (recipe: Omit<Recipe, 'id'>) => void;
  onSave: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onChange, onSave }) => {
  return (
    <div className="space-y-4 p-4 border rounded">
      <Input
        placeholder="Rezeptname"
        value={recipe.name}
        onChange={(e) => onChange({ ...recipe, name: e.target.value })}
      />
      
      <div className="space-y-2">
        {recipe.ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Zutat"
              value={ing.name}
              onChange={(e) => {
                const newIngs = [...recipe.ingredients];
                newIngs[index] = { ...newIngs[index], name: e.target.value };
                onChange({ ...recipe, ingredients: newIngs });
              }}
            />
            <Input
              type="number"
              placeholder="Menge"
              value={ing.amount || ''}
              onChange={(e) => {
                const newIngs = [...recipe.ingredients];
                newIngs[index] = { ...newIngs[index], amount: Number(e.target.value) };
                onChange({ ...recipe, ingredients: newIngs });
              }}
            />
            <Input
              placeholder="Einheit"
              value={ing.unit}
              onChange={(e) => {
                const newIngs = [...recipe.ingredients];
                newIngs[index] = { ...newIngs[index], unit: e.target.value };
                onChange({ ...recipe, ingredients: newIngs });
              }}
            />
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => {
                onChange({
                  ...recipe,
                  ingredients: recipe.ingredients.filter((_, i) => i !== index)
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => {
          onChange({
            ...recipe,
            ingredients: [...recipe.ingredients, { name: '', amount: 0, unit: '' }]
          });
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Zutat
        </Button>
        <Button onClick={onSave}>Speichern</Button>
      </div>
    </div>
  );
};

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
  <div className="p-2 border rounded">
    <div className="font-medium">{recipe.name}</div>
    <div className="text-sm text-gray-600">
      {recipe.ingredients.map((ing, i) => (
        <span key={i}>
          {ing.amount} {ing.unit} {ing.name}
          {i < recipe.ingredients.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  </div>
);

export default RecipeManager;
