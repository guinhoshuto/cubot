const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('mood')
    .setDescription('fala uma coisa ai')
    .addStringOption( option => 
        option.setName('input')
            .setDescription('qq ce quer')
            .setRequired(true)
        )

module.exports = data