const axios = require('axios')
const audioChannel = require('./audioChannel.service')

module.exports = class DiscordTTS{
    constructor(){
        this.encodedParams = new URLSearchParams();
        this.encodedParams.append("f", "16khz_16bit_mono")
        this.encodedParams.append("c", "mp3")
        this.encodedParams.append("r", "0")
        this.encodedParams.append("b64", true)
        this.encodedParams.append("hl", "pt-br")

        this.options = {
            method: 'POST',
            url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
            params: { key: process.env.TTS_KEY },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
            },
        }
    }

    async tts(voice, speech, audioChannel){
        this.encodedParams.append("v", voice)
        this.encodedParams.append("src", speech)

        this.options.data = this.encodedParams

        axios.request(this.options)
        .then(response => {
            console.log(response.data)
            audioChannel.playAudio(response.data)
        })
        .catch(e => console.log('error: ', e))
    }
}