import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";

const secret = process.env.SESSION_SECRET || "change_me_in_env";

export function configureGooglePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        // TODO: upsert user in Mongo si tu veux
        return done(null, {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos,
        });
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}

export function requireLogin(req, res, next) {
  if (req.isAuthenticated?.()) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

export { passport, session, secret };
