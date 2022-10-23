const utils = require('../utils')
const axios = require('axios')

module.exports = class Kappa{
    constructor(){
        this.endpoint = `https://feras-leaderboards.herokuapp.com/guzclap/twitch`;
    }

    async atualizaStats(channel, att, member){
        const guzEndpoint = `${this.endpoint}/${att}/${utils.tiraArroba(member)}/1`;
        try {
            await axios.put(guzEndpoint)
        } catch (e) {
            client.say(channel, "vc não manda em mim (mentira, deu algum ruim aqui)");
            console.log('e', e);
        }
    }

    async getKappa(){
        try{
            const kappa = await axios.get(`${this.endpoint}/kappa`)
            let msg = 'Lista de ganhadores do slots (geral): ';
            kappa.data.forEach(u => msg += `${u.username}: (${u.kappa}x) |`);
            return msg;
        } catch(e) {
            console.log(e)
            return `eu não sei o(╥﹏╥)o`;
        };
    }

    async getKappaMes(){
        try{
            const kappaMes = await axios.get(`${this.endpoint}/kappaMes`);
            let msg = 'Lista de ganhadores do slots (mês): ';
            kappaMes.data.forEach(u => msg += `${u.username}: (${u.kappaMes}x) |`)
            return msg;
        }catch(e) {
            console.log(e)
            return `eu não sei o(╥﹏╥)o`;
        };

    }

    async rachadinha(){

    }

    async addKappa(member){

    }

    async addFirst(member){

    }

}