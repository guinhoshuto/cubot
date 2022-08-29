const { Configuration, OpenAIApi } = require('openai');
const tmi = require('tmi.js');
const axios = require('axios');
// const { conn } = require('../db')
const { geralChannel, cubot } = require('../discord')
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

function addSlashes( str ) {
    return (str + '').replace(/[\\"']/g, '').replace(/\u0000/g, '');
}

function tiraArroba(nome){
    if(nome.charAt(0)==='@') return nome.substring(1); 
    return nome;
}

const atualizaStats = async (channel, att, member) => {
    const guzEndpoint = `https://feras-leaderboards.herokuapp.com/guzclap/twitch/${att}/${tiraArroba(member)}/1`; 
    console.log(guzEndpoint)
    try{
        await axios.put(guzEndpoint)
    } catch(e){
        client.say(channel, "vc não manda em mim (mentira, deu algum ruim aqui)");
        console.log('e', e);
    }
}

const handleMessages = async (channel, tags, message, self) => {
    const channelName = channel.substring(1)
    console.log(channel);
    // try{
    //     conn.query(`INSERT INTO logs (name, payload_data) VALUES ('twitch', '{
    //         "channel": "${channelName}", 
    //         "time": "${tags['tmi-sent-ts']}", 
    //         "username": "${tags.username}", 
    //         "message": "${addSlashes(message)}" 
    //     }')`)
    // } catch (e){
    //     console.log(e)
    // }
    if(self) return;
    // console.log(cubot.channels.cache.get('855695828856864799'))
    message = message.toLowerCase();
    const words = message.split(" ");
    console.log(words.at(-4))
    if(channelName === 'guzcalp' || channelName === 'guinhoshuto'){
        console.log(words)
        if(words[0] === '!preceito' || words[0] === '!preceitos'){
            const preceitos = await axios.get(`http://feras-leaderboards.herokuapp.com/cubot/preceitos/${words[1] !== undefined ? words[1] : ''}`)
            const preceito = preceitos.data[Math.floor(Math.random()*preceitos.data.length)]
            console.log(preceitos);
            client.say(channel, `Preceito #${preceito.numero}: ${preceito.nome} - ${preceito.preceito}`)
        }
        switch(message){
            case '!cornos':
            case '!corno':
                cubot.channels.cache.get('855695828856864799').send('Chamando todos os cornos lá na live do guz')
                break;
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
                });
                break;
            case '!rachadinha':
                const userPoints = await axios.get(`http://feras-leaderboards.herokuapp.com/find/${channelName}/${tags.username}`);
                console.log(userPoints.data)

                const dividaJu = await axios.get(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/${tiraArroba(tags.username)}`)
                console.log(dividaJu.data)

                if(parseInt(dividaJu.data[0].dividaJu)<10000){
                    if(Object.keys(userPoints.data).length === 0 || userPoints.data.user.points < 2000 ){
                        axios.put(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/dividaJu/${tiraArroba(tags.username)}/1000`)
                        .then(() => {
                            client.say(channel, `!givepoints @${tags.username} 1000`)
                        })
                        .catch((e) => {
                            client.say(channel, `@${tags.username} a casa caiu`)
                            console.log(e)
                        })
                    } else {
                        client.say(channel, 'corrupção não é bagunça!')
                    }
                } else {
                    client.say(channel, `@${tags.username} já te dei mais de ${dividaJu.data[0].dividaJu} ponguz. Quem quer rir tem que fazer rir.`)
                }
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
                    await atualizaStats(channel, att, member);
                    client.say(channel, 'prontinho')
                    break;
                case '!addfirst':
                    console.log('first');
                    att = 'first';
                    member = words[1];
                    await atualizaStats(channel, att, member);
                    client.say(channel, 'prontinho')
                    break;
            }
        }
        if(tags.username === 'streamelements'){
            if(words.at(-4) === 'ganhou'){
                console.log(message)
                console.log(words[12])
                await atualizaStats(channel, 'kappas', words[0]);
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
            if(words.at(-2) === 'juliette_freire_bot' & words[1] === 'deu'){
                axios.put(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/dividaJu/${words[0]}/-${words[2]}`)
                .then(() => {
                    axios.get(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/${tiraArroba(words[0])}`)
                    .then(data => {
                        client.say(channel, `obrigada, agora você me deve só ${data.data[0].dividaJu} ponguz`)
                    })
                    .catch(e => {
                        console.log(e);
                        client.say(channel, `completamente abublé das ideias`)
                    })
                })
                .catch((e) => {
                    console.log(e)
                    client.say(channel, `completamente ablublublé das ideias`)
                })
                
            }
        }
    }

    if(words[0] === '@juliette_freire_bot'){
        const pergunta = message.substring(21);
        console.log(pergunta)
        openai.createCompletion({
            model: 'text-davinci-002',
            prompt: pergunta,
            temperature: 0.7,
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
        } else if(words.includes('!join')){
            client.say(channel, words.join(' '))
            setTimeout(() => {
                client.say(channel, `obrigado @${tags.username}, você é um amigo!`)
            }, 2000)
        } else {
            client.say(channel, words.join(' '))
        }
    }
}

module.exports = {
    client: client,
    handleMessages: handleMessages
}