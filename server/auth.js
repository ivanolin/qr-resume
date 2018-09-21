const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Get a new token with the requested booth ID
 * @param {String} id 
 */
exports.signNewTokenWithId = (id) => {
    const token = jwt.sign({
        _id: id,
    }, '1', { expiresIn: '1y' });

    return token;
}

/**
 * Check if a given two passwords match
 * @param {String} password 
 * @param {String} hashedPassword 
 */
exports.checkAuth = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

/**
 * Get the booth id out of the request object
 * @param {Object} ctx 
 */
exports.getBoothIdFromRequest = (ctx) => {
    // Pull Authorization header from request
    const authHeader = ctx.request.get('Authorization') || '';

     // Decode JWT
     try {
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), '1');

        return decoded._id;
    } catch(err) {
        return null;
    }
}

/**
 * Generate a new hashed password from the provided pain text password
 * @param {String} password 
 */
exports.generateHashedPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}