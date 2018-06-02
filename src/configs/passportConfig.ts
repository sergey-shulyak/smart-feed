import * as passport from "koa-passport";
import {Profile} from "passport";
import {Strategy as TwitterStrategy} from "passport-twitter";
import {Strategy as MediumStrategy} from "passport-medium"; // tslint:disable-line

import * as db from '../models';
import * as userService from "../services/userService";

const TWITTER_CONFIG = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
};

const MEDIUM_CONFIG = {
    clientID: process.env.MEDIUM_CLIENT_ID,
    clientSecret: process.env.MEDIUM_CLIENT_SECRET,
    callbackURL: process.env.MEDIUM_CALLBACK_URL
};

function configurePassport() {
    passport.use(
        new TwitterStrategy(TWITTER_CONFIG, (token, tokenSecret, profile, done) => {
            if (!profile) {
                return done(new Error("Unable to authorize with Twitter"));
            }

            console.log('profile', profile);

            //TODO запросить email

            db.User.findOne({where: {fullName: profile.name}})
            .then((user) => {
                db.SocialIntegration.findOrCreate({where: {

                }})
            })
            db.SocialIntegration

            console.log("Authenticated as Twitter user", profile.displayName);
            console.log("Tokens", token, tokenSecret);

            return done(null, profile);
        })
    );

    passport.use(
        new MediumStrategy(
            MEDIUM_CONFIG,
            (
                accessToken: string,
                refreshToken: string,
                status: "123",
                profile: Profile,
                done: (error: any, user?: any) => void
            ) => {
                if (!profile) {
                    return done(new Error("Unable to authorize with Medium"));
                }

                console.log("Authenticated as Medium user", profile.displayName);
                console.log("Tokens", accessToken);

                return done(null, profile);
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default configurePassport;
