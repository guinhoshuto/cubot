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

function tiraArroba(nome){
    if(nome.substring(0,1)==='@') return nome.substring(1); 
    return;
}

const handleMessages = (channel, tags, message, self) => {
    if(self) return;
    switch( message.toLowerCase()){
        case '!cuscuz':
            client.say(channel, `@${tags.username}, o cuscuz tá pronto!`)
            break;
        case '!13':
            client.say(channel, 'guzcalRedstar')
            break;
        case '!chame':
            client.say(channel, "meu amigo pessoal @miguelchame")
            break;
        case '!orçamento secreto':
            client.say(channel, `!points`)
            break;
        case '!gamble all':
            client.say(channel, `o ousado chegou`)
            break;
        case '!rachadinha':
            axios.put(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/dividaJu/${tiraArroba(tags.username)}`)
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
    if(tags.username === 'mazeeein'){
        if(message === '!slots 13'){
            client.say(channel, `@mazeeein você roletou guzcalRedstar | guzcalRedstar | guzcalRedstar`) 
        }
    }

    // if(tags.mod){
    //     const words = message.split(" ");
    //     let member = '';
    //     let att = '';
    //     switch(words[0]){
    //         case '!addkappa':
    //             att = 'kappa';
    //             member = words[1];
    //         case '!addFirst':
    //             att = 'first';
    //             member = words[1];
    //     }
    //     const guzEndpoint = `https://feras-leaderboards.herokuapp.com/guzclap/twitch/${att}/${tiraArroba(member)}`; 
    //     axios.put(guzEndpoint)
    //     .then(() => client.say(channel, "prontinho"))
    //     .catch(e => {
    //         client.say(channel, "vc não manda em mim (mentira, deu algum ruim aqui)");
    //         console.log('e', e);
    //     })
    // }

    if(message.substring(0,3) === '!ju') {
        const msgJu = message.substring(4);
        console.log(msgJu.substring(0, 11));
        if(msgJu.substring(0, 7) === '!gamble'){
            client.say(channel, `@${tags.username}, ô porra!`)
        } else if(msgJu.substring(0, 6) === '!slots'){
            client.say(channel, `Hoje não, Faro!`)
        } else if(msgJu.substring(0, 11) === '!givepoints'){
            client.say(channel, `algum mod pode dar ban no @${tags.username}, por favor?`)
        } else {
            client.say(channel, `${msgJu}`)
        }
    }
}


module.exports = {
    client: client,
    handleMessages: handleMessages
}