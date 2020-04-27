const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt");

const User = require("../models/User");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  // find user based on email
  const { email, password } = req.body;
  // you either get an error or the user
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User with that email does not exist. Please Signup",
      });
    }
    // 4 - If user is found make sure the email and password match
    //  5- Create authenticate method in the user model

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password dont match" });
    }

    // 1 - Generate signed token with the id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // 2 Persist the token as 't' in cookie with expiry data
    res.cookie("t", token, { expire: new Date() + 9999 });
    // 3 - Return with the user and token to the frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};
