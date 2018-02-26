import * as passport from "koa-passport";
import { Strategy as TwitterStrategy } from "passport-twitter";

import apiConfig from "../../apiConfig";

function configurePassport() {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: apiConfig.twitter.consumerKey,
        consumerSecret: apiConfig.twitter.consumerSecret,
        callbackURL: apiConfig.twitter.callbackURL
      },
      (token, tokenSecret, profile, done) => {
        if (!profile) {
          done(new Error("Unable to authorize"));
        }

        console.log("Authenticated as user", profile.displayName);
        console.log("Tokens", token, tokenSecret);

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
