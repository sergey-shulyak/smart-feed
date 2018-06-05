import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import {verify} from "jsonwebtoken";
import {Context} from "koa";

import userController from "./UserController";
import categoriesController from "./CategoriesController";
import {findByAccessToken} from "../../services/UserService";
import feedController from "./FeedController";
import publicationsController from "./PublicationsController";

const authMiddleware = (async (ctx: Context, next: () => {}) => {
    const {body, headers} = ctx.request;

    const accessToken = headers['x-access-token'] || ctx.cookies.get('accessToken') || body && body.accessToken;

    if (!accessToken) {
        ctx.throw(HttpStatuses.UNAUTHORIZED);
    }

    const user = await findByAccessToken(accessToken);
    let isTokenValid;

    try {
        isTokenValid = Boolean(await verify(accessToken, process.env.JWT_PASSPHRASE));
    } catch (error) {
        ctx.throw(HttpStatuses.UNAUTHORIZED);
    }

    if (!accessToken || !isTokenValid || user && user.accessToken !== accessToken) {
        ctx.throw(HttpStatuses.UNAUTHORIZED);
    }

    await next();
});

const apiController = new Router();

apiController.use(authMiddleware);

// apiController.use("/feed", feedController.routes());
// userController.use("/feed", feedController.routes())
apiController.use(feedController.routes());
apiController.use("/user", userController.routes());
apiController.use("/categories", categoriesController.routes());
apiController.use("/publications", publicationsController.routes());

export default apiController;
