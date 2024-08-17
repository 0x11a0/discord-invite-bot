const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test Data
const discordHandle = 'lucas_0xl';
const channelName = 'channel-lucas_0xl';
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

// Test verify-user API
const testVerifyUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-user`, { channelName, joiningHandle });
    console.log('Verify User Response:', response.data);
  } catch (error) {
    console.error('Error verifying user:', error.response ? error.response.data : error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('Testing create-channel API...');
  await testCreateChannel();

//   console.log('Testing verify-user API...');
//   await testVerifyUser();
};

runTests();