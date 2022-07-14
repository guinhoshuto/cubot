const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();

const client = new tmi.Client({
    connection: { reconnect: true},
    options: {debug: true},
    identity: {
        username: 'juliette_freire_bot',
        password: process.env.TWITCH_OAUTH
    },
    channels: ['marcellus_v', 'guzcalp', 'guinhoshuto']
});

const handleMessages = (channel, tags, message, self) => {
    if(self) return;
    switch( message.toLowerCase()){
        case '!cuzcuz':
            client.say(channel, `@${tags.username}, o cuscuz tá pronto!`)
            break;
        case '!chame':
            client.say(channel, "meu amigo pessoal @miguelchame")
            break;
        case '!orçamento secreto':
            client.say(channel, `!points`)
            break;
        case '!rachadinha':
            const c = channel.substring(1)
            axios.get(`http://feras-leaderboards.herokuapp.com/find/${c}/${tags.username}`)
            .then(user => {
                if(Object.keys(user.data).length === 0 ||user.data.user.points < 2000 ){
                    client.say(channel, `!givepoints @${tags.username} 1000`)
                } else {
                    client.say(channel, 'corrupção não é bagunça!')
                }
            })
            .catch(e => console.log(e));
            break;
        case '!teste':
            console.log(channel)
            break;
    }
    if(message.substring(0,3) === '!ju') 
        client.say(channel, `${message.substring(4)}`)
}


module.exports = {
    client: client,
    handleMessages: handleMessages
}