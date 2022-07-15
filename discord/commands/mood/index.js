const fs = require('fs')

const memes = [];
const files = fs.readdirSync(__dirname);
files.forEach(file => {
    if(file !== 'index.js')
        memes.push(file)
});

console.log(memes)

module.exports = memes
