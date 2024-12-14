import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false, // wyłączamy domyślny parser, bo używamy formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing OPENAI_API_KEY in environment variables.' });
  }

  // Parsowanie form-data za pomocą formidable
  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(400).json({ message: 'Error parsing form data.' });
    }

    const { orderId, gender, age, height, weight, test, comments } = fields;

    // Możesz obsłużyć pliki, jeśli chcesz je wykorzystać w promptcie:
    // W tym przykładzie pomijamy analizę plików i zakładamy, że AI ich nie potrzebuje.
    // Jeśli chcesz, możesz np. wyciągnąć tekst z plików PDF za pomocą tesseract.js lub innego narzędzia,
    // a następnie dołączyć ten tekst do prompta.

    // Budowanie prompta z uwzględnieniem wszystkich danych
    const prompt = `
Analyze the following test results and patient details:

Order ID: ${orderId}
Gender: ${gender}
Age: ${age}
Height: ${height} cm
Weight: ${weight} kg
Test: ${test}

Additional comments from the client: ${comments}

Include possible causes, recommendations for lifestyle, diet, supplementation, pharmacotherapy, and additional tests. End with a health summary and action plan.

At the very end of your response, append the following disclaimer as a separate paragraph:

"We know that the AI algorithms that power our service often interpret health data as accurately, or even more accurately, than doctors. However, due to legal requirements, we must inform you that: The service is fully automatic and based on AI. The information provided is educational and supportive and does not substitute professional medical advice. For any health decisions, consult a qualified healthcare professional."
    `;

    // Wywołanie OpenAI API
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('OpenAI API error:', text);
        return res.status(response.status).json({ message: 'OpenAI API error', details: text });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return res.status(500).json({ message: 'Error calling OpenAI API', error: String(error) });
    }
  });
}
