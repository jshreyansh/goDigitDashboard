const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const mentorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true
    },
    batch: {
        type: ObjectId,
        ref: "Batch"
    },
    joiningDate: {
        type: Date
    },
    relevantTechStackExperience:
        {
            type: [{type: String}],
            default: []
        },
    missingTechStackExperience:
        {
            type: [{type: String}],
            default: []
        },
    totalTechExperience: Number,
    remarks: String,
    studentRating: Number,
    feedback:   {
        type: [{type: String}],
        default: []
    },
    mobile: {
        type: String,
        required: [true, 'User phone number required'],
        unique: [true, 'User with this phone number already exists'],
        validate: {
            validator: function(str) {
                return /^\d{10}$/.test(str);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    otp: { type: String },
    otpValidTill: { type: Number },
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
    whatsAppConsent: {type: Boolean, default: false},
    isNewUser: {type: Boolean, default: true},
}, { timestamps: true })


module.exports = mongoose.model('Mentor', mentorSchema)
