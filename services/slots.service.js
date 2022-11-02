const utils = require('../discord/utils')

module.exports = class Slots{
    constructor(){
        this.emojis = [
            ':guzcalPamoinha:',
            ':primo:', 
            ':sumeru:',
            ':guzcalVilaNova:',
            ':guzcalRedstar:',
            ':guzcal13:',
            ':tirorosa:',
            ':tiroazul:',
            ':HollowKnight:'  
        ]
    }

    // line(){

    // }    

    roll(interaction){

        utils.animatedText(interaction, sequence, 200)
    }
}