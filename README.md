# Meal Planner

Ein einfacher Meal Planner für Familien mit folgenden Features:
- Wochenplanung für Mahlzeiten
- Automatische Einkaufsliste
- Rezeptverwaltung
- KI-gestützte Rezeptvorschläge
- Import von Rezepten aus URLs und Fotos

## Installation

1. Repository klonen:
```bash
git clone https://github.com/[DEIN_USERNAME]/meal-planner.git
cd meal-planner
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
Kopiere `.env.example` zu `.env.local` und füge deinen OpenAI API Key ein.

4. Development Server starten:
```bash
npm run dev
```

5. Öffne [http://localhost:3000](http://localhost:3000)

## Umgebungsvariablen

- `OPENAI_API_KEY`: Dein OpenAI API Key für die Rezeptgenerierung
