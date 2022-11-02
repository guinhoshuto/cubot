const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('ifood')
    .setDescription('deixa que eu peço pra você')
    
module.exports = data;