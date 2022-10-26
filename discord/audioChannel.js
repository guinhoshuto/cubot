const { createReadStream } = require('node:fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
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

    async playAudio(file){
        const resource = await createAudioResource(file, { inlineVolume: true });
        resource.volume.setVolume(1);
        this.connection.subscribe(this.player)
        this.player.play(resource)
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.connection.destroy();
        });
        // console.log(resource)
    }
}