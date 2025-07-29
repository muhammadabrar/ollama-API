const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
const API_KEY = 'your-secret-api-key-here'; // Replace with your actual API key

// Test configuration
const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }
};

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testListModels() {
  console.log('\n📋 Testing list models...');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/models`, config);
    console.log('✅ Models retrieved:', response.data);
  } catch (error) {
    console.error('❌ List models failed:', error.response?.data || error.message);
  }
}

async function testChat() {
  console.log('\n💬 Testing chat endpoint...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: 'Solve: 25 * 25' }],
      stream: false
    }, config);
    console.log('✅ Chat response:', response.data);
  } catch (error) {
    console.error('❌ Chat failed:', error.response?.data || error.message);
  }
}

async function testGenerate() {
  console.log('\n🚀 Testing generate endpoint...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/generate`, {
      prompt: 'What is the capital of France?',
      model: 'deepseek-r1'
    }, config);
    console.log('✅ Generate response:', response.data);
  } catch (error) {
    console.error('❌ Generate failed:', error.response?.data || error.message);
  }
}

async function testInvalidApiKey() {
  console.log('\n🔒 Testing invalid API key...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: 'Test' }],
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'invalid-key'
      }
    });
    console.log('❌ Should have failed with invalid key');
  } catch (error) {
    console.log('✅ Correctly rejected invalid API key:', error.response?.data);
  }
}

async function testMissingApiKey() {
  console.log('\n🚫 Testing missing API key...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: 'Test' }],
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('❌ Should have failed with missing key');
  } catch (error) {
    console.log('✅ Correctly rejected missing API key:', error.response?.data);
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting API tests...\n');
  
  await testHealthCheck();
  await testListModels();
  await testChat();
  await testGenerate();
  await testInvalidApiKey();
  await testMissingApiKey();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testListModels,
  testChat,
  testGenerate,
  testInvalidApiKey,
  testMissingApiKey,
  runTests
}; 