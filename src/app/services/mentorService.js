const mentorModel = require('../models/mentorModel')
const perPage = 10;
const acceptedFileType = ['text/csv', 'application/vnd.ms-excel'];
const csv = require('csvtojson')
const async = require('async')

module.exports = {
    createMentor: (body, params, query) => {
        return new Promise(async (resolve, reject) => {

            // const forDeletedNumber = await find

            let mentorArray = body.mentorData
            let mentormobileArray = []
            for (let i = 0; i < mentorArray.length; i++) {
                let mobileNum = mentorArray[i]
                mentormobileArray.push(mobileNum.mobile)
            }

            if (typeof body.fullName === "object") {
                let nameArray = body.fullName
                let mobileArray = body.mobile;
                let newMentorArray = [];

                for (let i = 0; i < nameArray.length; i++) {
                    if (mentormobileArray.indexOf(mobileArray[i]) == -1) {
                        let mentorObj = {
                            fullName: nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1),
                            mobile: mobileArray[i],
                            // batch: body.batch
                        }
                        newMentorArray.push(mentorObj)
                    } else {
                        let findMentor = await mentorModel.findOne({ mobile: mobileArray[i] })
                        if (!findMentor.isDeleted) {
                           return reject({ "status": false, "code": 500, "msg": "duplicate key already existes" })
                        }
                        let updatedMentor = await mentorModel.findOneAndUpdate({ mobile: mobileArray[i] }, { $set: { isDeleted: false, fullName: nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1) } }, { new: true })
                        if (!updatedMentor) {
                          return  reject({ "status": false, "code": 500, "msg": "duplicate key mentioned cant be updated" })
                        }
                        else {
                            console.log("updated deleted mentors when put in bulk")

                        }
                    }

                }
                mentorModel.insertMany(newMentorArray).then(function (saved) {
                  return  resolve({ "status": true, "code": 200, "msg": saved })
                }).catch(function (error) {
                   return reject({ "status": false, "code": 500, "msg": error })
                });
            } else {
                if (mentormobileArray.indexOf(body.mobile) == -1) {
                    let mentor = new mentorModel({
                        fullName: body.fullName.charAt(0).toUpperCase() + body.fullName.slice(1),
                        mobile: body.mobile,
                    })

                    mentor.save((err, saved) => {
                        if (err) {
                          return  reject({ "status": false, "code": 500, "msg": err })
                        } else {
                          return  resolve({ "status": true, "code": 200, "msg": saved })
                        }
                    })
                } else {
                    let findMentor = await mentorModel.findOne({ mobile: body.mobile })
                    if (!findMentor.isDeleted) {
                       return reject({ "status": false, "code": 500, "msg": "duplicate key already existes" })
                    }


                    let updatedMentor = await mentorModel.findOneAndUpdate({ mobile: body.mobile }, { $set: { isDeleted: false, fullName: body.fullName.charAt(0).toUpperCase() + body.fullName.slice(1)} }, { new: true })
                    if (!updatedMentor) {
                      return  reject({ "status": false, "code": 500, "msg": "duplicate key mentioned cant be restored" })
                    } else {
                        console.log("updated deleted mentor")
                       return resolve({ "status": true, "code": 200, "msg": "updated deleted mentor" })

                    }
                }
            }
        });
    },

    deleteMentor: (body, params, query, res) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.mentorId
            let mentorData = await mentorModel.findOne({ _id: requestedId })

            if (!mentorData) {
                reject({ "status": false, "code": 500, "msg": "mentor does not exist" })
            }
            mentorData.isDeleted = true
            mentorData.save((err, saved) => {
                if (err) {
                    reject({ "status": false, "code": 500, "msg": err })
                } else {
                    resolve({ "status": true, "code": 200, "msg": saved })
                }
            })

        });
    },

    updateMentor: (body, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.mentorId
            let mentorData = await mentorModel.findOne({ _id: requestedId })
            if (!mentorData) {
                reject({ "status": false, "code": 500, "msg": "mentor does not exist" })
            }
            mentorData.fullName = body.fullName.charAt(0).toUpperCase() + body.fullName.slice(1)
            mentorData.mobile = body.mobile

            mentorData.save((err, saved) => {
                if (err) {
                    reject({ "status": false, "code": 500, "msg": err })
                } else {
                    resolve({ "status": true, "code": 200, "msg": saved })
                }
            })

        });
    },

    mentorList: async (body, params, query) => {
        return new Promise(async (resolve, reject) => {
            let page = query.page || 1
            let count = 0
            let totalPages = 0

            let result = await mentorModel.find({ isDeleted: false }).populate("batch").skip((perPage * page) - perPage).limit(perPage).sort({ fullName: 1 }).lean();

            count = await mentorModel.countDocuments({ isDeleted: false })
            if (count > 0) {
                totalPages = Math.ceil(count / perPage)
            }

            resolve({ result, totalPages })

        });
    },

}