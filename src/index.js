//This is the React set up with mongoDB
//in express we ' REQUIRE ' NOT import - EX: const reqLib = require('reqLibName')
//order matters in express so build in the order we want the functions to flow
//index(main per convention) is where we run the express backend

require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

//association of models to run in application
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);


const mongoUri = 'mongodb+srv://admin:0987654321@cluster0-gh7lv.azure.mongodb.net/test?retryWrites=true&w=majority'


mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.connection.on('connected', () => {
    console.log('connected to mongo');
});
mongoose.connection.on('error', err => {
    console.error('Error connecting to the mongo fruit', err);
});


app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

const port = process.env.Port || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});