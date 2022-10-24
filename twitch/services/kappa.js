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

    async addKappa(member){

    }

    async addFirst(member){

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

    async rachadinha(channelName, username){
        const userPoints = await this.getUserPoints(channelName, username);
        const dividaJu = await this.getDivida(username);
        console.log(userPoints)

        if (dividaJu < 10000) {
            if (Object.keys(userPoints).length === 0 || userPoints.user.points < 2000) {
                axios.put(`http://feras-leaderboards.herokuapp.com/guzclap/twitch/dividaJu/${utils.tiraArroba(username)}/1000`)
                .then(() => {
                    return `!givepoints @${username} 1000`;
                })
                .catch((e) => {
                    console.log(e)
                    return `@${username} a casa caiu`;
                })
            } else {
                return 'corrupção não é bagunça!'
            }
        } else {
            return `@${username} já te dei mais de ${dividaJu} ponguz. Quem quer rir tem que fazer rir.`;
        }
    }

    async getUserPoints(channelName, username){
        const userPoints = await axios.get(`http://feras-leaderboards.herokuapp.com/find/${channelName}/${username}`);
        return userPoints.data;
    }

    async getDivida(username){
        const dividaJu = await axios.get(`${this.endpoint}/${utils.tiraArroba(username)}`)
        return parseInt(dividaJu.data[0].dividaJu);
    }


}