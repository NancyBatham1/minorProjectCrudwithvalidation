import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config.js';

class User extends Model { }

User.init(
    {
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
        password: {
            type: DataTypes.STRING
        }, 
        role: {
            type: DataTypes.ENUM,
            values: ['user', 'admin', 'manager'],
            defaultValue: 'user'
        }
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
        underscored: true
    },
);

export default User;