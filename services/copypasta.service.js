const axios = require('axios')
require('dotenv').config();
const url = `https://sheets.googleapis.com/v4/spreadsheets/10-Wi3DVCglNNM2vprIimlKudHkOArdDRxmuetysimGs/values/copypastas?alt=json&key=${process.env.SHEETS_TOKEN}`

module.exports = class CopypastaService {
    constructor() { }

    async getCopypastas() {
        console.log(url)
        const copypastas = await axios.get(url)
        // console.log(response.data.values)
        return copypastas.data.values
    }

    async getCopypasta(nome) {
        const copypastas = await this.getCopypastas()
        const result = copypastas.filter(copypasta => copypasta[0] === nome)
        console.log(result)
        if (result.length > 0) {
            return result[0][1]
        } else {
            return 'não encontrei nenhuma copypasta com esse nome, digite ? no comando /copypasta pra ver quais eu conheço'
        }
    }
}