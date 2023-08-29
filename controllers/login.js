
const loginDetails=require('../model/loginDetails');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../configuration/config');
function generateAccessToken(id){
    return jwt.sign({id},config.secretKey);
}
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await loginDetails.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials1' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials2' });
        }
        const isPremium1 = !!user.isPremium;
        const token=generateAccessToken(user.id);
        res.status(200).json({ message: 'Login successful', token, isPremium1 });
        

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
};

exports.getDetails = async (req, res, next) => {
    try {
        const details = await loginDetails.findAll();
        res.status(200).json({ userDetails: details });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'An error occurred while fetching user details.' });
    }
};

