import {DataTypes, Sequelize} from "sequelize";

export interface IUser {
    id: number,
    fullName: string,
    email: string,
    passwordHash: string,
    salt: number,
    accessToken: string
}

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: dataTypes.STRING,
            field: 'full_name'
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false
        },
        passwordHash: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'password_hash'
        },
        salt: {
            type: dataTypes.INTEGER,
            // allowNull: false
        },
        accessToken: {
            type: dataTypes.STRING,
            field: 'access_token'
        }
    }, {
        tableName: 'users',
        schema: 'feed',
        createdAt: false,
        updatedAt: false
    });

    User.associate = (models) => {
        models.User.hasMany(models.SocialIntegration, {foreignKey: 'user_id', sourceKey: 'id'});

        models.User.belongsToMany(models.Publication, {
            through: models.UserPublication
        });

        models.User.belongsToMany(models.Category, {
            through: models.UserCategory
        });
    };

    return User;
}
