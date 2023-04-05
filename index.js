const juliette = require('./twitch/juliette')
const HorarioOficial = require('./services/horario.service')
const audioChannel = require('./services/audioChannel.service')
const { handleDiscordInteraction } = require('./discord')
const { cubot, serverLogin } = require('./lib/discord')
const express = require('express')
const { GuildScheduledEventPrivacyLevel } = require('discord-api-types/v10')
require('dotenv').config();

const app = express();
app.listen(process.env.PORT);

juliette.client.connect();
juliette.client.on('message', juliette.handleMessages);

serverLogin();
cubot.on('interactionCreate', handleDiscordInteraction)

app.get('/', async (req, res) => {
    res.json({ 'msg': 'oi, pois não?' })
})

app.get('/guzcalp/quotes/:id', async(req, res) => {
    juliette.client.say('#guzcalp',`!quote ${req.params.id}`)
}) 

app.get('/horario-oficial', async (req, res) => {
    console.log('horario acionado')
    const horarioOficial = new HorarioOficial()
    const horarioConnection = new audioChannel(cubot, '997653231398297623')
    horarioConnection.playAudio(horarioOficial.horarioOficialFile())
    res.json({ 'message': horarioOficial.horarioOficial() })
})

// 997653231398297623