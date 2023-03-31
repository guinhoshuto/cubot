const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('...')
    .addStringOption( option => 
        option.setName('prompt')
            .setDescription('Qual foi?')
            .setRequired(true)
    )

module.exports = data