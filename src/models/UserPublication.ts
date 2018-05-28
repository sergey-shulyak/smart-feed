import {Sequelize, DataTypes} from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    return sequelize.define('UserPublication', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: "user_id"
        },
        publicationId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: "publication_id"
        },
    }, {
        tableName: 'user_publication',
        schema: 'feed',
        updatedAt: false,
        createdAt: false
    });
}
