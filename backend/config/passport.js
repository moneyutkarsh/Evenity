const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../model/userModel");
require("dotenv").config();

/* --------------------------------------------------------
   🔹 GOOGLE STRATEGY (NO AUTO-CREATION)
---------------------------------------------------------*/
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // ⚠️ IMPORTANT: DO NOT CREATE USER HERE.
        // Only return the Google profile and let authRoutes.js handle signup/login.
        const googleUser = {
          name: profile.displayName,
          email,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || "",
        };

        return done(null, googleUser);
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

/* --------------------------------------------------------
   🔹 HELPER: Find or Create User for GitHub and LinkedIn
---------------------------------------------------------*/
async function findOrCreateUser(providerField, profile) {
  try {
    let user = await User.findOne({ [providerField]: profile.id });

    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username || "New User",
        email:
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : undefined,
        avatar:
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : "",
        [providerField]: profile.id,
      });
    }

    return user;
  } catch (error) {
    console.error("OAuth user creation error:", error);
    throw error;
  }
}

/* --------------------------------------------------------
   🔹 GITHUB STRATEGY
---------------------------------------------------------*/
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser("githubId", profile);
        return done(null, user);
      } catch (err) {
        console.error("GitHub OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

/* --------------------------------------------------------
   🔹 LINKEDIN STRATEGY
---------------------------------------------------------*/
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["openid", "profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        let user = await User.findOne({ linkedinId: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            linkedinId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("LinkedIn OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
