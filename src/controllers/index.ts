import * as Router from "koa-router";

import authController from "./auth";
import registrationController from "./RegistrationController";
import apiController from "./api";

const indexRouter = new Router();

indexRouter.use(registrationController.routes());
indexRouter.use("/auth", authController.routes());
indexRouter.use("/api", apiController.routes());

export default indexRouter;
