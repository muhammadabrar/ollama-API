const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');

// POST /api/chat - Chat with Ollama
router.post('/chat', async (req, res) => {
  try {
    const { messages, model, stream } = req.body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Messages array is required and must not be empty'
      });
    }

    // Validate message format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return res.status(400).json({
          error: 'Invalid message format',
          message: 'Each message must have "role" and "content" fields'
        });
      }
    }

    const response = await ollamaService.chat(messages, model, stream);
    
    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Chat route error:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// POST /api/generate - Simple text generation
router.post('/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt is required and must be a string'
      });
    }

    const response = await ollamaService.generateResponse(prompt, model);
    
    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Generate route error:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/models - List available models
router.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    
    res.json({
      success: true,
      data: models
    });

  } catch (error) {
    console.error('Models route error:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router; 