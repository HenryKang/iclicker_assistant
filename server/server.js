require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;

// Enable CORS for your extension
app.use(cors());
app.use(express.json());

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'lazyClicker Server Running' });
});

// Answer endpoint
app.post('/answer', async (req, res) => {
  try {
    const { question, options, provider } = req.body;

    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const prompt = `Answer this multiple choice question. Only respond with the letter or exact text of the correct answer, nothing else.

Question: ${question}

Options:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}`;

    let answer;

    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      answer = message.content[0].text.trim();
    } else {
      // Default to OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 100
      });
      answer = completion.choices[0].message.content.trim();
    }

    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('Extension can now make requests to this server');
});