const { Client, Intents } = require('discord.js');
const path = require('path');
const fs = require('fs');

const cubot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

module.exports = { cubot }