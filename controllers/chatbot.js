const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.askChatbot = async (req, res) => {
  const userInput = req.body.question;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [
        {
          role: 'system',
          content: 'You are a helpful chatbot for an event planning company. You answer questions about packages and services.',
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
    });

    const botResponse = completion.data.choices[0].message.content;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ reply: "Sorry, I'm having trouble responding right now." });
  }
};

