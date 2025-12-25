export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    // This variable comes from Vercel's Dashboard Settings
    const API_KEY = process.env.GEMINI_API_KEY; 

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;
        
        return res.status(200).json({ reply: botReply });
    } catch (error) {
        return res.status(500).json({ error: "Failed to connect to Gemini API" });
    }
}