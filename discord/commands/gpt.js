const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('...')
    .addStringOption( option => 
        option.setName('prompt')
            .setDescription('qual foi?')
            .setRequired(true)
    )
    .addStringOption( option_ => 
        option_.setName('system')
            .setDescription('quem vc pensa que é?')
            .setRequired(false)
    )

module.exports = data