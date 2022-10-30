const juliette = require('./twitch/juliette')
const HorarioOficial = require('./services/horario.service')
const audioChannel = require('./discord/audioChannel')
const { cubot, handleDiscordInteraction } = require('./discord')
const express = require('express')
require('dotenv').config();

const app = express();
app.listen(process.env.PORT);

juliette.client.connect();
juliette.client.on('message', juliette.handleMessages);

cubot.on('ready', () => {
    console.log('entrei')
});

cubot.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('ok'))
    .catch((e) => console.log('e:', e))

cubot.on('interactionCreate', handleDiscordInteraction)

app.get('/', async (req, res) => {
    res.json({ 'msg': 'oi, pois não?' })
})

app.get('/horario-oficial', async (req, res) => {
    console.log('horario acionado')
    const horarioOficial = new HorarioOficial()
    const horarioConnection = new audioChannel(cubot, '997653231398297623')
    horarioConnection.playAudio(horarioOficial.horarioOficialFile())
    res.json({ 'message': horarioOficial.horarioOficial() })
})

// 997653231398297623