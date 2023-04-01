const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('raids')
    .setDescription('raids ativas nessse momento')

module.exports = data