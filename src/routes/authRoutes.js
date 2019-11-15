//This is the route folder to veify username does not exist at sign up
//Also notifies of errors
//if we use an api we must require it on the file
//secret key must be consistent in all uses

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();


//sign up route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = new User({ email, password });
        await user.save();

    const token = jwt.sign({ userId: user._id }, 'Secret key');
    res.send({ token });
    }
    catch (err){
        return res.status(422).send(err.message);
    }
});


//sign in route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password!' });
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(422).send({ error: 'email not found' });
    }

try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'Secret key')
    res.send({ token });
}
catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' });
    } 
});


module.exports = router;