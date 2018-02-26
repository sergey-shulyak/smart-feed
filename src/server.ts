import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as session from "koa-session";
import * as passport from "koa-passport";

import router from "./routes/rootRouter";
import configurePassport from "./auth/passportConfig";

const app = new Koa();

const logging = async (ctx: Koa.Context, next: () => void) => {
  console.log(`${ctx.method} ${ctx.url} ${ctx.status}`);
  await next();
};

app.use(logging);

app.keys = ["super-secret"];
app.use(session({}, app));

app.use(bodyParser());

configurePassport();
app.use(passport.initialize());

app.use(router.routes());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
