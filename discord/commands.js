const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('../commands')
require('dotenv').config()

const rest = new REST({ version: '9'}).setToken(process.env.DISCORD_TOKEN);

console.log(commands)
try {
    console.log('comecou a cadastrar');
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }
    );
    console.log( 'instalou os comandos')
} catch (e) {
    console.log('e:', e)
}
