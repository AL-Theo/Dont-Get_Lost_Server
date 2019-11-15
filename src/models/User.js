//mogoose set up(Schema)
//how data will be stored

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,  //unique means username must be unique 
        require: true  //rquire means every user have to input an email
    },
    password: {
       type: String,
       required: true 
    }
});

//function always makes sure we salt and hash before we put in our database
userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
       if (err) {
           return next(err);
       } 

       bcrypt.hash(user.password, salt, (err, hash) => {
           if (err) {
               return next(err);
           }
           user.password = hash;
            next();
       });
    });
});


userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    
    //this function is using compare to compare pws and return if it is a match or not
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }

            if(!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
};


mongoose.model('User', userSchema);