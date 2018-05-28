import {Sequelize, DataTypes} from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    return sequelize.define('UserCategory', {
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
        categoryId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: "category_id"
        },
    }, {
        tableName: 'user_category',
        schema: 'feed',
        updatedAt: false,
        createdAt: false
    });
}
