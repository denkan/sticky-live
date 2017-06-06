const settings = require('./config.json');
console.log('------- SETTINGS -------');
console.log(JSON.stringify(settings, null, 2));
console.log('------------------------');
module.exports = settings;
