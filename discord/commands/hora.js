const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('hora')
    .setDescription('Horário Oficial')

module.exports = data