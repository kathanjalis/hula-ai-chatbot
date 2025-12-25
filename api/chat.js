export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // Check if the key even exists in Vercel
    if (!API_KEY) {
        return res.status(500).json({ error: "API Key is missing in Vercel settings." });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        // LOG THE DATA so you can see it in Vercel Dashboard -> Logs
        console.log("Gemini Response:", JSON.stringify(data));

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            const botReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: botReply });
        } else {
            // This captures errors like "Expired Key" or "Safety Filter"
            return res.status(500).json({ error: data.error?.message || "Invalid response from Gemini" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server Side Crash: " + error.message });
    }
}