const { Client, GatewayIntentBits, ChannelType, Events } = require('discord.js');
const { channelPrefix } = require('../config/config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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
    
    if (!channelName || channelName.length < 1 || channelName.length > 100) {
      throw new Error('Channel name is either undefined or does not meet Discord’s name length requirements.');
    }

    let channel = guild.channels.cache.find(c => c.name === channelName);

    if (channel) {
      console.log(`Channel with name ${channelName} already exists.`);
    } else {
      // Create a new channel if it doesn't exist, and set the topic to instruct the user
      channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        topic: 'Send "verify" to verify your identity and lock this channel.', // Channel topic description
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: ['ViewChannel'],
          },
        ],
      });
      console.log(`Created new channel with name ${channelName} and set the topic.`);
    }

    let invites = await channel.fetchInvites().catch(() => new Map());
    let invite = invites.find(inv => inv.maxUses === 1);

    if (!invite) {
      invite = await channel.createInvite({
        maxAge: 0,
        maxUses: 1,
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

// Listen for messages in the channel
client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return; // Ignore bot messages

    const channelName = message.channel.name;
    const expectedChannelName = `${channelPrefix}${message.author.username}`;

    if (message.content.toLowerCase() === 'verify') {
      if (channelName === expectedChannelName) {
        await message.channel.permissionOverwrites.create(message.guild.roles.everyone, { ViewChannel: false });
        await message.reply("Welcome! You've been verified and the channel is now locked.");
        console.log(`Locked the channel ${channelName} after successful verification.`);
      } else {
        await message.reply("This is not your channel.");
        console.log(`User ${message.author.username} attempted to access the wrong channel.`);
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

const verifyUser = async (channelName, joiningHandle) => {
  try {
    const guild = client.guilds.cache.first();
    if (!guild) throw new Error('Bot is not connected to any guild.');

    const channel = guild.channels.cache.find(c => c.name === channelName);
    if (!channel) throw new Error('Channel not found.');

    const member = guild.members.cache.find(m => m.user.tag === joiningHandle);
    if (!member) throw new Error('User not found.');

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