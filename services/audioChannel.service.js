const { createReadStream, createWriteStream } = require('node:fs');
const { pipeline } = require('node:stream')
const prism = require('prism-media')
const path = require('path');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus, 
    EndBehaviorType
} = require('@discordjs/voice');
const ffmpeg = require('ffmpeg');
const { channel } = require('node:diagnostics_channel');
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
        const receiver = this.connection.receiver;
        receiver.speaking.on('start', (userId) => {
            console.log('ooo')
            this.createListeningStream(receiver, userId, this.client.users.cache.get(userId))
            // this.connection.destroy()
        })
        // this.channel.send('lll')
    }

    createListeningStream(receiver, userId, user){
        const opusStream = receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 1000,
            }
        })

        const oggStream = new prism.opus.OggLogicalBitstream({
            opusHead: new prism.opus.OpusHead({
                channelCount: 2, 
                sampleRate:480000
            }),
            pageSizeControl: {
                maxPackets: 10
            }
        })
        const output = path.join(__dirname, '..', 'discord/src/prompt.pcm')
        const out = createWriteStream(output, { flags: 'a'})
        console.log('gravou')

        pipeline(opusStream, oggStream, out, (err) => {
            if(err) {
                console.log(err)
                console.log('erro ao salvar áudio')
            } else {
                console.log('salvou áudio')
            }
        })
        const process = new ffmpeg(output);        
        process.then(audio =>{
            audio.fnExtractSoundToMP3(path.join(__dirname, '..', 'discord/src/prompt.mp3'), async (err, file) => {
                   
            })
        })
    }
}
