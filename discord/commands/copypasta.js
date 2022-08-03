const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const options_ = []; 
const x = (async function(options){
    const copypastas = await axios.get('http://feras-leaderboards.herokuapp.com/cubot/copypasta')
    copypastas.data.forEach(c => {
        options.push({name: c.nome.split("_").join(" "), value: c.nome})
    });
    // console.log(options)
    return options;
})(options_);

// const getCopypastas = async () => {
//     return axios.get('http://feras-leaderboards.herokuapp.com/cubot/copypasta')
// }

// console.log(getCopypastas())
console.log(options_)

// ;(async () => {
//     const options_ = await getCopypastas()
//     console.log(options_)
// })

// const options_ = await getCopypastas();
const data = new SlashCommandBuilder()
    .setName('copypasta')
    .setDescription('copia aí')
    .addStringOption(option => 
        option.setName('copypastas')
            .setDescription('selecione uma copypasta')
            .setRequired(true)
            .addChoices(
                ...options_
            )
        );
// console.log(getCopypastas().then(c => c))
// copypastas.forEach(copypasta => {
//     options.push({name: copyp})
// })