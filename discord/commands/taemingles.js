const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v9');

const data = new ContextMenuCommandBuilder()
	.setName('Aff tá em inglês')
	.setType(ApplicationCommandType.Message);

module.exports = data;