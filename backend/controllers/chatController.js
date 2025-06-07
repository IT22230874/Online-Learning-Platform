const { getChatGPTResponse } = require('../utils/chatgpt');

exports.chatWithGPT = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const gptResponse = await getChatGPTResponse(message);
    res.json({ response: gptResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from ChatGPT' });
  }
};
