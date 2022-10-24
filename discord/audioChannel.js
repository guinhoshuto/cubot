const { Client, Intents, MessageEmbed } = require('discord.js');
const { createReadStream } = require('node:fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, demuxProbe, AudioPlayerStatus } = require('@discordjs/voice');
const guildId = '855694948707991593';

module.exports = class AudioChannel{
    constructor(client, channel){
        this.client = client;
        this.player = createAudioPlayer();
        this.connection = joinVoiceChannel({
            channelId: channel,
            guildId: guildId,
            selfDeaf: false,
            adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator
        })
    }

    // const player = createAudioPlayer();
    // const file = path.join(__dirname, 'nanohakase.mp4')
    // const file = path.join(__dirname, 'horarios', horarioOficial + '.mp3')
    // const resource = await createAudioResource(createReadStream(file), { inlineVolume: true });
    // resource.volume.setVolume(0.9);
    // const connection = joinVoiceChannel({
    //     channelId: '855694949151801354',
    //     guildId: '855694948707991593',
    //     selfDeaf: false,
    //     adapterCreator: cubot.guilds.cache.get('855694948707991593').voiceAdapterCreator
    // })
    async playAudio(file){
        const resource = await createAudioResource(createReadStream(file), { inlineVolume: true });
        this.connection.subscribe(this.player)
        this.player.play(resource)
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.connection.destroy();
        });
        // console.log(resource)
    }
}