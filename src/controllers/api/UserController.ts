import * as Router from "koa-router";

import {findByAccessToken, getSocialIntegrations, updateUser} from "../../services/UserService";
import {addUserCategory, findUserCategories, removeUserCategory} from "../../services/CategoryService";
import {addUserFavorite, findUserFavorites, removeUserFavorite} from "../../services/PublicationService";

const userController = new Router();

userController.get("/", async (ctx) => {
    ctx.body = await findByAccessToken(ctx.cookies.get("accessToken"));
});

userController.put("/", async (ctx) => {
    const user = await findByAccessToken(ctx.cookies.get("accessToken"));
    const update = ctx.request.body;

    ctx.body = await updateUser(user, update);
});

userController.get("/socialIntegrations", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);

    ctx.body = await getSocialIntegrations(user);
});

userController.get("/categories", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);

    ctx.body = await findUserCategories(user);
});

userController.post("/categories", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);
    const categoryId = ctx.request.body.categoryId;

    ctx.body = await addUserCategory(user, categoryId);
});

userController.delete("/categories/:id", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);

    const categoryId = ctx.params.id;

    ctx.body = await removeUserCategory(user, categoryId);
});

userController.get("/favorites", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);

    ctx.body = await findUserFavorites(user);
});

userController.post("/favorites", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);
    const favoriteId = ctx.request.body.favoriteId;

    ctx.body = await addUserFavorite(user, favoriteId);
});

userController.delete("/favorites/:id", async (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const user = await findByAccessToken(accessToken);

    const favoriteId = ctx.params.id;

    ctx.body = await removeUserFavorite(user, favoriteId);
});


export default userController;
