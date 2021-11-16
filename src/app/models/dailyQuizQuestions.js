const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const dailyQuizQuestionSchema = new mongoose.Schema({
    topic: {
        type: [{
            type: String
        }],
        default: []
    },
    itemName:String,
    itemPrice:Number,

    // day: String, //e.g W5D3 for week5 day 3
    itemDetails : String,


    isDeleted: { type: Boolean, default: false },
    imageUrl: String //incase we use an image for a question or a piece of code
}, { timestamps: true })


module.exports = mongoose.model('DailyQuizQuestion', dailyQuizQuestionSchema)
