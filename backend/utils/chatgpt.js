const axios = require('axios');

async function getChatGPTResponse(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that recommends online courses to users based on their interests.' },
      { role: 'user', content: message },
    ],
    max_tokens: 300,
    temperature: 0.7,
  };
  try {
    const response = await axios.post(endpoint, data, { headers });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling ChatGPT API:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getChatGPTResponse };
