const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// Define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select: false, // Exclude password from queries by default
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (value) {
                return this.password === value;
            },
            message: 'Passwords do not match.'
        }
    },
    passwordChangedAt: Date
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined; // Remove confirmPassword field from the database
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPwd) {
    return await bcrypt.compare(enteredPwd, this.password);
};

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

        return JWTTimestamp < passwordTimestamp;
    }

    return false;
};

// Create user model
const User = mongoose.model('User', userSchema);

module.exports = User;