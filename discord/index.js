const { Client, Intents, MessageEmbed } = require('discord.js');
const { createReadStream } = require('node:fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, demuxProbe, AudioPlayerStatus  } = require('@discordjs/voice');
const path = require('path');

const cubot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}

const geralChannel = cubot.channels.cache.get('855695828856864799');

const handleDiscordInteraction = async (interaction) =>{
	const now = new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
	const horarioOficial = ('0'+now.substring(0,2)).slice(-2) + '00'; 
    if(!interaction.isCommand()) return;
    switch(interaction.commandName){
		case 'hora':
			console.log(horarioOficial)
			await interaction.reply({files: [path.join(__dirname, 'horarios', horarioOficial + '.mp3')], ephemeral: true})	
			break;
		case 'tiro':
			console.log(interaction.channelId)
			const wish = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Wish')
				.setImage(`https://feras-leaderboards.herokuapp.com/images/wish.gif`)

			await cubot.channels.cache.get(interaction.channelId).send({embeds: [wish]});
			break;
        case 'cu':
            await interaction.reply("@cali#5795");
            break;
        case 'mood':
            const mood = interaction.options.getString('moods');
            console.log(mood)
            await interaction.reply({files: [path.join(__dirname, 'commands', 'mood', mood)]});
            break;
        case 'guz':
            await interaction.reply("clap");
			break;
		case 'teste':
			const player = createAudioPlayer();
			// const file = path.join(__dirname, 'nanohakase.mp4')
			const file = path.join(__dirname, 'horarios', horarioOficial + '.mp3')
			const resource = await createAudioResource(createReadStream(file), {inlineVolume: true});
			resource.volume.setVolume(0.9);
			const connection = joinVoiceChannel({
				channelId: '855694949151801354',
				guildId: '855694948707991593',
				selfDeaf: false,
				adapterCreator: cubot.guilds.cache.get('855694948707991593').voiceAdapterCreator
			})
			connection.subscribe(player)
			console.log(path.join(__dirname, 'horarios', '0000.mp3'))
			// const mp3Stream = await probeAndCreateResource(createReadStream(file));
			player.play(resource)
			player.on(AudioPlayerStatus.Idle, () => {
				connection.destroy();
			});
			// const connection1 = getVoiceConnection('855694948707991593');
		
			// connection1.subscribe(player)
			// console.log(player);
			// console.log(player._state.resource);
			console.log(resource)
			// connection.destroy()
			await interaction.reply({content: 'hm', ephemeral: true })
    }
}

module.exports = { cubot, handleDiscordInteraction, geralChannel }