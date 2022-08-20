const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('genio')
    .setDescription('...')
    .addStringOption( option_ => 
        option_.setName('nome')
            .setDescription('quem encontrou a lâmpada?')
            .setRequired(true)
    )

module.exports = data