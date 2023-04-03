const {ActivityType , Client, GatewayIntentBits } = require('discord.js')

const cubot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
	]
})

function serverLogin(){
    cubot.on('ready', () => {
        console.log('DISCORD: bot on')
    });

    cubot.login(process.env.DISCORD_TOKEN)
        .then(() => console.log('DISCORD: login ok'))
        .catch((e) => console.log('e:', e))

    // cubot.setActivity('hmm', {type: ActivityType.Watching})
}

module.exports = { cubot, serverLogin }