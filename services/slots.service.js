const utils = require('../discord/utils')

module.exports = class Slots{
    constructor(){
        this.emojis = [
            '<:guzcalPamoinha:979145151811317860>', 
            '<:primo:927655639696699402>', 
            '<:sumeru:1013620881731367073>', 
            '<:guzcalVilaNova:938523205121998889>', 
            '<:guzcalRedstar:939688226321485835>', 
            '<:guzcal13:976904531721998396>', 
            '<:tirorosa:998645666920280076>', 
            '<:tiroazul:998645663833268274>', 
            '<:HollowKnight:1006266241163481128>'
        ]
    }

    randomNumber(){
        return Math.floor(Math.random() * this.emojis.length);
    }

    line(){
        return `${this.emojis[this.randomNumber()]} |  ${this.emojis[this.randomNumber()]} | ${this.emojis[this.randomNumber()]}` 
    }    

    roll(interaction){
        const sequence = [];
        for(let i = 0; i < 15; i++){
            sequence.push(this.line())
        }
        console.log(sequence.at(-1))
        utils.animatedText(interaction, sequence, 300, false)
    }

    win(result){
        const slots = result.split(' | ')
        return slots.every(slot => slot === slots[0] ? true : false)
    }

    handleResult(){
        
    }
}