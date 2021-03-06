import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import * as base64 from "base-64";
import { omit } from "lodash";

import * as userService from "../services/UserService";
import { verify } from "jsonwebtoken";
import {authorizeUser} from "../services/UserService";

const registrationController = new Router();

registrationController.post("/register", async (ctx, next) => {
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

    ctx.login(createdUser);

    ctx.status = HttpStatuses.CREATED;
    ctx.body = omit(createdUser.get(), "passwordHash", "salt");
});

registrationController.post("/login", async (ctx, next) => {
    const { credentials } = ctx.request.body;
    const [email, password] = base64.decode(credentials).split(":");

    let user;

    try {
        user = await userService.findByEmailAndPassword(email, password);
    } catch (error) {
        ctx.throw(error)
    }

    const accessToken = await authorizeUser(user);

    ctx.login(user.get());
    ctx.cookies.set('accessToken', accessToken);

    ctx.body = omit(user.get(), "passwordHash");
});

registrationController.post("/relogin", async (ctx, next) => {
    const { headers } = ctx.request;

    const accessToken = headers['x-access-token'] || ctx.cookies.get('accessToken');

    console.log('AUTH', ctx.isAuthenticated())
    console.log('USER', ctx.state.user);
    // console.log()

    let user;

    if (ctx.isAuthenticated()) {
        user = await userService.findById(ctx.state.user.id);
        ctx.body = omit(user.get(), "passwordHash", "salt");
    }

    // if (!accessToken || !ctx.isAuthenticated()) {
        // ctx.throw(HttpStatuses.UNAUTHORIZED);
    // }

    // const user = await userService.findByAccessToken(accessToken);
    // let isTokenValid = accessToken === user.accessToken;

    // try {
        // isTokenValid = Boolean(await verify(accessToken, process.env.JWT_PASSPHRASE));
    // } catch (error) {

    //     ctx.throw(HttpStatuses.UNAUTHORIZED);
    // }

    // if (!accessToken || !isTokenValid || user && user.accessToken !== accessToken) {
    //     ctx.throw(HttpStatuses.UNAUTHORIZED);
    // }


});

registrationController.get("/logout", async (ctx, next) => {
    ctx.cookies.set('accessToken', '')
    ctx.logout();
    ctx.redirect('http://localhost:3001');
});

export default registrationController;
