const { Client, Intents, MessageEmbed } = require('discord.js');
const { createReadStream } = require('node:fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, demuxProbe, AudioPlayerStatus  } = require('@discordjs/voice');
const path = require('path');
const axios = require('axios')
const { ApplicationCommandPermissionType } = require('discord-api-types/v9');

const cubot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

const geralChannel = cubot.channels.cache.get('855695828856864799');

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}

const handleDiscordInteraction = async (interaction) =>{
	const now = new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
	const horarioOficial = ('0'+now.substring(0,2)).slice(-2) + '00'; 
    if(!interaction.isCommand()) return;
    switch(interaction.commandName){
		case 'fala':
			console.log(interaction)
			const encodedParams = new URLSearchParams();
			encodedParams.append("f", "16khz_16bit_stereo")
			encodedParams.append("c", "mp3")
			encodedParams.append("r", "0")
			encodedParams.append("b64", true)
			encodedParams.append("v", interaction.options.getString('falantes'))
			encodedParams.append("hl", "pt-br")
			encodedParams.append("src", interaction.options.getString('texto'))
			const options = {
				method: 'POST',
				url:  'https://voicerss-text-to-speech.p.rapidapi.com/',
				params: { key: 'ca983b302beb45e895e2194c74123b72' },
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'X-RapidAPI-Key': '3242aadc71mshf88746437fb745ep1e39c8jsna36a6369186f',
					'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
				},
				data: encodedParams
			}
			axios.request(options)
			.then(response => {
				// console.log(response.data)
				const player = createAudioPlayer();
				const resource = createAudioResource(response.data, {inlineVolume: true});
				// resource.volume.setVolume(0.9);
				const connection = joinVoiceChannel({
					channelId: interaction.channelId,
					guildId: interaction.guildId,
					selfDeaf: false,
					adapterCreator: cubot.guilds.cache.get(interaction.guildId).voiceAdapterCreator
				})
				connection.subscribe(player)
				player.play(resource)
				player.on(AudioPlayerStatus.Idle, () => {
					connection.destroy();
				});
			})
			.catch(e => console.log(e))

			await interaction.reply({content: 'hm', ephemeral: true})
			break;
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
			player.play(resource)
			player.on(AudioPlayerStatus.Idle, () => {
				connection.destroy();
			});
			console.log(resource)
			await interaction.reply({content: 'hm', ephemeral: true })
    }
}

module.exports = { cubot, handleDiscordInteraction, geralChannel }