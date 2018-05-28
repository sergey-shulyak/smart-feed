import * as passport from "passport";
import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import * as base64 from "base-64";

import * as userService from "../services/userService";

const registrationRouter = new Router();

registrationRouter.post("/register", async (ctx, next) => {
    const userData = ctx.request.body;
    let createdUser;

    try {
        createdUser = await userService.createUser(userData);
    } catch (error) {
        ctx.throw(error);
    }

    ctx.status = HttpStatuses.CREATED;
    ctx.body = createdUser;
});

registrationRouter.post("/login", async (ctx, next) => {
    const {credentials} = ctx.request.body;
    const [email, password] = base64.decode(credentials).split(":");

    let user;

    try {
        user = await userService.findByEmailAndPassword(email, password);
    } catch (error) {
        ctx.throw(error)
    }

    const accessToken = await userService.authorizeUser(user);

    ctx.cookies.set('accessToken', accessToken);
    ctx.body = user;
});

export default registrationRouter;
