const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.defaultModel = process.env.OLLAMA_DEFAULT_MODEL || 'deepseek-r1';
    // Increased timeout to 5 minutes for AI model responses
    this.timeout = parseInt(process.env.OLLAMA_TIMEOUT) || 300000; // 5 minutes default
  }

  async chat(messages, model = null, stream = false) {
    try {
      const requestData = {
        model: model || this.defaultModel,
        messages: messages,
        stream: stream
      };

      console.log(`Making request to Ollama with model: ${model || this.defaultModel}, timeout: ${this.timeout}ms`);

      const response = await axios.post(`${this.baseURL}/api/chat`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: this.timeout // Use configurable timeout
      });

      return response.data;
    } catch (error) {
      console.error('Ollama API Error:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Request timeout after ${this.timeout}ms. The model may be taking too long to respond. Try using a smaller model or shorter prompt.`);
      } else if (error.response) {
        throw new Error(`Ollama API Error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama service is not running. Please start Ollama first.');
      } else {
        throw new Error(`Network Error: ${error.message}`);
      }
    }
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        timeout: 1000000 // 10 seconds for model listing
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error.message);
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }

  async generateResponse(prompt, model = null) {
    const messages = [
      { role: 'user', content: prompt }
    ];
    
    return await this.chat(messages, model);
  }
}

module.exports = new OllamaService(); 