const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton  } = require('discord.js');
const { createReadStream } = require('node:fs');

// const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, demuxProbe, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
const axios = require('axios');
const AudioChannel = require('./audioChannel');
const discordTTS = require('../services/discordTTS.service');
const CopypastaService = require('../services/copypasta.service')
const HorarioOficial = require('../services/horario.service')
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

const handleDiscordInteraction = async (interaction) => {
	const horarioOficial = new HorarioOficial()
	if(interaction.isButton()){
		const buttomConnection = new AudioChannel(cubot, interaction.channelId);
		const buttomFile = createReadStream(path.join(__dirname, 'src/sounds/' + interaction.customId +  '.mp3'))
		buttomConnection.playAudio(buttomFile)
	}
	if (!interaction.isCommand()) return;
	switch (interaction.commandName) {
		case 'copypasta':
			const copypastaPrompt = interaction.options.getString('copypastas').toLowerCase().trim();
			if (copypastaPrompt === '?') {
				const copypastaList = await copypasta.getCopypastas()
				const copypastaMenu = "```" + `Lista de copypastas \n ${copypastaList.map((c, i) => i != 0 ? c[0] + "\n" : '\n').join('')}` + "```"
				await interaction.reply({ content: copypastaMenu, ephemeral: true })
			} else {
				const copypastaRequested = await copypasta.getCopypasta(copypastaPrompt)
				await interaction.reply({ content: copypastaRequested, ephemeral: true })
			}
			break;
		case 'corvo':
			switch (cubot.channels.cache.get(interaction.channelId).type) {
				case 'GUILD_VOICE':
					const corvoFile = createReadStream(path.join(__dirname, 'src/sounds/corvo.mp3'))
					const corvoConnection = new AudioChannel(cubot, interaction.channelId);
					corvoConnection.playAudio(corvoFile)
					break;
				case 'GUILD_TEXT':
					await interaction.reply({ files: [path.join(__dirname, 'sounds', 'corvo.mp3')] })
					break;
			}
			break;
		case 'fala':
			const falaConnection =  new AudioChannel(cubot, interaction.channelId)
			const ttsInstance = new discordTTS();
			ttsInstance.tts(interaction.options.getString('falantes'), interaction.options.getString('texto'), falaConnection)
			await interaction.reply({ content: 'hm', ephemeral: true })
			break;
		case 'hora':
			await interaction.reply({ files: [horarioOficial.horarioOficialFile()], ephemeral: true })
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
		case 'instants':
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('corvo')
						.setLabel('Corvo')
						.setStyle('PRIMARY'),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('tistreza')
						.setLabel('Tistreza')
						.setStyle('PRIMARY'),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('rapaz')
						.setLabel('Rapaz')
						.setStyle('PRIMARY'),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('sair')
						.setLabel('Sair')
						.setStyle('DANGER'),
				)
			await interaction.reply({ content: 'Selecione um áudio', components: [row]})
			break;

		case 'teste':
			const testeConnection = new AudioChannel(cubot, interaction.channelId);
			testeConnection.playAudio(horarioOficial.horarioOficialFile())
			await interaction.reply({ content: 'hm', ephemeral: true })
			break;
	}
}

module.exports = { cubot, handleDiscordInteraction, geralChannel }