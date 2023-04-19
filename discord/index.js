const { 
	ButtonStyle, 
	MessageEmbed, 
	ActionRowBuilder,
	ButtonBuilder,
	StringSelectMenuBuilder
} = require('discord.js');

const { cubot } = require('../lib/discord')
const path = require('path');
const axios = require('axios');
const utils = require('./utils');
const AudioChannel = require('../services/audioChannel.service');
const TranslateService = require('../services/translate.service');
const ChatGPTService = require('../services/chatgpt.service');
const discordTTS = require('../services/discordTTS.service');
const CopypastaService = require('../services/copypasta.service')
const HorarioOficial = require('../services/horario.service');
const Slots = require('../services/slots.service');
require('dotenv').config()

const copypasta = new CopypastaService();
const translate = new TranslateService();

const geralChannel = cubot.channels.cache.get('855695828856864799');
const slotsService = new Slots();
const chatGPT = new ChatGPTService()

const handleDiscordInteraction = async (interaction) => {
	const horarioOficial = new HorarioOficial()
	if(interaction.isUserContextMenuCommand()){
		const originalMessage = await cubot.channels.cache.get(interaction.channelId).messages.fetch(interaction.targetId)
		let msg = await translate.translate(originalMessage.content, 'pt-br')
		console.log(msg)
		await interaction.reply({content: msg, ephemeral: false})
	}
	if(interaction.isStringSelectMenu()){
		if(interaction.customId === 'copypasta'){
			let msg = await copypasta.getCopypasta(interaction.values[0])
			await interaction.update({ content: msg, ephemeral:true });	
		}
	}
	if(interaction.isButton()){
		switch(interaction.customId){
			case 'gptRefresh':
				console.log( await utils.getReferencedMessage(cubot.channels.cache.get(interaction.channelId), interaction))
				console.log(interaction.message.reference.mesageId)
				await chatGPT.answerPrompt(interaction, true)
				// console.log(originalPrompt)
				await interaction.reply('refreshei')
				break;
			case 'gptContinue':
				const thread = await interaction.message.startThread({
					name: 'papos',
					autoArchiveDuration: 60
				})
				// await interaction.reply('ainda não sei :(')
				break;
			default:
				const buttomConnection = new AudioChannel(cubot, interaction.guildId, interaction.channelId);
				const buttomFile = path.join(__dirname, 'src/sounds/' + interaction.customId +  '.mp3')
				buttomConnection.playAudio(buttomFile)
				break;
		}
	}
	if (!interaction.isCommand()) return;
	switch (interaction.commandName) {
		case 'copypasta':
			const copypastas = await copypasta.getSelectCopypastas();
			const copypastaSelect = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('copypasta')
                        .setPlaceholder('Selecione')
                        .addOptions(copypastas)
				)
			await interaction.reply({ content: 'Selecione uma Copypasta', ephemeral: true, components: [copypastaSelect] })
			break;
		case 'corvo':
			const corvoFile = path.join(__dirname, 'src/sounds/corvo.mp3');
			switch (cubot.channels.cache.get(interaction.channelId).type) {
				case 'GUILD_VOICE':
					const corvoConnection = new AudioChannel(cubot, interaction.guildId, interaction.channelId);
					corvoConnection.playAudio(corvoFile)
					break;
				case 'GUILD_TEXT':
					await interaction.reply({ files: [corvoFile] })
					break;
			}
			break;
		case 'fala':
			const falaConnection =  new AudioChannel(cubot, interaction.guildId, interaction.channelId)
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
			await interaction.reply('hmmmm')
			const nome = interaction.options.getString('nome');
			if (nome.length === 1) {
				await interaction.editReply({ content: 'porra, não fode', ephemeral: true });
				break;
			}
			const msg = await axios.get(`http://feras-leaderboards.herokuapp.com/guzclap/genio/${nome}`)
			await interaction.editReply(msg.data.msg);
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
		case 'recalp':
			const userId = interaction.user.id
			console.log(interaction)
			const recalpButton = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setURL(`https://recalp.feras.club/?user_id=${userId}`)
						.setLabel('RECALP')
						.setStyle(ButtonStyle.Link),
				)
			await interaction.reply({ content: 'Esse é o seu recalp de 2022', ephemeral: true, components: [recalpButton]})

			break;
		case 'vibing':
			const sequence = [
				"┌(・。・)┘♪",
				"└(・▽・)┐ ♪",
				"┌(・。・)┘♪",
				"└(・▽・)┐♪  ♪",
				"┌(・。・)┘♪",
				"└(・▽・)┐ ♪",
				"┌(・。・)┘♪",
				"└(・▽・)┐ ♪ ♪",
				"└(・。・)┐ ♪"
			];
			await utils.animatedText(interaction, sequence, 500, true)
			break;
		case 'slots': 
			await slotsService.roll(interaction);
			break;
		case 'instants':
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('corvo')
						.setLabel('Corvo')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('tistreza')
						.setLabel('Tistreza')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('rapaz')
						.setLabel('Rapaz')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('sair')
						.setLabel('Sair')
						.setStyle(ButtonStyle.Danger),
				)
			await interaction.reply({ content: 'Selecione um áudio', components: [row]})
			break;

		case 'teste':
			const testeConnection = new AudioChannel(cubot, interaction.guildId, interaction.channelId);
			testeConnection.playAudio(horarioOficial.horarioOficialFile())
			await interaction.reply({ content: 'hm', ephemeral: true })
			break;
		case 'gpt':
			await chatGPT.answerPrompt(interaction)
			const gptButtons = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('gptRefresh')
						.setLabel('Refresh')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('gptContinue')
						.setLabel('Continuar conversa')
						.setStyle(ButtonStyle.Primary),
				)
			await interaction.followUp({ content: '...', components: [gptButtons]})
			break;
		case 'alexa':
			interaction.reply('...')
			const alexaConnection = new AudioChannel(cubot, interaction.guildId , interaction.channelId);
			await alexaConnection.recordCommand()
			await chatGPT.answerVoice(interaction)
			// alexaConnection.playAudio(corvo)
	}
}

module.exports = { handleDiscordInteraction, geralChannel }