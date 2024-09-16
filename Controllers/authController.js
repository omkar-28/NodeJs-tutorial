const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/customError');
const util = require('util');

function setToken(name) {
    return jwt.sign({ userName: name }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = setToken(newUser.name);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = asyncErrorHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        const error = new CustomError("Please provide Email and Password!", 400);

        return next(error);
    }

    // check if user already exists with email and password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const error = new CustomError("User not found", 401);
        return next(error);
    }

    const isMatch = await user.comparePassword(password);

    if (!user || !isMatch) {
        const error = new CustomError("Invalid Email or Password!", 401);
        return next(error);
    };

    const token = setToken(user.name);
    res.status(200).json({
        status: 'success',
        token,
        message: 'Logged In Successfully!'
    });

});

exports.getAllusers = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });

});

exports.protect = asyncErrorHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new CustomError("You are not authorized to access this route!", 401);
        return next(error);
    }

    // Validate the token
    const decoded = jwt.verify(token, process.env.SECRET_STR);
    req.user = await User.find({ name: decoded.userName });

    if (!req.user) {
        const error = new CustomError("User not found!", 404);
        return next(error);
    }

    // if the user changed their password
    if (user.isPasswordChanged(decoded.iat)) {
        const error = new CustomError("The user has changed their password. Please try logging in again", 400);
        return next(error);
    };
    
    next();
});