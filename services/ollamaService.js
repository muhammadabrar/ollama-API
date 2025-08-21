const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.BASE_URL || 'http://localhost:11434';
    this.defaultModel = process.env.DEFAULT_MODEL || 'deepseek-r1';
    this.endpoint = process.env.ENDPOINT || '/api/chat';
    // Increased timeout to 5 minutes for AI model responses
    this.timeout = parseInt(process.env.OLLAMA_TIMEOUT) || 300000; // 5 minutes default
  }

  async chat(messages, model = null, stream = false, temperature = 0.7, max_tokens = 512) {
    try {
      const requestData = {
        model: model || this.defaultModel,
        messages: messages,
        stream: stream,
        temperature: temperature,
        max_tokens: max_tokens
      };

      console.log(`Making request to Ollama with model: ${model || this.defaultModel}, timeout: ${this.timeout}ms, temperature: ${temperature}, max_tokens: ${max_tokens}`);

      const response = await axios.post(`${this.baseURL}${this.endpoint}`, requestData, {
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

  async generateResponse(prompt, model = null, temperature = 0.7, max_tokens = 512) {
    const messages = [
      { role: 'user', content: prompt }
    ];
    
    return await this.chat(messages, model, false, temperature, max_tokens);
  }

  // New method to handle the complete request object format
  async chatWithRequest(requestData) {
    const {
      model,
      messages,
      temperature = 0.7,
      max_tokens = 512,
      stream = false
    } = requestData;

    return await this.chat(messages, model, stream, temperature, max_tokens);
  }
}

module.exports = new OllamaService(); 