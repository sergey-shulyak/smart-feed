import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {
    const SocialIntegration = sequelize.define("SocialIntegration", {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: dataTypes.STRING,
            allowNull: false
        },
        accessToken: {
            type: dataTypes.STRING,
            field: "access_token"
        },
        externalUserId: {
            type: dataTypes.STRING,
            field: "external_user_id"
        },
        username: {
            type: dataTypes.STRING
        },
        userId: {
            type: dataTypes.INTEGER,
            field: "user_id"
        }
    },
        {
            tableName: "social_integrations",
            schema: "feed",
            createdAt: false,
            updatedAt: false
        }
    );

    SocialIntegration.associate = models => {
        models.SocialIntegration.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id"
        });
    };

    return SocialIntegration;
}
