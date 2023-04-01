const { SlashCommandBuilder, ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');

const data = new ContextMenuCommandBuilder()
	.setName('Aff tá em inglês')
	.setType(ApplicationCommandType.Message);

module.exports = data;