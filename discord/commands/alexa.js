const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('alexa')
    .setDescription('Fala ai')

module.exports = data