const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test Data
const discordHandle = 'Username#1234';
const channelName = 'channel-Username#1234';
const joiningHandle = 'Username#1234';

// Test create-channel API
const testCreateChannel = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/create-channel`, { discordHandle });
    console.log('Create Channel Response:', response.data);
  } catch (error) {
    console.error('Error creating channel:', error.response ? error.response.data : error.message);
  }
};


// Run tests
const runTests = async () => {
  console.log('Testing create-channel API...');
  await testCreateChannel();
};

runTests();