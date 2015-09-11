var Path = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE
});

module.exports = {
    sequelize: sequelize,
    word: sequelize.import(Path.join(__dirname, 'models/word')),
    used: sequelize.import(Path.join(__dirname, 'models/used')),
    stat: sequelize.import(Path.join(__dirname, 'models/stat'))
};
