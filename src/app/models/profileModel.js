const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;


const profileSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true,
    //     enum: ["Mr", "Mrs", "Miss"]
    // },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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

module.exports = mongoose.model('profile', profileSchema)

