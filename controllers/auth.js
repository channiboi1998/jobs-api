const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes'); 

/**
 * Method for registering a new user on `User` atlas Schema.
 */
const register = async (request, response) => {

    const user = await User.create(request.body);
    const token = user.createJWT();

    let data = {
        userId: user._id,
        username: user.username,
        token: token
    }

    response.status(StatusCodes.CREATED).json(data); 

}

/**
 * Login method for users.
 */
const login = async (request, response) => {

    const { username, password } = request.body;

    if (!username || !password) {
        //`username` or `password` is not filled
        throw new BadRequestError('Username and Password are required!');
    }

    const user = await User.findOne({ username: username });

    if (!user) {
        //There are no user found with the provided username
        throw new BadRequestError('Invalid Crendetials!');
    }

    const match = await user.comparePassword(password);
    
    if (match === false) {
        //The database password does not match the user's provided password.
        throw new UnauthenticatedError('Username & Password does not match');
    }

    const token = user.createJWT();
    
    let data = {
        userId: user._id,
        username: user.username,
        token: token
    }

    response.status(StatusCodes.ACCEPTED).json(data); 

}

module.exports = {
    login,
    register
}