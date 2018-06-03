import * as passport from "passport";
import * as Router from "koa-router";

const twitterRouter = new Router();

twitterRouter.get("/", passport.authenticate("twitter"));
twitterRouter.get(
  "/callback",
  passport.authenticate("twitter", {
    successRedirect: "/profile",
    failureRedirect: "/error"
  })
);

export default twitterRouter;
