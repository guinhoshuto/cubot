const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('raids')
    .setDescription('raids ativas nessse momento')

module.exports = data