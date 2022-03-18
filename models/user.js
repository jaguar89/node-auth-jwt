const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please, insert a valid email."],
  },
  password: {
    type: String,
    required: [true, "please, insert a password."],
    minlength: [6, "password must be at least 6 charachters."],
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    let compared = await bcrypt.compare(password, user.password);
    if (compared) {
      return user;
    }
    throw Error("invalid password.");
  }
  throw Error("user not found.");
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
