import * as passport from "passport";
import * as Router from "koa-router";
import { Context } from "koa";

const twitterRouter = new Router();

twitterRouter.get("/", passport.authenticate("twitter"));
twitterRouter.get("/callback", async (ctx) => {
    // console.log("TWITTER CTX", ctx)
    // console.log("TWITTER req", ctx.req.user)
    // console.log("TWITTER res", ctx.res)
    passport.authenticate("twitter", ({
        successRedirect: "http://localhost:3001/feed",
        failureRedirect: "http://localhost:3001"
    }));
});

export default twitterRouter;
