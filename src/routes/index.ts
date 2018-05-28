import * as Router from "koa-router";

import twitterRouter from "./auth/twitterAuthRouter";
import authRouter from "./auth";
import registrationRouter from "./registrationRouter";

const indexRouter = new Router();

indexRouter.use(registrationRouter.routes());
indexRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods());

export default indexRouter;
