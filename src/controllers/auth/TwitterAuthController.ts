import * as passport from "passport";
import * as Router from "koa-router";
import { Context } from "koa";

const twitterRouter = new Router();

twitterRouter.get("/", passport.authenticate("twitter"));
// twitterRouter.get("/callback", async (ctx, next) => {
//     // await passport.authenticate("twitter", ({
//     //     // successRedirect: "http://localhost:3001/feed",
//     //     failureRedirect: "http://localhost:3001"
//     // }), (err, user, obj2, obj3) => {
//     //     console.log('err', err)
//     //     console.log('USER', user)
//     //     // console.log('obj2', obj2)
//     //     // console.log('obj3', obj3)
//     //     ctx.cookies.set('accessToken', user.accessToken);
//     //     ctx.redirect('http://localhost:3001/feed');
//     //     // console.log(ctx.)
//     // });
// });

twitterRouter.get("/callback", passport.authenticate("twitter", {
    successRedirect: "http://localhost:3001/feed",
    failureRedirect: "http://localhost:3001/",
}))

export default twitterRouter;
