const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const {validator} = require('../../utils')


const userSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true,
    //     enum: ["Mr", "Mrs", "Miss"]
    // },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.validateEmail,
            message: 'Please enter a valid email',
            isAsync: false
        }
    },
    
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 15,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    urlCode: {
        type:String,
        unique:true,
        lowercase:true,
        trim :true},
    // address: {
    //     street: String,
    //     city: String,
    //     pincode: String
    // }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)

