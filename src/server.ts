import * as env from "dotenv";

env.load();

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as session from "koa-session";
import * as passport from "koa-passport";

import * as db from "./models";
import router from "./routes";
import configurePassport from "./configs/passportConfig";
import * as HttpStatuses from "http-status-codes";
import { verify } from "jsonwebtoken";

// Connecting to database
db.sequelize.authenticate()
    .then(() => {
        console.error('Connected to the database');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const app = new Koa();

// Request logger
const logging = async (ctx: Koa.Context, next: () => void) => {
    console.log(`${ctx.method} ${ctx.url} ${ctx.status}`);
    await next();
};

// Error handling
app.use(async (ctx, next) => {
    try {
       await next();
    } catch (err) {
       ctx.status = err.status || 500;
       ctx.body = err.message;
    }
 });

// Logging
app.use(logging);

// Session
app.keys = ["super-secret"];
app.use(session({}, app));

// Body parser
app.use(bodyParser());

// Auth
configurePassport();
app.use(passport.initialize());

// Router
app.use(router.routes());

// Launch
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
