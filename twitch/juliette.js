const { Configuration, OpenAIApi } = require('openai');
const tmi = require('tmi.js');
const utils = require('./utils');
const axios = require('axios');
// const conn = require('../db')
const { cubot } = require('../discord')
const mysql = require('mysql2/promise')

const Kappa = require('../services/kappa.service')
require('dotenv').config();

const kappa = new Kappa();


// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
// })
// const openai = new OpenAIApi(configuration)
// conn.connect();

const client = new tmi.Client({
    connection: { reconnect: true },
    options: { debug: true },
    identity: {
        username: 'juliette_freire_bot',
        password: process.env.TWITCH_OAUTH
    },
    channels: ['marcellus_v', 'guzcalp', 'guinhoshuto', 'mazeeein']
});

const handleMessages = async (channel, tags, message, self) => {
    const channelName = channel.substring(1)
    console.log(message);
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
    if (self) return;
    message = message.toLowerCase();
    const words = message.split(" ");
    if (channelName === 'guzcalp' || channelName === 'guinhoshuto' || channelName === 'u________u') {
        console.log(words)
        if (words[0] === '!preceito' || words[0] === '!preceitos') {
            const preceitos = await axios.get(`http://feras-leaderboards.herokuapp.com/cubot/preceitos/${words[1] !== undefined ? words[1] : ''}`)
            const preceito = preceitos.data[Math.floor(Math.random() * preceitos.data.length)]
            client.say(channel, `Preceito #${preceito.numero}: ${preceito.nome} - ${preceito.preceito}`)
        }
        switch (message) {
            case '!cornos':
            case '!corno':
                cubot.channels.cache.get('855695828856864799').send('Chamando todos os cornos lá na live do guz https://twitch.com/guzcalp')
                break;
            case '!ciao':
                const ciao = ['oi', 'tchau']
                client.say(channel, `@${tags.username} ${ciao[Math.floor(Math.random() * 2)]}`)
                break;
            case '!kappaju':
                const kappaGeral = await kappa.getKappa();
                client.say(channel, kappaGeral);
                break;
            case '!kappamesju':
                const kappaMes = await kappa.getKappaMes();
                client.say(channel, kappaMes)
                break;
            case '!rachadinha':
                const dividaResponse = await kappa.rachadinha(channelName, tags.username);
                client.say(channel, dividaResponse)
                break;
        }
        if (tags.mod || tags.username === 'guzcalp') {
            let member = '';
            let att = '';
            console.log(words[0])
            switch (words[0]) {
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
        if (tags.username === 'streamelements') {
            if (words[0] === '@juliette_freire_bot,') {
                // const conn = await mysql.createConnection(process.env.DATABASE_URL);
                console.log('entrou no salvar quote')
                const numero = parseInt(words[1].substring(1, words[1].length - 1));
                const quote = words.slice(2, words.length).join(' ')
                axios.post('https://api.feras.club/quotes', {
                    quoteNumber: numero,
                    quote: quote,
                    channel: 'guzcalp',
                    channelId: '546486945',
                })
                // try{
                //     conn.execute(`INSERT INTO quotes (numero, quote, canal) VALUES (${numero}, '${quote}' , "${channelName}")`)
                //     .then(() => console.log('salvou quote ', numero))
                // } catch (e){
                //     console.log(e)
                // }
            }
            if (words.at(-4) === 'ganhou') {
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
            if (words.at(-2) === 'juliette_freire_bot' & words[1] === 'deu') {
                axios.put(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/dividaJu/${words[0]}/-${words[2]}`)
                    .then(() => {
                        axios.get(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/${utils.tiraArroba(words[0])}`)
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

    // if (words[0] === '@juliette_freire_bot') {
    //     const pergunta = message.substring(21);
    //     console.log(pergunta)
    //     openai.createCompletion({
    //         model: 'text-davinci-002',
    //         prompt: pergunta,
    //         temperature: 0.7,
    //         max_tokens: 100,
    //     })
    //         .then((response) => {
    //             client.say(channel, response.data.choices[0].text)
    //         })
    //         .catch(e => {
    //             console.log(e)
    //             client.say(channel, `eu não sei o(╥﹏╥)o`)
    //         })
    // }
    switch (message) {
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
    if (tags.username === 'mazeeein') {
        if (message === '!slots 13') {
            client.say(channel, `@mazeeein você roletou guzcalRedstar | guzcalRedstar | guzcalRedstar`)
        }
    }

    if (words[0] === '!ju') {
        words.shift();
        console.log(words)
        if (words.includes('!gamble')) {
            client.say(channel, `@${tags.username}, ô porra!`)
        } else if (words.includes('!slots') || words.includes('!slot')) {
            client.say(channel, `Hoje não, Faro!`)
        } else if (words.includes('!givepoints')) {
            client.say(channel, `algum mod pode dar ban no @${tags.username}, por favor?`)
        } else if (words.includes('!join')) {
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