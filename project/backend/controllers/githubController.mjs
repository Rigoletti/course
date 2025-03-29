import passport from "passport";
import jwt from "jsonwebtoken";

export const githubAuth = passport.authenticate("github", { 
  scope: ["user:email"],
  session: false 
});

export const githubCallback = (req, res, next) => {
  passport.authenticate("github", { 
    failureRedirect: "/login",
    session: false 
  }, async (err, user, info) => {
    try {
      if (err) {
        console.error("GitHub Auth Error:", err);
        return res.redirect(`http://localhost:5173/login?error=auth_failed`);
      }

      if (!user) {
        console.error("GitHub User Not Found:", info);
        return res.redirect(`http://localhost:5173/login?error=user_not_found`);
      }

      const token = jwt.sign(
        { 
          userId: user._id, 
          role: user.role,
          needsCompletion: user.needsCompletion 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // For new users (needsCompletion = true)
      if (user.needsCompletion) {
        return res.redirect(`http://localhost:5173/complete-profile?token=${token}`);
      }

      // For existing users
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
      });
      
      // Add token to URL as fallback
      return res.redirect(`http://localhost:5173/profile?token=${token}`);
      
    } catch (error) {
      console.error("GitHub Callback Error:", error);
      return res.redirect(`http://localhost:5173/login?error=server_error`);
    }
  })(req, res, next);
};