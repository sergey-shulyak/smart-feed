import * as Router from "koa-router";

import twitterRouter from "./auth/twitterAuthRouter";
import authRouter from "./auth";
import apiRouter from "./apiRouter";
import registrationRouter from "./registrationRouter";

const indexRouter = new Router();

indexRouter.use(registrationRouter.routes());
indexRouter.use(apiRouter.routes());
indexRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods());

export default indexRouter;
