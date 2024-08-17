require('dotenv').config();

module.exports = {
  discordToken: process.env.DISCORD_BOT_TOKEN,
  channelPrefix: process.env.CHANNEL_PREFIX || 'channel-',
};