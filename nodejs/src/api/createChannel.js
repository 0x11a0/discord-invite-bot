const { createChannel } = require('../bot/discordBot');

module.exports = async (req, res) => {
  const { discordHandle } = req.body;

  try {
    const inviteLink = await createChannel(discordHandle);
    res.status(200).json({ inviteLink });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ error: 'Failed to create channel.' });
  }
};