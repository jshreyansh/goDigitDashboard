const studentService = require('../services/studentService');
const batchService = require('../services/batchService');
const studentModel= require('../models/userModel')

module.exports = {
    addStudent: async(req, res) => {
        const data = await batchService.batchList()
        res.render('student/add-student',{
            batchList: data
        });
    },

    editStudent: async(req, res) => {
        try{
            const requestedId = req.params.studentId
            const data = await studentModel.findOne({_id:requestedId}).lean()
            const batchData = await batchService.batchList()
           
            res.render('student/edit-student',{
                data: data,
                batchList: batchData
            });
        } catch(error){
            res.status(400).send(error);
        }
    },
    findStudent: async(req,res) =>{
        try{
            
            const requestedMobile = req.body.mobile
           

            const data  = await studentModel.findOne({mobile:requestedMobile,isDeleted:false}).populate("batch").lean()
            const batchData = await batchService.batchList()
            if(data){
                let modelArr=[]
                modelArr.push(data);
                let modeledData={
                    result: modelArr
                }        

                res.render('student/manage-student',{
                    data: modeledData,
                    currentPage: req.query.page || 1,
                    batchList: batchData
                });
            }else{
                res.render('student/manage-student',{
                    batchList: batchData,
                    errorMsg:"user does not exist"
                });

            }

        } catch(error){
            res.status(400).send(error);
        }

    },
    findStudentBatch:async(req,res) =>{
        try{
            
            const requestedBatch = req.body.batch
           
            const data = await studentService.studentListBatch(req.body, req.files, req.params, req.query)
            const batchData = await batchService.batchList()
          
                     
            res.render('student/manage-student',{
                data: data,
                currentPage: req.query.page || 1,
                batchList: batchData,
                pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        } catch(error){
            res.status(400).send(error);
        }

    },
    findStudentBatchPage:async(req,res) =>{
        try{
            
            const requestedBatch = req.params.batchId

            req.body.batch=requestedBatch
            const data = await studentService.studentListBatch(req.body, req.files, req.params, req.query)
            const batchData = await batchService.batchList()
          
                     
            res.render('student/manage-student',{
                data: data,
                currentPage: req.query.page || 1,
                batchList: batchData,
                pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        } catch(error){
            res.status(400).send(error);
        }

    },

    updateStudent: async(req, res) => {
        try{
            const data = await studentService.updateStudent(req.body, req.files, req.params, req.query)
            const batchData = await batchService.batchList()

            if(data.status){
                res.redirect('/student/manage-student')
            }else{
                res.render('student/edit-student',{
                    errorMsg:data.msg,
                    data: req.body,
                    batchList: batchData
                })
            }
            
        } catch(error){
            res.render('student/edit-student',{
                errorMsg: error.msg,
                data: req.body,
                batchList: await batchService.batchList()
            })
        }
    },

    manageStudent: async(req, res) => {
        try{
            const data = await studentService.studentList(req.body, req.files, req.params, req.query)
            const batchData = await batchService.batchList()
            res.render('student/manage-student',{
                data: data,
                currentPage: req.query.page || 1,
                batchList: batchData,
                pageUrl:"/student/manage-student"

            });
        } catch(error){
            res.status(400).send(error);
        }
    },
    
    createStudent: async(req, res) => {
        try{ 
            let studentData = await studentModel.find().lean()
            req.body.studentData=studentData
            const data = await studentService.createStudent(req.body, req.files, req.params, req.query)

            if(data.status){
                res.render('student/add-student',{
                    successMsg:"User Created Successfully ",
             
                })
            }else{
                res.render("student/add-student",{
                    errorMsg: data.msg,
                    data: req.body,
                    batchList: batchData
                })
            }
            
        } catch(error){
            res.render("student/add-student",{
                errorMsg: error.msg,
                data: req.body,
                batchList: await batchService.batchList()
            })
        }
    },

    deleteStudent : async(req, res) => {
        try{
            const data = await studentService.deleteStudent(req.body, req.files, req.params, req.query)
            const batchData = await batchService.batchList()
            const dataStudents = await studentService.studentList(req.body, req.files, req.params, req.query)
            if(data.status){
                res.render('student/manage-student',{
                    successMsg:"Successfully Deleted",
                    data:dataStudents,
                    currentPage: req.query.page || 1,
                    batchList: batchData

                })

            }else{
                res.render('student/manage-student',{
                    successMsg:"Successfully Deleted",
                    errorMsg:data.msg,
                    batchList: batchData
                })
            }
            
        } catch(error){
            res.render('student/manage-student',{
                errorMsg: error.msg,
                batchList: await batchService.batchList()
            })
        }
    },

    createStudentBulk: async(req, res) => {
        try{
            let studentData = await studentModel.find().lean()
            req.body.studentData=studentData
            const data = await studentService.createStudentBulk(req.body, req.files, req.params, req.query)
            const batchData = await batchService.batchList()

            if(data.status){
                res.redirect('/student/manage-student')
            }else{
                res.render("student/add-student",{
                    errorMsg: data.msg,
                    batchList: batchData
                })
            }
            
        } catch(error){
            res.render("student/add-student",{
                errorMsg: error.msg,
                batchList: await batchService.batchList()
            })
        }
    },

}