const fs = require('fs')

const moods = [];
const files = fs.readdirSync(__dirname);

files.forEach(file => {
    if(file !== 'index.js')
        moods.push(file)
});
console.log(moods)

module.exports = moods;