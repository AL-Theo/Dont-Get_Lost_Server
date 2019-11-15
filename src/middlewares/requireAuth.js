//Json web token middleware 
//veifies user

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');


//entire function to validate user
module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).send({ error: 'You must be logged in!'});
    }

    //function to validate user token. Empty string is where the token will go
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'Secret key', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in' });
        }

        const { userId } = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
};