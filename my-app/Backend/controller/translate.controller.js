import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

let anthropicClient;

const getAnthropicClient = () => {
    if (anthropicClient) {
        return anthropicClient;
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return null;
    }

    anthropicClient = new Anthropic({ apiKey });
    return anthropicClient;
};

const callAnthropic = async ({ text, source, target }) => {
    const client = getAnthropicClient();
    if (!client) {
        return null;
    }

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
    const prompt = `Translate the following text from ${source} to ${target}. Return only the translated text.\n\nText:\n"""\n${text}\n"""`;

    const response = await client.messages.create({
        model,
        max_tokens: 400,
        temperature: 0,
        system: 'You are a precise translation engine. Output only the translated text.',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const translation = response?.content?.find((part) => part.type === 'text')?.text?.trim();
    if (!translation) {
        throw new Error('Empty response from Anthropic');
    }

    return translation;
};

const callLibreTranslate = async ({ text, source, target }) => {
    const endpoint = process.env.LIBRETRANSLATE_URL || 'https://translate.argosopentech.com/translate';
    const apiKey = process.env.LIBRETRANSLATE_API_KEY;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
            q: text,
            source: source === 'auto' ? 'auto' : source,
            target,
            format: 'text',
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`LibreTranslate error: ${details}`);
    }

    const data = await response.json();
    return data.translatedText || data.text || '';
};

export const translateText = async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const source = (sourceLang || 'auto').split('-')[0];
        const target = (targetLang || 'en').split('-')[0];

        const providerPreference = (process.env.TRANSLATION_PROVIDER || '').toLowerCase();
        const providers = providerPreference === 'anthropic' ? ['anthropic', 'libre'] : ['libre', 'anthropic'];

        for (const provider of providers) {
            try {
                if (provider === 'anthropic') {
                    const translation = await callAnthropic({ text, source, target });
                    if (translation) {
                        return res.json({ translatedText: translation, provider: 'anthropic' });
                    }
                } else {
                    const translation = await callLibreTranslate({ text, source, target });
                    if (translation) {
                        return res.json({ translatedText: translation, provider: 'libre' });
                    }
                }
            } catch (innerError) {
                console.warn(`Translation provider ${provider} failed:`, innerError.message);
            }
        }

        return res.status(503).json({ error: 'All translation providers failed' });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({
            error: 'Translation failed',
            details: error.message,
        });
    }
};