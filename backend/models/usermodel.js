import { Schema, model } from "mongoose";


import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
// const crypto = require('crypto');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new Schema({
    name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "name cannot have more than 30 characters"],
  },
  email: {
    type: String,
    require: [true, "please enter your email"],
    unique: true,
    match: [emailRegex, "please enter a valid email address"],

  },
  enrolledcourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  password: {
    type: String,
    required: [true, "pleasse enter strong password"],
    minLength: [5, "your password should we greater than or equal to 5"],
  },

  profile: {
    type: String,
  },

  role: {
    type: String,
    enum:['user','admin',"lawyer"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getjwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.comparepassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.getresetpasswordToken = function () {
  const resettoken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
  return resettoken;
};
export default model("User", userSchema);
