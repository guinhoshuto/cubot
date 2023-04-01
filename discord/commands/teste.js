const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('teste')
    .setDescription('...');

module.exports = data;