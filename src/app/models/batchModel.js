const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    startDate: {
        type: String,
        validate: {
            validator: function (idate) {
                var today = new Date(),
                    idate = Date.parse(idate)

                    presentDate = Date.parse(today)
                return (presentDate - idate) < 0;
            },
            message: props => `${props.value} is not a future Date`
        }
    },
    leadsCount: {
        type: Number,
        default: 0
    },
    admissionOfferCount: {
        type: Number,
        default: 0
    },
    ISACount: {
        type: Number,
        default: 0
    },
    placedCount: {
        type: Number,
        default: 0
    },
    leadSource: { type: String, default: 'App' },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    topicsTaught: {
        type: [{day:String, topicName:String}]
    },
    topicsToBeTaught: {
        type: [{day:String, topicName:String}]
    }
}, { timestamps: true })


module.exports = mongoose.model('Batch', batchSchema,"batchs")
