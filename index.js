const axios = require('axios');
const juliette = require('./twitch')
const { cubot } = require('./discord')
require('dotenv').config();

juliette.client.connect();
juliette.client.on('message', juliette.handleMessages);

cubot.on('ready', () => {
    console.log('entrei')
});

cubot.login(process.env.DISCORD_TOKEN)
.then(() => console.log('ok'))
.catch((e) => console.log('e:', e))