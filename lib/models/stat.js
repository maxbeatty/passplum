'use strict';

/*eslint camelcase: 0*/
module.exports = function (sequelize, DataTypes) {
    // zxcvbn results for used passphrases
    return sequelize.define('stat', {
        // in bits
        entropy: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        // estimation of actual crack time, in seconds
        crack_time: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        // crack time as a friendlier string: "instant", "6 minutes", "centuries", etc.
        crack_time_display: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // [0,1,2,3,4] if crack time is less than [10**2, 10**4, 10**6, 10**8, Infinity]
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // how long it took zxcvbn to calculate an answer, in milliseconds
        calc_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        underscored: true // to match zxcvbn's casing easily
    });
};
