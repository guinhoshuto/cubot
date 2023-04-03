const utils = require('../discord/utils')
const { cubot } = require('../lib/discord')
const openai = require('../lib/openai')

module.exports = class ChatGPTService{
    constructor(){}

    async answerPrompt(interaction, refresh=false){
        await interaction.reply('...')
        const prompt = refresh ? await utils.getReferencedMessage(cubot.channels.cache.get(interaction.channelId), interaction) : interaction.options.getString('prompt')
        await interaction.editReply(prompt)
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });
        const gptResponse = completion.data.choices[0].message;
        console.log(gptResponse.content)
        await interaction.followUp(`**prompt tokens**: ${completion.data.usage.prompt_tokens} | **competion_tokens**: ${completion.data.usage.completion_tokens} | **total**: ${completion.data.usage.total_tokens}`)
        utils.splitBigMessages(gptResponse.content).forEach(async(m) =>  {
            await interaction.followUp(m)
        })
    }
}