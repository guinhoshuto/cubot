const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('./commands')
require('dotenv').config()

const rest = new REST({ version: '9'}).setToken(process.env.DISCORD_TOKEN);

console.log(commands)
console.log('comecou a cadastrar');
rest.put( Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }
)
.then(() => console.log( 'instalou os comandos'))
.catch(() => console.log('e:', e))
