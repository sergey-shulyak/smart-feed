import * as passport from "koa-passport";
import { Profile } from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as MediumStrategy } from "passport-medium"; // tslint:disable-line

import * as db from '../models';
import * as userService from "../services/UserService";
import { generatePassword } from "../utils/encryptionUtils";

import { IUser } from '../models/User';

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

            db.User.findOrCreate({
                where: { fullName: profile.displayName },
                defaults: {
                    fullName: profile.displayName,
                    email: profile.emails ? profile.emails[0] : 'empty',
                    password: generatePassword()
                }
            }).spread((user: any, created: boolean) => {
                    userService.authorizeUser(user).then((tkn: string) => console.log('Created token for user: ', tkn));

                    db.SocialIntegration.findOrCreate({
                        where: {
                            externalUserId: profile.id
                        },
                        defaults: {
                            type: profile.provider,
                            username: profile.username,
                            externalUserId: profile.id,
                            accessToken: token,
                            accessTokenSecret: tokenSecret,
                            avatarUrl: profile.photos ? profile.photos[0].value : null,
                            userId: user.id
                        }
                    }).then((integration: any) => {
                        console.log('Integration created', integration);
                    });
                });

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
