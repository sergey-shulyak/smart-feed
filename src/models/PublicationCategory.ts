import {Sequelize, DataTypes} from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    return sequelize.define('PublicationCategory', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        publicationId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: "publication_id"
        },
        categoryId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: "category_id"
        }
    }, {
        tableName: 'publication_category',
        schema: 'feed',
        updatedAt: false,
        createdAt: false
    });
}