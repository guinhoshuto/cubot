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

module.exports = { animatedText }