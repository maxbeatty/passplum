module.exports = function (sequelize, DataTypes) {

    return sequelize.define('used', {
        hash: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        }
    }, {
        paranoid: true
    });
};
