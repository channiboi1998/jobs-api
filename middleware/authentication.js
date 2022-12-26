const JWT = require('jsonwebtoken');
const { UnauthenticatedError, BadRequestError } = require('../errors');

const authMiddleware = (request, response, next) => {
    
    const auth = request.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
        throw new BadRequestError('Invalid Token');
    }

    const token = auth.split(' ')[1];

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        request.user = { userId: payload.userId, username: payload.username };
        next();
    } catch(error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
    
}

module.exports = authMiddleware;