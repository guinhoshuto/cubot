const { Client, Intents, MessageEmbed } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior  } = require('@discordjs/voice');
const path = require('path');

const cubot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})

const geralChannel = cubot.channels.cache.get('855695828856864799');

const handleDiscordInteraction = async (interaction) =>{
    if(!interaction.isCommand()) return;
    switch(interaction.commandName){
		case 'tiro':
			console.log(interaction.channelId)
			const wish = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Wish')
				.setImage(path.join(__dirname, 'wish.gif'))

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
		case 'teste':
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Play
				}
			});
			// const file = path.join(__dirname, 'nanohakase.mp4')
			const file = path.join(__dirname, 'horarios' ,'0000.mp3')
			const resource = createAudioResource(file, {inlineVolume: true});
			resource.volume.setVolume(0.5);
			const connection = joinVoiceChannel({
				channelId: '855694949151801354',
				guildId: '855694948707991593',
				selfDeaf: false,
				adapterCreator: cubot.guilds.cache.get('855694948707991593').voiceAdapterCreator
			})
			console.log(path.join(__dirname, 'horarios', '0000.mp3'))
			player.play(resource)
			player.on('error', error => {
				console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
			});

			connection.subscribe(player)
			// console.log(player);
			console.log(player._state.resource);
			connection.destroy()
			await interaction.reply({content: 'hm', ephemeral: true })
    }
}

module.exports = { cubot, handleDiscordInteraction, geralChannel }