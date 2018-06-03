import * as passport from "passport";
import * as Router from "koa-router";

import twitterRouter from "./TwitterAuthController";
import mediumRouter from "./MediumAuthController";

const authRouter = new Router();

authRouter.use(
  "/twitter",
  twitterRouter.routes(),
  twitterRouter.allowedMethods()
);

authRouter.use("/medium", mediumRouter.routes(), mediumRouter.allowedMethods());

export default authRouter;
