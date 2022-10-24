const { Client, Intents, MessageEmbed } = require('discord.js');
const { createReadStream } = require('node:fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, demuxProbe, AudioPlayerStatus } = require('@discordjs/voice');
const CopypastaService = require('../services/copypasta.service')
const path = require('path');
const axios = require('axios')
require('dotenv').config()

const copypasta = new CopypastaService();

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

const handleDiscordInteraction = async (interaction) => {
	const now = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
	const horarioOficial = ('0' + now.substring(0, 2)).slice(-2) + '00';
	if (!interaction.isCommand()) return;
	switch (interaction.commandName) {
		case 'copypasta':
			const copypastaPrompt = interaction.options.getString('copypastas').toLowerCase().trim();
			if (copypastaPrompt === '?') {
				const copypastaList = await copypasta.getCopypastas()
				console.log(copypastaList)
				const copypastaMenu = "\`\`\`" + `Lista de copypastas \n ${copypastaList.map((c, i) => i != 0 ? c[0] + "\n" : '\n').join('')}` + "\`\`\`"
				await interaction.reply({ content: copypastaMenu, ephemeral: true })
			} else {
				const copypastaRequested = await copypasta.getCopypasta(copypastaPrompt)
				await interaction.reply({ content: copypastaRequested, ephemeral: true })
			}
			break;
		case 'corvo':
			console.log(interaction.channelId)
			console.log(cubot.channels.cache.get(interaction.channelId).type);
			switch (cubot.channels.cache.get(interaction.channelId).type) {
				case 'GUILD_VOICE':
					const player = createAudioPlayer();
					const file = path.join(__dirname, 'src/sounds', 'corvo.mp3')
					const resource = await createAudioResource(createReadStream(file));
					const connection = joinVoiceChannel({
						channelId: interaction.channelId,
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
					await interaction.reply({ content: 'ababababa', ephemeral: true })
					break;
				case 'GUILD_TEXT':
					await interaction.reply({ files: [path.join(__dirname, 'sounds', 'corvo.mp3')] })
					break;
			}
			break;
		case 'fala':
			const encodedParams = new URLSearchParams();
			encodedParams.append("f", "16khz_16bit_mono")
			encodedParams.append("c", "mp3")
			encodedParams.append("r", "0")
			encodedParams.append("b64", true)
			encodedParams.append("v", interaction.options.getString('falantes'))
			encodedParams.append("hl", "pt-br")
			encodedParams.append("src", interaction.options.getString('texto'))
			const options = {
				method: 'POST',
				url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
				params: { key: process.env.TTS_KEY },
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
					'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
				},
				data: encodedParams
			}
			axios.request(options)
				.then(response => {
					console.log(response.data)
					const player = createAudioPlayer();
					const resource = createAudioResource(response.data, { inlineVolume: true });
					resource.volume.setVolume(1);
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
				.catch(e => console.log('error: ', e))

			await interaction.reply({ content: 'hm', ephemeral: true })
			break;
		case 'hora':
			await interaction.reply({ files: [path.join(__dirname, 'src/horarios', horarioOficial + '.mp3')], ephemeral: true })
			break;
		case 'tiro':
			console.log(interaction.channelId)
			const wish = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Wish')
				.setImage(`https://feras-leaderboards.herokuapp.com/images/wish.gif`)

			await cubot.channels.cache.get(interaction.channelId).send({ embeds: [wish] });
			break;
		case 'genio':
			const nome = interaction.options.getString('nome');
			if (nome.length === 1) {
				await interaction.reply({ content: 'porra, não fode', ephemeral: true });
				break;
			}
			const msg = await axios.get(`http://feras-leaderboards.herokuapp.com/guzclap/genio/${nome}`)
			await interaction.reply(msg.data.msg);
			break;
		case 'cu':
			await interaction.reply("@cali#5795");
			break;
		case 'mood':
			const mood = interaction.options.getString('moods');
			console.log(mood)
			await interaction.reply({ files: [path.join(__dirname, 'commands', 'mood', mood)] });
			break;
		case 'guz':
			await interaction.reply("clap");
			break;
		case 'teste':
			const player = createAudioPlayer();
			// const file = path.join(__dirname, 'nanohakase.mp4')
			const file = path.join(__dirname, 'horarios', horarioOficial + '.mp3')
			const resource = await createAudioResource(createReadStream(file), { inlineVolume: true });
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
			await interaction.reply({ content: 'hm', ephemeral: true })
			break;
	}
}

module.exports = { cubot, handleDiscordInteraction, geralChannel }