import { Context } from "koa";
import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import { verify } from "jsonwebtoken";

import { authorizeUser, findByAccessToken } from "../services/userService";

const authMiddleware = (async (ctx: Context, next: () => {}) => {
  const {body, headers} = ctx.request;

  const accessToken = body.accessToken || headers['x-access-token'] || ctx.cookies.get('accessToken');
  const user = await findByAccessToken(accessToken);

  try {
    const decodedUserData = await verify(accessToken, process.env.JWT_PASSPHRASE);
  } catch (error) {
    ctx.redirect('/login');
  }

  if (!accessToken || user.accessToken !== accessToken) {
      ctx.redirect('/login')
  }

  await next();
});

const apiRouter = new Router();

apiRouter.use(authMiddleware);

apiRouter.get("/secured", async (ctx, next) => {
  ctx.body = ctx.request.body;
});

export default apiRouter;
