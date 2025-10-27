import fetch from 'node-fetch';

export const translateText = async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Use the more reliable LibreTranslate endpoint
        const response = await fetch('https://translate.argosopentech.com/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: sourceLang || 'auto',
                target: targetLang,
                format: 'text',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Translation API error:', errorData);
            return res.status(response.status).json({ 
                error: 'Translation service error',
                details: errorData
            });
        }

        const data = await response.json();
        
        // Ensure we return the translated text in the expected format
        res.json({ 
            translatedText: data.translatedText || data.text || ''
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ 
            error: 'Translation failed',
            details: error.message
        });
    }
};