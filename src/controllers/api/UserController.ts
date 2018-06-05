import * as Router from "koa-router";

import {findByAccessToken, findById, getSocialIntegrations, updateUser} from "../../services/UserService";
import {addUserCategory, findUserCategories, removeUserCategory} from "../../services/CategoryService";
import {addUserFavorite, findUserFavorites, removeUserFavorite} from "../../services/PublicationService";

const userController = new Router();

userController.get("/:userId", async (ctx) => {
    // ctx.body = await findByAccessToken(ctx.cookies.get("accessToken"));
    ctx.body = await findById(ctx.params.userId);
});

userController.put("/:userId", async (ctx) => {
    // const user = await findByAccessToken(ctx.cookies.get("accessToken"));
    const user = await findById(ctx.params.userId);
    const update = ctx.request.body;

    ctx.body = await updateUser(user, update);
});

userController.get("/:userId/socialIntegrations", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);
    const user = await findById(ctx.params.userId);

    ctx.body = await getSocialIntegrations(user);
});

userController.get("/:userId/categories", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);
    const user = await findById(ctx.params.userId);

    console.log('FOUND USER', user.get());

    ctx.body = await findUserCategories(user);
});

userController.post("/:userId/categories", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);
    const user = await findById(ctx.params.userId);
    const categoryId = ctx.request.body.categoryId;

    ctx.body = await addUserCategory(user, categoryId);
});

userController.delete("/:userId/categories/:id", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);
    const user = await findById(ctx.params.userId);

    const categoryId = ctx.params.id;

    ctx.body = await removeUserCategory(user, categoryId);
});

userController.get("/:userId/favorites", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);
    const user = await findById(ctx.params.userId);

    ctx.body = await findUserFavorites(user);
});

userController.post("/:userId/favorites", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);
    const user = await findById(ctx.params.userId);
    const favoriteId = ctx.request.body.favoriteId;

    ctx.body = await addUserFavorite(user, favoriteId);
});

userController.delete("/:userId/favorites/:id", async (ctx) => {
    // const accessToken = ctx.cookies.get("accessToken");
    // const user = await findByAccessToken(accessToken);

    const user = await findById(ctx.params.userId);

    const favoriteId = ctx.params.id;

    ctx.body = await removeUserFavorite(user, favoriteId);
});

export default userController;
