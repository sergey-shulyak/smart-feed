import {DataTypes, Sequelize} from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    const Category = sequelize.define('Category', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: dataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'categories',
        schema: 'feed',
        createdAt: false,
        updatedAt: false
    });

    Category.associate = (models) => {
        models.Category.belongsToMany(models.Publication, {
            through: models.PublicationCategory,
        });

        models.Category.belongsToMany(models.User, {
            through: models.UserCategory
        });
    };

    return Category;
}
