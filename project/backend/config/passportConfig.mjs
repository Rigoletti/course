import passport from "passport";
import GitHubStrategy from "passport-github2";
import User from "../models/User.mjs";
import bcrypt from "bcrypt";

const configurePassport = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            const displayName = profile.displayName || "Unknown User";
            const nameParts = displayName.split(" ");
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "unknown@example.com";
            const username = profile.username || email.split("@")[0];
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = new User({
              githubId: profile.id,
              username,
              email,
              firstName: nameParts[0] || "Unknown",
              lastName: nameParts[1] || "",
              password: hashedPassword,
            });
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          console.error("Ошибка при обработке профиля GitHub:", error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;