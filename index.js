const axios = require('axios');
const juliette = require('./twitch')
require('dotenv').config();

juliette.client.connect();
juliette.client.on('message', juliette.handleMessages);
