const { SlashCommandBuilder } = require('@discordjs/builders');
// const axios = require('axios');

const data = new SlashCommandBuilder()
    .setName('copypasta')
    .setDescription('copia aí')
    // .addStringOption(option => 
    //     option.setName('copypastas')
    //         .setDescription('selecione uma copypasta ou digite ? para saber quais estão cadastradas')
    //         .setRequired(true)
    //     );


// const getCopypastas = async () => {
//     return axios.get('http://feras-leaderboards.herokuapp.com/cubot/copypasta')
// }

// console.log(getCopypastas())
// console.log(options_)

// ;(async () => {
//     const options_ = await getCopypastas()
//     console.log(options_)
// })

// const options_ = await getCopypastas();
// console.log(getCopypastas().then(c => c))
// copypastas.forEach(copypasta => {
//     options.push({name: copyp})
// })
module.exports = data;