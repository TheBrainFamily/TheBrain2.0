const fs = require('fs')
console.log(JSON.parse(fs.readFileSync(`${__dirname}/../package.json`)).name)
