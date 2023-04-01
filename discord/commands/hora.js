const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('hora')
    .setDescription('Horário Oficial')

module.exports = data