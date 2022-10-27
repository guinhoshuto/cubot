const path = require('path');

module.exports = class Horarios{
    constructor(){}

    horarioOficial(){
        const now = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        return ('0' + now.substring(0, 2)).slice(-2) + '00';
    }

    horarioOficialFile(){
        return path.join('../discord/src/horarios',  + '.mp3')
    }

}
