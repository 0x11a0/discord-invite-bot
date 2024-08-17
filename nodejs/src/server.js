const express = require('express');
const { createChannel, verifyUser } = require('./api');

const app = express();
app.use(express.json());

app.post('/api/create-channel', createChannel);
app.post('/api/verify-user', verifyUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));