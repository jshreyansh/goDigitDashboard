const mentorService = require('../services/mentorService');
const mentorModel = require('../models/mentorModel')

module.exports = {
    addMentor: async (req, res) => {
        res.render('mentor/add-mentor');
    },

    editMentor: async (req, res) => {
        try {
            const requestedId = req.params.mentorId
            const data = await mentorModel.findOne({ _id: requestedId }).lean()

            res.render('mentor/edit-mentor', {
                data: data,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },

    updateMentor: async (req, res) => {
        try {
            const data = await mentorService.updateMentor(req.body, req.params, req.query)

            if (data.status) {
                res.redirect('/mentor/manage-mentor')
            } else {
                data._id = req.params.mentorId
                res.render('mentor/edit-mentor', {
                    errorMsg: data.msg,
                    data: req.body
                })
            }

        } catch (error) {
            req.body._id = req.params.mentorId
            res.render('mentor/edit-mentor', {
                errorMsg: error.msg,
                data: req.body
            })
        }
    },

    manageMentor: async (req, res) => {
        try {
            const data = await mentorService.mentorList(req.body, req.params, req.query)
            res.render('mentor/manage-mentor', {
                data: data,
                currentPage: req.query.page || 1
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },

    createMentor: async (req, res) => {
        try {
            let mentorData = await mentorModel.find().lean()
            req.body.mentorData = mentorData
            const data = await mentorService.createMentor(req.body, req.params, req.query)

            if (data.status) {
                res.redirect('/mentor/manage-mentor')
            } else {
                res.render("mentor/add-mentor", {
                    errorMsg: data.msg,
                    data: req.body
                })
            }

        } catch (error) {
            res.render("mentor/add-mentor", {
                errorMsg: error.msg,
                data: req.body
            })
        }
    },

    deleteMentor: async (req, res) => {
        try {
            const data = await mentorService.deleteMentor(req.body, req.params, req.query)
            const dataMentors = await mentorService.mentorList(req.body, req.params, req.query)

            if (data.status) {
                res.render('mentor/manage-mentor', {
                    successMsg: "Successfully Deleted",
                    data: dataMentors,
                    currentPage: req.query.page || 1
                })

            } else {
                res.render('mentor/manage-mentor', {
                    errorMsg: data.msg
                })
            }

        } catch (error) {
            res.render('mentor/manage-mentor', {
                errorMsg: error.msg
            })
        }
    }
}