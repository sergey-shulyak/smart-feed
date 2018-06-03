import { Context } from "koa";
import * as Router from "koa-router";
import * as HttpStatuses from "http-status-codes";
import { verify } from "jsonwebtoken";

import { authorizeUser, findByAccessToken } from "../services/userService";

const authMiddleware = (async (ctx: Context, next: () => {}) => {
  const { body, headers } = ctx.request;

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

const apiRouter = new Router();

apiRouter.use(authMiddleware);

apiRouter.get("/secured", async (ctx, next) => {
  ctx.body = ctx.request.body;
});

apiRouter.get("/user", async (ctx, next) => {
  const user = await findByAccessToken(ctx.cookies.get("accessToken"));
  ctx.body = user.get();
});

export default apiRouter;
