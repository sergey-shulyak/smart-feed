import * as env from "dotenv";

env.load();

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as session from "koa-session";
import * as passport from "koa-passport";

import * as db from "./models";
import router from "./routes/rootRouter";
import configurePassport from "./configs/passportConfig";
import Category from "./models/Category";
import Publication from "./models/Publication";

db.sequelize.authenticate()
    .then(() => {
        console.error('Connected to the database');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

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
