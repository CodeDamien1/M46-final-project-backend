const { DataTypes } = require("sequelize")
const connection = require("../db/connection")

const User = connection.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    locality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{ indexes: [{ unique: true, fields: ["username"] }]}
)

module.exports = User
