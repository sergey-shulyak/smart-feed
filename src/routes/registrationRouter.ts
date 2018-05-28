import * as passport from "passport";
import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import * as base64 from "base-64";

import * as registrationService from "../services/registrationService";

const registrationRouter = new Router();

registrationRouter.post("/register", async (ctx, next) => {
    const userData = ctx.request.body;
    let createdUser;

    try {
        createdUser = await registrationService.createUser(userData);
    } catch (error) {
        ctx.throw(error);
    }

    ctx.status = HttpStatuses.CREATED;
    ctx.body = createdUser;
});

registrationRouter.post("/signin", async (ctx, next) => {
    const {credentials} = ctx.request.body;
    const [email, password] = base64.decode(credentials).split(":");

    let user;

    try {
        user = await registrationService.findByEmailAndPassword(email, password);
    } catch (error) {
        ctx.throw(error)
    }

    ctx.status = HttpStatuses.OK;
    ctx.body = user;
});

export default registrationRouter;
