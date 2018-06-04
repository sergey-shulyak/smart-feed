import * as passport from "passport";
import * as Router from "koa-router";

const mediumRouter = new Router();

mediumRouter.get("/", passport.authenticate("medium"));
mediumRouter.get(
  "/callback",
  passport.authenticate("medium", {
    scope: ["basicProfile"],
    successRedirect: "/feed",
    failureRedirect: "/error"
  })
);

export default mediumRouter;
