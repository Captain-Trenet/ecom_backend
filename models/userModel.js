const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please provide your firstname"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "please provide your lastname"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "please provie a password"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide a confirm password"],
      minlength: 8,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "password does not match ",
      },
    },
    profilePic: {
      type: String,
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

// document middleware
// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// methods
// 1.] check password match
userSchema.methods.checkPassword = async function (password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
};

// 2.] check if user has changed password after the token has issued
userSchema.methods.checkPassAfterTokenIssued = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const convert = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < convert;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
