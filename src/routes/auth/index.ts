import * as passport from "passport";
import * as Router from "koa-router";

import twitterRouter from "./twitterAuthRouter";
import mediumRouter from "./mediumAuthRouter";

const authRouter = new Router();

authRouter.use(
  "/twitter",
  twitterRouter.routes(),
  twitterRouter.allowedMethods()
);

authRouter.use("/medium", mediumRouter.routes(), mediumRouter.allowedMethods());

export default authRouter;
