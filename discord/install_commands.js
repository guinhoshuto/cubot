const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('./commands')
require('dotenv').config()

const teste = false;
const guild = teste ? process.env.GUILD_TESTE : process.env.GUILD_ID;

const rest = new REST({ version: '9'}).setToken(process.env.DISCORD_TOKEN);

console.log(commands)
console.log('comecou a cadastrar');
rest.put( Routes.applicationGuildCommands(process.env.CLIENT_ID, guild), { body: commands }
)
.then(() => console.log( 'instalou os comandos'))
.catch((e) => console.log('e:', e))
