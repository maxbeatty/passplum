var Path = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports = {
    sequelize: sequelize,
    word: sequelize.import(Path.join(__dirname, 'models/word')),
    used: sequelize.import(Path.join(__dirname, 'models/used')),
    stat: sequelize.import(Path.join(__dirname, 'models/stat'))
};
