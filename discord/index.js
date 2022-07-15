const { Client, Intents } = require('discord.js');
const path = require('path');
const fs = require('fs');

const cubot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

const handleDiscordInteraction = async (interaction) =>{
    if(!interaction.isCommand()) return;
    switch(interaction.commandName){
        case 'cu':
            await interaction.reply("@cali#5795");
            break;
        case 'mood':
            const mood = interaction.options.getString('moods');
            await interaction.reply({files: {mood}});
            break;
        case 'guz':
            await interaction.reply("clap");
    }
}

module.exports = { cubot, handleDiscordInteraction }