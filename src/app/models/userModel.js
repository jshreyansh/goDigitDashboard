const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true
    },
    batch: {
        type: ObjectId,
        ref: "Batch"
    },
    gender: {
        type: String,
        trim: true
    },
    email: String,
    mobile: {
        type: String,
        required: [true, 'User phone number required'],
        unique: [true, 'User with this phone number already exists'],
        validate: {
            validator: function(str) {
                let isCorrect = str.length==10?true:false
                
                return /\d{10}/.test(str)&&isCorrect;
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    otp: { type: String },
    otpValidTill: { type: Number },
    dateOfBirth: Date,
    permanentAddress: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: Number,
        country: { type: String, default: 'India' }
    },
    profilePicture: String,
    isDeleted: { type: Boolean, default: false },
    panCard: {
        type: String,
        validate: {
            validator: function (str) {
                var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
                return regpan.test(str)
            },
            message: props => `${props.value} is not valid pan card number!`
        }
    },
    isISASigned: {type: Boolean, default: false},
    whatsAppConsent: {type: Boolean, default: false},
    isNewUser: {type: Boolean, default: true},
    generateOtpFlag: Boolean,
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)
