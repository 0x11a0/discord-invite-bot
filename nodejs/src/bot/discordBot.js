const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { channelPrefix } = require('../config/config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // If you need member events
  ]
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Connected to guilds: ${client.guilds.cache.map(guild => guild.name).join(', ')}`);
});

const createChannel = async (discordHandle) => {
  try {
    const guild = client.guilds.cache.first(); // Assumes bot is only in one guild
    if (!guild) throw new Error('Bot is not connected to any guild.');

    const channelName = `${channelPrefix}${discordHandle.split('#')[0]}`;
    
    // Ensure the channel name is correctly set and meets Discord's requirements
    if (!channelName || channelName.length < 1 || channelName.length > 100) {
      throw new Error('Channel name is either undefined or does not meet Discord’s name length requirements.');
    }

    // Check if the channel already exists
    let channel = guild.channels.cache.find(c => c.name === channelName);

    if (channel) {
      console.log(`Channel with name ${channelName} already exists.`);
    } else {
      // Create a new channel if it doesn't exist
      channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText, // Ensure the correct type is set
        permissionOverwrites: [
          {
            id: guild.roles.everyone, // Deny everyone access
            deny: ['ViewChannel'],
          },
        ],
      });
      console.log(`Created new channel with name ${channelName}.`);
    }

    // Fetch the invites for the channel
    let invites = await channel.fetchInvites().catch(() => new Map());
    let invite = invites.find(inv => inv.maxUses === 1);

    if (!invite) {
      invite = await channel.createInvite({
        maxAge: 0, // Permanent invite
        maxUses: 1, // Single-use invite
      });
      console.log(`Created new invite link for channel ${channelName}.`);
    } else {
      console.log(`Using existing invite link for channel ${channelName}.`);
    }

    return invite.url;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

const verifyUser = async (channelName, joiningHandle) => {
  try {
    const guild = client.guilds.cache.first(); // Assumes bot is only in one guild
    if (!guild) throw new Error('Bot is not connected to any guild.');

    const channel = guild.channels.cache.find(c => c.name === channelName);
    if (!channel) throw new Error('Channel not found.');

    const member = guild.members.cache.find(m => m.user.tag === joiningHandle);
    if (!member) throw new Error('User not found.');

    // Verify that the user joining is the owner of the discord handle
    if (channel.name === `${channelPrefix}${member.user.username}`) {
      await channel.permissionOverwrites.create(member, { ViewChannel: true });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

module.exports = { createChannel, verifyUser };