const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
// const { createReadStream } = require('node:fs');

const path = require('path');
const axios = require('axios');
const utils = require('./utils');
const AudioChannel = require('./audioChannel');
const TranslateService = require('../services/translate.service');
const discordTTS = require('../services/discordTTS.service');
const CopypastaService = require('../services/copypasta.service')
const HorarioOficial = require('../services/horario.service');
const Slots = require('../services/slots.service');
const openai = require('../lib/openai')
require('dotenv').config()

const copypasta = new CopypastaService();
const translate = new TranslateService();

const cubot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
})

const geralChannel = cubot.channels.cache.get('855695828856864799');
const slotsService = new Slots();

const handleDiscordInteraction = async (interaction) => {
	const horarioOficial = new HorarioOficial()
	if(interaction.isMessageContextMenu()){
		const originalMessage = await cubot.channels.cache.get(interaction.channelId).messages.fetch(interaction.targetId)
		let msg = await translate.translate(originalMessage.content, 'pt-br')
		console.log(msg)
		await interaction.reply({content: msg, ephemeral: false})
	}
	if(interaction.isSelectMenu()){
		if(interaction.customId === 'copypasta'){
			let msg = await copypasta.getCopypasta(interaction.values[0])
			await interaction.update({ content: msg, ephemeral:true });	
		}
	}
	if(interaction.isButton()){
		switch(interaction.customId){
			case 'gptRefresh':
				await interaction.followUp('refreshei')
				break;
			case 'gptRefresh':
				await interaction.followUp('continuei')
				break;
			default:
				const buttomConnection = new AudioChannel(cubot, interaction.channelId);
				const buttomFile = path.join(__dirname, 'src/sounds/' + interaction.customId +  '.mp3')
				buttomConnection.playAudio(buttomFile)
				break;
		}
	}
	if (!interaction.isCommand()) return;
	switch (interaction.commandName) {
		case 'copypasta':
			const copypastas = await copypasta.getSelectCopypastas();
			const copypastaSelect = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
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
					const corvoConnection = new AudioChannel(cubot, interaction.channelId);
					corvoConnection.playAudio(corvoFile)
					break;
				case 'GUILD_TEXT':
					await interaction.reply({ files: [corvoFile] })
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
			const recalpButton = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setURL(`https://recalp.feras.club/?user_id=${userId}`)
						.setLabel('RECALP')
						.setStyle('LINK'),
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
		case 'gpt':
			await interaction.reply(`${interaction.options.getString('propmt')}`)
			const completion = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [{role: "user", content: interaction.options.getString('prompt')}],
			});
			const gptResponse = completion.data.choices[0].message;
			console.log(gptResponse.content)
			await interaction.followUp(`**prompt tokens**: ${completion.data.usage.prompt_tokens} | **competion_tokens**: ${completion.data.usage.completion_tokens} | **total**: ${completion.data.usage.total_tokens}`)
			utils.splitBigMessages(gptResponse.content).forEach(async(m) =>  {
				await interaction.followUp(m)
			})
			const gptButtons = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('gptRefresh')
						.setLabel('Refresh')
						.setStyle('PRIMARY'),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('gptContinue')
						.setLabel('Continuar conversa')
						.setStyle('PRIMARY'),
				)
			await interaction.followUp({ content: '...', components: [getButtons]})
			break;
	}
}

module.exports = { cubot, handleDiscordInteraction, geralChannel }