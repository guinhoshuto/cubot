const { createReadStream } = require('node:fs');
const path = require('path');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus 
} = require('@discordjs/voice');
const ffmpeg = require('ffmpeg');
// const guildId = '855694948707991593';

module.exports = class AudioChannel{
    constructor(client, guildId, channel){
        this.client = client;
        this.player = createAudioPlayer();
        this.connection = joinVoiceChannel({
            channelId: channel,
            guildId: guildId,
            selfDeaf: false,
            adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator
        })
    }

    async playAudio(file){
        const audio = createReadStream(file);
        const resource = await createAudioResource(audio, { inlineVolume: true });
        resource.volume.setVolume(1);
        this.connection.subscribe(this.player)
        this.player.play(resource)
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.connection.destroy();
        });
    }

    async recordCommand(){
        // https://www.youtube.com/watch?v=h7CC-8kTsGI
        const output = path.join(__dirname, '..', 'discord/src/prompt.mp3')
        try {
        var process = new ffmpeg(output);
        process.then(function (audio) {
            audio.fnExtractSoundToMP3(output, function (error, file) {
            if (!error) console.log('Audio File: ' + file);
            });
        }, function (err) {
            console.log('Error: ' + err);      
        });
        } catch (e) {
        console.log(e);
        }
    }
}