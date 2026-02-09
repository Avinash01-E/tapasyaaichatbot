// Test script for DeepSeek API
const https = require('https');

// Helper to make request since fetch might need polyfill in some node versions or just to be native-only
async function testDeepSeek() {
    console.log('Testing DeepSeek API...');
    console.log('API Key present:', !!process.env.DEEPSEEK_API_KEY);
    console.log('Base URL:', process.env.DEEPSEEK_BASE_URL);

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

    if (!apiKey || apiKey === 'your_key') {
        console.error('Error: Invalid API Key');
        return;
    }

    // Use fetch if available (Node 18+), otherwise fallback (simplified for now assuming Node 24 from previous check)
    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.DEEPSEEK_CHAT_MODEL || "deepseek-chat",
                messages: [
                    { role: "user", content: "Say hello in one word." }
                ],
                temperature: 0.3,
                max_tokens: 10
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API Error: ${response.status} ${text}`);
        }

        const data = await response.json();
        console.log('Success! Response:', data.choices[0].message.content);
    } catch (err) {
        console.error('Test failed:', err.message);
    }
}

testDeepSeek();
