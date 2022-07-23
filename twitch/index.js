const { Configuration, OpenAIApi } = require('openai');
const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

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
    if(nome.charAt(0)==='@') return nome.substring(1); 
    return nome;
}

function atualizaStats(channel, att, member){
    const guzEndpoint = `https://feras-leaderboards.herokuapp.com/guzclap/twitch/${att}/${tiraArroba(member)}/1`; 
    console.log(guzEndpoint)
    axios.put(guzEndpoint)
    .then(() => client.say(channel, "prontinho"))
    .catch(e => {
        client.say(channel, "vc não manda em mim (mentira, deu algum ruim aqui)");
        console.log('e', e);
    })
}

const handleMessages = (channel, tags, message, self) => {
    if(self) return;
    const channelName = channel.substring(1)
    message = message.toLowerCase();
    const words = message.split(" ");
    console.log(words.at(-4))
    if(channelName === 'guzcalp'){
        console.log(words)
        switch(message){
            case '!kappaju':
                console.log(message);
                axios.get("http://feras-leaderboards.herokuapp.com/guzclap/twitch/kappa")
                .then(kappa => {
                    let msg = 'Lista de ganhadores do slots (geral): ';
                    kappa.data.forEach(u => msg += `${u.username}: (${u.kappa}x) |`)
                    client.say(channel, msg);
                })
                .catch((e) => {
                    console.log(e)
                    client.say(channel, `eu não sei o(╥﹏╥)o`)
                })
                break;
        case '!rachadinha':
            axios.put(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/dividaJu/${tiraArroba(tags.username)}/1000`)
            .then(() => {
                axios.get(`http://feras-leaderboards.herokuapp.com/find/${channelName}/${tags.username}`)
                .then(user => {
                    if(Object.keys(user.data).length === 0 ||user.data.user.points < 2000 ){
                        client.say(channel, `!givepoints @${tags.username} 1000`)
                    } else {
                        client.say(channel, 'corrupção não é bagunça!')
                    }
                })
                .catch(e => console.log(e));
            })
            .catch((e) => {
                client.say(channel, `@${tags.username} a casa caiu`)
                console.log(e)
            })
            break;
        }
        if(tags.mod || tags.username === 'guzcalp'){
            let member = '';
            let att = '';
            console.log(words[0])
            switch(words[0]){
                case '!addkappa':
                    att = 'kappa';
                    member = words[1];
                    atualizaStats(channel, att, member);
                    break;
                case '!addfirst':
                    console.log('first');
                    att = 'first';
                    member = words[1];
                    atualizaStats(channel, att, member);
                    break;
            }
        }
        if(tags.username === 'streamelements' & words.at(-4) === 'ganhou'){
            console.log(message)
            console.log(words[12])
            atualizaStats(channel, 'kappa', words[0]);
            axios.get("http://feras-leaderboards.herokuapp.com/guzclap/twitch/kappa")
            .then(kappa => {
                let msg = 'Lista de ganhadores do slots (geral): ';
                kappa.data.forEach(u => msg += `${u.username}: (${u.kappa}x) |`)
                client.say(channel, msg);
            })
            .catch((e) => {
                console.log(e)
                client.say(channel, `eu não sei o(╥﹏╥)o`)
            })
        }
    }

    if(words[0] === '@juliette_freire_bot'){
        const pergunta = message.substring(21);
        console.log(pergunta)
        openai.createCompletion({
            model: 'text-davinci-002',
            prompt: pergunta,
            temperature: 0.9,
            max_tokens: 100,
        })
        .then((response) => {
            client.say(channel,response.data.choices[0].text)
        })
        .catch(e => {
            console.log(e)
            client.say(channel, `eu não sei o(╥﹏╥)o`)
        })
    }
    switch(message){
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
        case '!teste':
            console.log(tags)
            break;
    }
    if(tags.username === 'mazeeein'){
        if(message === '!slots 13'){
            client.say(channel, `@mazeeein você roletou guzcalRedstar | guzcalRedstar | guzcalRedstar`) 
        }
    }

    if(words[0] === '!ju') {
        words.shift();
        console.log(words)
        if(words.includes('!gamble')){
            client.say(channel, `@${tags.username}, ô porra!`)
        } else if(words.includes('!slots') || words.includes('!slot')){
            client.say(channel, `Hoje não, Faro!`)
        } else if(words.includes('!givepoints')){
            client.say(channel, `algum mod pode dar ban no @${tags.username}, por favor?`)
        } else {
            client.say(channel, words.join(' '))
        }
    }
}

module.exports = {
    client: client,
    handleMessages: handleMessages
}