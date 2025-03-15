import passport from "passport";
import jwt from "jsonwebtoken";

export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

export const githubCallback = (req, res, next) => {
  passport.authenticate("github", { failureRedirect: "/login" }, (err, user, info) => {
    if (err) {
      console.error("Ошибка при авторизации через GitHub:", err);
      return res.redirect("/login");
    }
    if (!user) {
      console.error("Пользователь не найден:", info);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Ошибка при входе:", err);
        return res.redirect("/login");
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.redirect(`http://localhost:5173/profile?token=${token}`);
    });
  })(req, res, next);
};