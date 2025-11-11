const User = require("../models/user");
const Newsletter = require("../models/newsletter");
const passport = require("passport");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Render login page
exports.renderLogin = (req, res) => {
  res.render("login/login.ejs");
};

// Register user
exports.register = async (req, res, next) => {
  const { email, password, confirm } = req.body;
  if (password !== confirm) {
    req.flash("error", "Passwords do not match");
    return res.redirect("/login");
  }
  try {
    let existingEmail = await Newsletter.findOne({ email });
    if (!existingEmail) {
      const newsletter = new Newsletter({ email });
      await newsletter.save();
      req.flash("success", "You have been subscribed to our newsletter!");
    } else {
      req.flash("info", "You are already subscribed to our newsletter.");
    }

    const user = new User({ email });
    await User.register(user, password);
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to VH Events! Registration successful.");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/login");
  }
};

// Login user
exports.login = [
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to VH Events!");
    res.redirect("/");
  }
];

// Logout user
exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out!");
    res.redirect("/");
  });
};



exports.renderForgotPasswordemail = (req, res) => {
  res.render("login/forgot_passwordemail.ejs");
}



exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  // console.log("Forgot password requested for:", email);

  try {
    const user = await User.findOne({ email });
    // console.log("user:", user);

    if (!user) {
      req.flash("error", "No account with that email found.");
      return res.redirect("/forgot-password");
    }

    // 1️⃣ Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash the token before saving (security best practice)
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 3️⃣ Save token + expiry in user record
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // expires in 15 mins
    await user.save();

    // 4️⃣ Create reset URL
    const resetURL = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

    // 5️⃣ Send email with nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.VH_EVENTS_USER, // your Gmail
        pass: process.env.VH_EVENTS_PASS, // your app password
      },
    });

    const mailOptions = {
      to: user.email,
      from: `"VH Events" <${process.env.VH_EVENTS_USER}>`,
      subject: "Password Reset Request",
      html: `
        <h2>Hello ${user.name || "User"},</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetURL}" target="_blank">${resetURL}</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Password reset email sent to:", user.email);

    req.flash("success", "Password reset instructions have been sent to your email.");
    res.redirect("/login");
  } catch (error) {
    console.error("Error in handleForgotPassword:", error);
    req.flash("error", "Something went wrong. Please try again later.");
    res.redirect("/forgot-password");
  }
};



// Render the Reset Password Page
exports.renderResetPasswordPage = async (req, res) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Password reset link is invalid or expired.");
      return res.redirect("/forgot-password");
    }

    res.render("login/reset-password.ejs", { token });
  } catch (err) {
    console.error("Error rendering reset page:", err);
    req.flash("error", "Something went wrong. Try again.");
    res.redirect("/forgot-password");
  }
};

// Handle the actual password reset
exports.handleResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Password reset link is invalid or expired.");
      return res.redirect("/forgot-password");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("back");
    }

    // ✅ Use passport-local-mongoose built-in method
    await user.setPassword(password);

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    req.flash("success", "Your password has been reset successfully! Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.error("Error in handleResetPassword:", err);
    req.flash("error", "Something went wrong. Please try again later.");
    res.redirect("/forgot-password");
  }
};
