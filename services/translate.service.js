const axios = require('axios')

module.exports = class Translate{
    constructor(){
        this.options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: {
                'to[0]': 'pt-br',
                'api-version': '3.0',
                profanityAction: 'NoAction',
                textType: 'plain'
            },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
        }
    }

    async translate(text, to){
        this.options.data = `[{"Text":"${text.replace( /[\r\n]+/gm, "" )}"}]`;
        this.options.params['to[0]'] = to;

        console.log(this.options)

        const traducao = await axios.request(this.options)
        return traducao.data[0].translations[0].text
    }
}