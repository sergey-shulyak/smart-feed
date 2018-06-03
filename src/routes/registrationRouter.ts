import * as passport from "passport";
import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import * as base64 from "base-64";
import { omit } from "lodash";

import * as userService from "../services/userService";
import { verify } from "jsonwebtoken";

const registrationRouter = new Router();

registrationRouter.post("/register", async (ctx, next) => {
    const userData = ctx.request.body;
    let createdUser;

    console.log('DATA', userData)

    try {
        createdUser = await userService.createUser(userData);
    } catch (error) {
        ctx.throw(error);
    }

    const accessToken = await userService.authorizeUser(createdUser);

    ctx.cookies.set('accessToken', accessToken);

    ctx.status = HttpStatuses.CREATED;
    ctx.body = omit(createdUser.get(), "passwordHash", "salt");
});

registrationRouter.post("/login", async (ctx, next) => {
    const { credentials } = ctx.request.body;
    const [email, password] = base64.decode(credentials).split(":");

    let user;

    try {
        user = await userService.findByEmailAndPassword(email, password);
    } catch (error) {
        ctx.throw(error)
    }

    const accessToken = await userService.authorizeUser(user);

    ctx.cookies.set('accessToken', accessToken);

    ctx.body = omit(user.get(), "passwordHash");
});

registrationRouter.post("/relogin", async (ctx, next) => {
    const { headers } = ctx.request;

    const accessToken = headers['x-access-token'] || ctx.cookies.get('accessToken');

    if (!accessToken) {
        ctx.throw(HttpStatuses.UNAUTHORIZED);
    }

    const user = await userService.findByAccessToken(accessToken);
    let isTokenValid;

    try {
        isTokenValid = Boolean(await verify(accessToken, process.env.JWT_PASSPHRASE));
    } catch (error) {
        ctx.throw(HttpStatuses.UNAUTHORIZED);
    }

    if (!accessToken || !isTokenValid || user && user.accessToken !== accessToken) {
        ctx.throw(HttpStatuses.UNAUTHORIZED);
    }

    ctx.body = omit(user.get(), "passwordHash", "salt");
});

registrationRouter.post("/logout", async (ctx, next) => {
    ctx.cookies.set('accessToken', '')
    ctx.redirect("/");
    // ctx.body = { message: "Logged out" }
});

export default registrationRouter;
