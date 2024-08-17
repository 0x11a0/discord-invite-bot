const { verifyUser } = require('../bot/discordBot');

module.exports = async (req, res) => {
  const { channelName, joiningHandle } = req.body;

  if (!channelName || !joiningHandle || !joiningHandle.includes('#')) {
    return res.status(400).json({ error: 'Invalid request. Ensure both channelName and joiningHandle are provided, and that the joiningHandle is in the correct format (Username#1234).' });
  }

  try {
    const verified = await verifyUser(channelName, joiningHandle);
    if (verified) {
      return res.status(200).json({ verified: true });
    } else {
      return res.status(403).json({ verified: false, error: 'User verification failed. The joining handle does not match the channel.' });
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ error: 'Failed to verify user.' });
  }
};