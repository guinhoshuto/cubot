const { createReadStream, createWriteStream } = require('node:fs');
const { OpusEncoder } = require('@discordjs/opus');
const { pipeline } = require('node:stream')
const fs = require('fs');
const { FileWriter } = require('wav')
const prism = require('prism-media')
const { Transform } = require('stream');
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
        receiver.speaking.on('start', async (userId) => {
            await this.createListeningStream(
                receiver, 
                userId, 
                this.client.users.cache.get(userId)
            )
            console.log('speaker on')
        });
        receiver.speaking.on('end', () => {
            console.log('diz que parou de falar')
            this.connection.destroy()
            return
        })
        // this.channel.send('lll')
    }

     createListeningStream(receiver, userId, user){
        const output = path.join(__dirname, '..', 'discord/src/prompt.wav')
           const encoder = new OpusEncoder(48000, 1)

        receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 5000,
            }
        })
        .pipe(new OpusDecodingStream({}, encoder))
        .pipe(new FileWriter(output, {
            channels: 1,
            sampleRate: 48000
        }))
        console.log('gravou')

        // const oggStream = new prism.opus.OggLogicalBitstream({
        //     opusHead: new prism.opus.OpusHead({
        //         channelCount: 2, 
        //         sampleRate:48000
        //     }),
        //     pageSizeControl: {
        //         maxPackets: 10
        //     }
        // })

// Encode and decode.
        // const encoded = encoder.encode(opusStream);

        // console.log(encoded)
        // const out = createWriteStream(output, { flags: 'a'})
        // console.log('gravou')

        // pipeline(opusStream, oggStream, out, (err) => {
        //     if(err) {
        //         console.log('erro ao salvar áudio')
        //         console.log(err)
        //     } else {
        //         console.log('salvou áudio')
        //     }
        // })

        // const process = new ffmpeg(output);        
        // process.then(audio =>{
        //     audio.fnExtractSoundToMP3(path.join(__dirname, '..', 'discord/src/prompt.mp3'), async (err, file) => {
                   
        //     })
        // })
    }
}

class OpusDecodingStream extends Transform {
    encoder

    constructor(options, encoder) {
        super(options)
        this.encoder = encoder
    }

    _transform(data, encoding, callback) {
        this.push(this.encoder.decode(data))
        callback()
    }
}