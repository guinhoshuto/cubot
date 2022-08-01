const { SlashCommandBuilder } = require('@discordjs/builders')

const data = new SlashCommandBuilder()
    .setName('teste')
    .setDescription('...');

module.exports = data;