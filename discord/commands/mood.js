const { SlashCommandBuilder } = require('@discordjs/builders');
const moods = require('./mood')
const choices = [];

console.log(moods)

moods.forEach(mood => {
    choices.push({name: mood, value: mood})
})

const data = new SlashCommandBuilder()
    .setName('mood')
    .setDescription('fala uma coisa ai')
    .addStringOption( option => 
        option.setName('moods')
            .setDescription('qq ce quer')
            .setRequired(true)
            .addChoices(
                ...choices
            ));

module.exports = data