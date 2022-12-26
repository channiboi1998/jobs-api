const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required!'],
    },
    username: {
        type: String,
        required: [true, 'Username field is required!'],
        unique: true,
        minLength: 6,
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password field is required!'],
        minLength: 6,
    }
});

/**
 * A Mongoose Middleware responsible for hashing the password via bcrypt on save.
 */
UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * A Mongoose method for creating a JWT after login/register of user.
 */
UserSchema.methods.createJWT = function() {
    return JWT.sign({ 
            userId: this._id, 
            username: 
            this.username 
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: process.env.JWT_LIFETIME
        }
    );
}

/**
 * A Mongoose method that compares inputPassword to the fetched user on the database.
 */
UserSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema); 