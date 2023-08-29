
const jwt = require('jsonwebtoken');
const config = require('../configuration/config'); // Replace with the path to your configuration file

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract the actual token part (remove "Bearer ")
        const tokenValue = token.replace('Bearer ', '');

        const user = jwt.verify(tokenValue, config.secretKey);
        req.user = user;
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Invalid token' });
    }
    next();
};
