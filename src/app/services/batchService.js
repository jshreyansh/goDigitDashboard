const batchModel = require('../models/batchModel')
const perPage = 10;

module.exports = {
    createBatch: (body, params, query) => {
        return new Promise(async (resolve, reject) => {

            let topicsToBeTaught = []
            for (let i = 1; i <= 10; i++) {
                topicsToBeTaught.push({day: i, topicName: `topic ${i}` })
            }

            let batch = new batchModel({
                name: body.name.charAt(0).toUpperCase() + body.name.slice(1).toLowerCase(),
                startDate: body.startDate,
                topicsToBeTaught: topicsToBeTaught
            })

            batch.save((err, saved) => {
                if (err) {
                    return reject({ "status": false, "code": 500, "msg": err })
                } else {
                    return resolve({ "status": true, "code": 201, "msg": saved })
                }
            })

        })
    },


    batchList: async (body, params, query) => {
        return new Promise(async (resolve, reject) => {
            let result = await batchModel.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
            resolve(result)
        });
    },


    updateBatch: (body, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.batchId
            let batchData = await batchModel.findOne({ _id: requestedId })

            if (!batchData) {
                return reject({ "status": false, "code": 404, "msg": "batch does not exist" })
            }

            let today = new Date()
            let presentDate = Date.parse(today)
            let idate = Date.parse(batchData.startDate)

            if (presentDate - idate >= 0) {
                return reject({ "status": false, "code": 400, "msg": "Cohort has been started hence cohort can't be updated" })
            }

            batchData.name = body.name.charAt(0).toUpperCase() + body.name.slice(1).toLowerCase()
            batchData.startDate = body.startDate

            batchData.save((err, saved) => {
                if (err) {
                    return reject({ "status": false, "code": 500, "msg": err })
                } else {
                    return resolve({ "status": true, "code": 200, "msg": saved })
                }
            })

        });
    },

    manageBatch: async (body, params, query) => {
        return new Promise(async (resolve, reject) => {
            let page = query.page || 1
            let count = 0
            let totalPages = 0

            let result = await batchModel.find({ isDeleted: false }).skip((perPage * page) - perPage).limit(perPage).sort({ name: 1 }).lean();

            count = await batchModel.countDocuments({ isDeleted: false })
            if (count > 0) {
                totalPages = Math.ceil(count / perPage)
            }

            resolve({ result, totalPages })

        });
    },

    deleteBatch: (body, params, query, res) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.batchId
            let batchData = await batchModel.findOne({ _id: requestedId })
            if (!batchData) {
                return reject({ "status": false, "code": 404, "msg": "Cohort does not exist" })
            }

            let today = new Date()
            let presentDate = Date.parse(today)
            let idate = Date.parse(batchData.startDate)

            if (presentDate - idate >= 0) {
                return reject({ "status": false, "code": 400, "msg": "Cohort has been started hence cohort can't be deleted" })
            } else {

                batchData.isDeleted = true
                batchData.save((err, saved) => {
                    if (err) {
                        reject({ "status": false, "code": 500, "msg": err })
                    } else {
                        resolve({ "status": true, "code": 200, "msg": saved })
                    }
                })
            }

        });
    },

    moveTaughtTopic: (body, params, query, res) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.batchId

            let batchData = await batchModel.findOne({ _id: requestedId })

            const requetsTopic = batchData.topicsToBeTaught.find(x => x.topicName == params.topicName)

            const data = await batchModel.findOneAndUpdate({ _id: requestedId }, { $pull: { 'topicsToBeTaught': { '_id': requetsTopic._id } }, $push: { topicsTaught: requetsTopic } }, { new: true })

            resolve({ "status": true, "code": 200, "msg": data })
        });
    }
}