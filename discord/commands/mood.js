const { SlashCommandBuilder } = require('discord.js');
const memes = require('./mood/')
const choices = [];

console.log(memes)

memes.forEach(mood => {
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