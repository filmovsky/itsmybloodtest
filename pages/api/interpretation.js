export default async function handler(req, res) {
    if (req.method === 'POST') {
        const apiKey = process.env.OPENAI_API_KEY;

        const prompt = `Analyze blood/urine test results in detail for laboratory norms, deviations, relationships between parameters, and their clinical significance. Include possible causes, recommendations for lifestyle, diet, supplementation, pharmacotherapy, and additional tests. End with a health summary and action plan.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: prompt },
                    ...req.body.messages
                ]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
