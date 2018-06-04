import {Sequelize, DataTypes} from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    const Publication = sequelize.define('Publication', {
        id: {
            type: dataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: dataTypes.STRING
        },
        url: {
            type: dataTypes.STRING
        },
        text: {
            type: dataTypes.TEXT
        },
        mediaUrls: {
            type: dataTypes.ARRAY(dataTypes.STRING),
            field: "media_urls"
        }
    }, {
        tableName: 'publications',
        schema: 'feed',
        updatedAt: false
    });

    Publication.associate = (models)=> {
        models.Publication.belongsToMany(models.Category, {
            through: models.PublicationCategory,
        });

        models.Publication.belongsToMany(models.User, {
            through: models.UserPublication,
        });
    };

    return Publication;
}
