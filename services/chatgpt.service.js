const fs = require('fs')
const utils = require('../discord/utils')
const { cubot } = require('../lib/discord')
const openai = require('../lib/openai')
const path = require('path');

module.exports = class ChatGPTService{
    constructor(){}

    async getCompletion(prompt){
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });
        return completion
    }

    async answerPrompt(interaction, refresh=false){
        await interaction.reply('...')
        const prompt = refresh ? await utils.getReferencedMessage(cubot.channels.cache.get(interaction.channelId), interaction) : interaction.options.getString('prompt')
        await interaction.editReply(prompt)
        const completion = await this.getCompletion(prompt)
        const gptResponse = completion.data.choices[0].message;
        console.log(gptResponse.content)

        await interaction.followUp(`**prompt tokens**: ${completion.data.usage.prompt_tokens} | **competion_tokens**: ${completion.data.usage.completion_tokens} | **total**: ${completion.data.usage.total_tokens}`)
        utils.splitBigMessages(gptResponse.content).forEach(async(m) =>  {
            await interaction.followUp(m)
        })
    }

    async answerVoice(interaction){
        const output = path.join(__dirname, '..', 'discord/src/prompt.wav')
        const resp = await openai.createTranscription(
            fs.createReadStream(output),
            "whisper-1"
        );
        await interaction.editReply(`-> ${resp.data.text}`)
        const completion = await this.getCompletion(resp.data.text)

        await interaction.followUp(`-> ${completion.data.choices[0].message.content}`)
    }

}