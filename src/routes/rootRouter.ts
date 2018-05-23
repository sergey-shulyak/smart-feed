import * as Router from "koa-router";

import twitterRouter from "./auth/twitterAuthRouter";
import authRouter from "./auth";

const rootRouter = new Router();

rootRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods());

export default rootRouter;
