const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide your name"],
        minLength: 3,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true, "Please provide your name"],
        minLength: 3,
        maxLength: 50,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: [true, "This account already exists"],
    },
    password:{
        type: String,
        required: [true, "Please provide password"],
        minLength: [8, "Please enter minimum 8 characters"],
    },
    superAdmin:{
        type: Boolean,
        default: false,
    }
});

userSchema.pre('save', async function () {
    const randomBytes = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, randomBytes)
})

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        // next( new badRequestError("This account already exists"));
    }
    else {
        // next( new badRequestError(error.name));
    }
});

userSchema.methods.createJWT = function (){
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
};
userSchema.methods.matchPassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
};

module.exports = mongoose.model('User', userSchema);
