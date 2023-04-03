const wait = require('node:timers/promises').setTimeout;

async function animatedText(interaction, sequence, delay, erase){
    for(let i = 0; i < sequence.length; i++){
        if(i === 0){
			await interaction.reply(sequence[i]);
        } else {
			await interaction.editReply(sequence[i]);
        }
        await wait(delay);
    }
    if(erase) await interaction.deleteReply();
}

function splitBigMessages(message){
  let arr = [];
  for(let i = 0; i < message.length; i+=1999) {
    arr.push(message.substr(i, 1999));
  }
  return arr;
}

async function getChannelLastMessages(channel, qtd=5){
  const lastMessages = []
  console.log(await channel.messages.cache.get(3))
  // const fetchLastMessages = await channel.messages.fetch(qtd).map(m => lastMessages.append({'id': m.id, 'content': m.content}));
  return lastMessages;
}

async function getReferencedMessage(channel, interaction){
  const referencedMessage = await channel.messages.fetch(interaction.message.reference.messageId)
  return referencedMessage.content

}
module.exports = { animatedText, splitBigMessages, getReferencedMessage, getChannelLastMessages }