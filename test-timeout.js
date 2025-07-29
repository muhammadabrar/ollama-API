const axios = require('axios');

const API_BASE = 'http://localhost:3001';
const API_KEY = process.env.API_KEY || 'your-secret-api-key-here';

async function testHealth() {
  try {
    console.log('🔍 Testing basic health...');
    const response = await axios.get(`${API_BASE}/health`);
    console.log('✅ Basic health check passed:', response.data);
    
    console.log('🔍 Testing Ollama health...');
    const ollamaResponse = await axios.get(`${API_BASE}/health/ollama`);
    console.log('✅ Ollama health check passed:', ollamaResponse.data);
    
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testModels() {
  try {
    console.log('🔍 Testing models endpoint...');
    const response = await axios.get(`${API_BASE}/api/models`, {
      headers: { 'x-api-key': API_KEY }
    });
    console.log('✅ Models endpoint passed:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Models endpoint failed:', error.message);
    return null;
  }
}

async function testChat(messages, model = null, description = '') {
  try {
    console.log(`🔍 Testing chat with ${description}...`);
    const startTime = Date.now();
    
    const response = await axios.post(`${API_BASE}/api/chat`, {
      messages,
      model
    }, {
      headers: { 'x-api-key': API_KEY },
      timeout: 60000 // 1 minute timeout for testing
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Chat test passed (${duration}ms):`, response.data);
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Chat test failed (${duration}ms):`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting timeout diagnosis tests...\n');
  
  // Test 1: Health checks
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Health checks failed. Please check if the server is running.');
    return;
  }
  
  // Test 2: Models endpoint
  const models = await testModels();
  if (!models) {
    console.log('❌ Cannot fetch models. Please check Ollama connection.');
    return;
  }
  
  console.log('\n📋 Available models:', models.models?.map(m => m.name).join(', ') || 'None');
  
  // Test 3: Small chat request
  const smallMessages = [
    { role: 'user', content: 'Hello, how are you?' }
  ];
  await testChat(smallMessages, null, 'small request');
  
  // Test 4: Medium chat request
  const mediumMessages = [
    { role: 'user', content: 'Please explain quantum computing in simple terms.' }
  ];
  await testChat(mediumMessages, null, 'medium request');
  
  // Test 5: Large chat request (but within limits)
  const largeContent = 'A'.repeat(10000); // 10KB
  const largeMessages = [
    { role: 'user', content: largeContent }
  ];
  await testChat(largeMessages, null, 'large request (10KB)');
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testHealth, testModels, testChat }; 