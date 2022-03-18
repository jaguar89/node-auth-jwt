const User = require("../models/user");
const jwt = require("jsonwebtoken");

//handle errors
function handleErrors(err) {
  // console.log(err);
  const errors = { email: "", password: "" };
  if (err.message === "user not found.") {
    errors.email = "user not found."; 
  }
  if (err.message === "invalid password.") {
    errors.password = "invalid password."; 
  }
  if (err.message === "umatched passwords.") {
    errors.password = "unmatched passwords."; 
  }
  if (err.code === 11000) {
    errors.email = "that email is already registered.";
    return errors;
  }

  if (err.errors) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

//render signup page
const signup_get = (req, res) => {
  res.render("signup");
};

//sign up new user
const signup_post = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirm_password) {
      throw Error("umatched passwords.");
    }
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

//render login page
const login_get = (req, res) => {
  res.render("login");
};

//log in user
const login_post = async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password);
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

//handle logout
const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
  res.redirect("/");
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout,
};
