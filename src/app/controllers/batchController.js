const batchService = require('../services/batchService');
const batchModel = require('../models/batchModel')

module.exports = {
    addBatch: async (req, res) => {
        res.render('batch/add-batch')
    },

    editBatch: async (req, res) => {
        try {
            const requestedId = req.params.batchId
            const data = await batchModel.findOne({ _id: requestedId }).lean()

            res.render('batch/edit-batch', {
                data: data,
            });
        } catch (error) {
            res.status(500).send(error);
        }
    },

    updateBatch: async (req, res) => {
        try {
            const data = await batchService.updateBatch(req.body, req.params, req.query)

            if (data.status) {
                res.redirect('/batch/manage-batch')
            } else {
                data._id = req.params.batchId
                res.render('batch/edit-batch', {
                    errorMsg: data.msg,
                    data: req.body
                })
            }

        } catch (error) {
            req.body._id = req.params.batchId
            const data = await batchModel.findOne({ _id: req.body._id}).lean()
            res.render('batch/edit-batch', {
                errorMsg: error.msg,
                data: data
            })
        }
    },

    manageBatch: async (req, res) => {
        try {
            const data = await batchService.manageBatch(req.body, req.params, req.query)
            res.render('batch/manage-batch',
            {
                data: data,
                currentPage: req.query.page || 1
            });
        } catch (error) {
            res.status(500).send(error);
        }
    },

    createBatch: async (req, res) => {
        try {
            let batchData = await batchModel.find().lean()
            req.body.batchData = batchData
            const data = await batchService.createBatch(req.body, req.params, req.query)

            if (data.status) {
                res.redirect('/batch/manage-batch')
            } else {
                res.render("batch/add-batch", {
                    errorMsg: data.msg,
                    data: req.body
                })
            }

        } catch (error) {
            res.render("batch/add-batch", {
                errorMsg: error.msg,
                data: req.body
            })
        }
    },

    batchList: async (req, res) => {
        try {
            let batchData = await batchModel.find().lean()
            req.body.batchData = batchData
            const data = await batchService.batchList(req.body, req.params, req.query)

            if (data.status) {
                res.redirect('/batch/batch-list')
            } else {
                res.render("batch/batch-list", {
                    errorMsg: data.msg,
                    data: req.body
                })
            }

        } catch (error) {
            res.render("batch/batch-list", {
                errorMsg: error.msg,
                data: req.body
            })
        }
    },

    deleteBatch: async (req, res) => {
        try {
            const data = await batchService.deleteBatch(req.body, req.params, req.query)
            const dataBatches = await batchService.manageBatch(req.body, req.params, req.query)

            if (data.status) {
                res.render('batch/manage-batch', {
                    successMsg: "Successfully Deleted",
                    data: dataBatches,
                    currentPage: req.query.page || 1
                })

            } else {
                res.render('batch/manage-batch', {
                    errorMsg: data.msg
                })
            }

        } catch (error) {
            const dataBatches = await batchService.manageBatch(req.body, req.params, req.query)
            
            res.render('batch/manage-batch', {
                errorMsg: error.msg,
                data: dataBatches,
                currentPage: req.query.page || 1
            })
        }
    },

    moveTaughtTopic: async (req, res) => {
        try {
            const requestedId = req.params.batchId
            const updateTopic = await batchService.moveTaughtTopic(req.body, req.params, req.query)
            const data = await batchModel.findOne({ _id: requestedId }).lean()

            res.render('batch/edit-batch', {
                data: data,
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}