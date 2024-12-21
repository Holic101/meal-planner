import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Du bist ein Koch-Assistent. Erstelle Rezepte im folgenden JSON-Format:
          {
            "name": "Rezeptname",
            "ingredients": [
              {
                "name": "Zutatname",
                "amount": Nummer,
                "unit": "Einheit"
              }
            ]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Parse die JSON-Antwort
    const recipe = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      message: 'Error generating recipe', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
