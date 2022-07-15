const { SlashCommandBuilder } = require('@discordjs/builders')

const data = new SlashCommandBuilder()
    .setName('guz')
    .setDescription('...');

module.exports = data;