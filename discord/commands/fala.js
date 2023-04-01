const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('fala')
    .setDescription('tts')
    .addStringOption( option =>
        option.setName('falantes')
            .setDescription('escolhe uma voz')
            .setRequired(true)
            .addChoices(
                {'name': 'Marcia', 'value': 'Marcia'},
                {'name': 'Ligia', 'value': 'Ligia'},
                {'name': 'Yara', 'value': 'Yara'},
                {'name': 'Dinis', 'value': 'Dinis'}
            )
        )
    .addStringOption( option_ => 
        option_.setName('texto')
            .setDescription('o que você quer que eu diga?')
            .setRequired(true)
    )

module.exports = data