const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();

const client = new tmi.Client({
    connection: { reconnect: true }, 
    options: { debug: true },
    identity: { 
        
    }
})
