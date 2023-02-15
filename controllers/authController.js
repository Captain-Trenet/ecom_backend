const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create and sendtoken
const sendToken = (user, statusCode, res) => {
  // 1.] create token
  const token = createToken(user._id);

  // 2.] send token
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      profilePic,
      role,
      active,
    } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
      profilePic,
      active,
    });
    // call sendtoken
    sendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1.] check if there is email and password
    if (!email || !password) {
      return next(new Error("Please prove email and password"));
    }

    // 2.] check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(new Error("Incorrect email or password"));
    }

    // 3.] send token
    sendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};

exports.protectRoute = async (req, res, next) => {
  try {
    // 1.] check if there is a token
    let token = "";
    const { authorization } = req.headers;
    console.log(authorization);
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }

    // 2.] error message if no token
    if (!token) {
      return next(new Error("Please login to get access"));
    }

    // 3.] if token exists verify jwt
    const decodedJwt = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // 4.] check if user exists
    const user = await User.findById(decodedJwt.id);
    if (!user) {
      return next(new Error("user no longer exist"));
    }

    // 5.] check if user has changed the password after the token has issued
    if (user.checkPassAfterTokenIssued(decodedJwt.iat)) {
      return next(
        new Error("User recently changed password. please login again..!")
      );
    }

    // 6.] grant access
    req.user = user;
    next();
  } catch (err) {}
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("Access to route is denied..!"));
    }
    next();
  };
};
