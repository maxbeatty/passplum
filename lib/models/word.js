'use strict';

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('word', {
        word: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        usedCount: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        paranoid: true
    });
};
