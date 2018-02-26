import * as Router from "koa-router";

import twitterRouter from "./auth/twitterAuthRouter";

const rootRouter = new Router();

rootRouter.use(
  "/auth/twitter",
  twitterRouter.routes(),
  twitterRouter.allowedMethods()
);

export default rootRouter;
