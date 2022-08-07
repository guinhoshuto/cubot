const juliette = require('./twitch')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus  } = require('@discordjs/voice');
const { cubot, handleDiscordInteraction} = require('./discord')
const path = require('path');
const { createReadStream } = require('node:fs');
const express = require('express')
require('dotenv').config();

const app = express();
app.listen('3000');

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
	const now = new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
	const horarioOficial = ('0'+now.substring(0,2)).slice(-2) + '00'; 
    const player = createAudioPlayer();
    const file = path.join(__dirname, 'discord', 'horarios', horarioOficial + '.mp3')
    const resource = await createAudioResource(createReadStream(file), {inlineVolume: true});
    resource.volume.setVolume(0.9);
    const connection = joinVoiceChannel({
        channelId: '855694949151801354',
        guildId: '855694948707991593',
        selfDeaf: false,
        adapterCreator: cubot.guilds.cache.get('855694948707991593').voiceAdapterCreator
    })
    connection.subscribe(player)
    player.play(resource)
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
    res.json({'message': 'foi'})
})
