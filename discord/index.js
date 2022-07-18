const { Client, Intents } = require('discord.js');
const path = require('path');
const fs = require('fs');

const cubot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})

// const getMembers = async()
// list.members.fetch().then(m => {
//   let members = m.map(u => u.user.username)
//   console.log(members) //array of all members
//   //you can also use "m.each(u => console.log(u.user.username))" to log each one individually
// })

const handleDiscordInteraction = async (interaction) =>{
    if(!interaction.isCommand()) return;
    switch(interaction.commandName){
        case 'cu':
            await interaction.reply("@cali#5795");
            break;
        case 'mood':
            const mood = interaction.options.getString('moods');
            console.log(mood)
            await interaction.reply({files: [path.join(__dirname, 'commands', 'mood', mood)]});
            break;
        case 'guz':
            await interaction.reply("clap");
    }
}

module.exports = { cubot, handleDiscordInteraction }