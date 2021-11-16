const userModel = require('../models/userModel')
const perPage = 10;
const acceptedFileType = ['text/csv','application/vnd.ms-excel'];
const csv = require('csvtojson')
const async = require('async')

module.exports = {
    createStudent: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {

            let studentArray= body.studentData
            let studentmobileArray=[]
            for(let i=0;i<studentArray.length;i++) {
                let mobileNum=studentArray[i]
                studentmobileArray.push(mobileNum.mobile)
            }
            
            if(typeof body.fullName==="object"){
                let nameArray=body.fullName;
                let mobileArray=body.mobile;
                let newStudentArray=[];
        
            for(let i=0;i<nameArray.length;i++){
               if(studentmobileArray.indexOf(mobileArray[i])==-1){
                let studObj={
                    fullName: nameArray[i],
                mobile: mobileArray[i],
                batch: body.batch
                }
                newStudentArray.push(studObj)
               }else{
                let findUser=await userModel.findOne({ mobile: mobileArray[i]})
                if(!findUser.isDeleted){
                    reject({"status": false, "code": 500, "msg": "duplicate key already existes"})
                }
                let updatedUser = await userModel.findOneAndUpdate({ mobile: mobileArray[i]}, { $set: { isDeleted: false}},{new:true})
                if (!updatedUser) {
                    reject({"status": false, "code": 500, "msg": "duplicate key mentioned cant be updated"})
                  }   
                  else{
                    console.log("updated deleted users when put in bulk")

                  }
            }

            }
            userModel.insertMany(newStudentArray).then(function(saved){
                resolve({"status": true, "code": 200, "msg": saved})
            }).catch(function(error){ 
                reject({"status": false, "code": 500, "msg": error})
            });
        }else{
            if(studentmobileArray.indexOf(body.mobile)==-1){
                let user = new userModel({
                    fullName: body.fullName,
                    mobile: body.mobile,
                    batch: body.batch
                })
                user.save((err, saved)=>{
                    if(err){
                        reject({"status": false, "code": 500, "msg": err})
                    }else{
                        resolve({"status": true, "code": 200, "msg": saved})
                    }
                })
            }else{
                let findUser=await userModel.findOne({ mobile: body.mobile})
                if(!findUser.isDeleted){
                    reject({"status": false, "code": 500, "msg": "duplicate key already existes"})
                }


                let updatedUser = await userModel.findOneAndUpdate({ mobile: body.mobile}, { $set: { isDeleted: false ,fullName:body.fullName, batch: body.batch }},{new:true})
                if (!updatedUser) {
                    reject({"status": false, "code": 500, "msg": "duplicate key mentioned cant be restored"})
                  }else{
                      console.log("updated deleted user")
                    resolve({"status": true, "code": 200, "msg": "updated deleted user"})

                  }   
                
            }
                   
            
        }

     
        });
    },
    deleteStudent: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.studentId
            let userData = await userModel.findOne({_id:requestedId})
            if(!userData){
                reject({"status": false, "code": 500, "msg": "user does not exist"})
            }
            userData.isDeleted = true
            userData.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 500, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })

        });
    },
    createStudentBulk: (body, files, params, query ) => {
        return new Promise(async (resolve, reject) => {
                if(!acceptedFileType.includes(files[0].mimetype)){
                    reject({"status": false, "code": 400, "msg": 'mime-type ' + files[0].mimetype + ' not accepted'})
                }

                let studentArray= body.studentData
                let studentmobileArray=[]
                for(let i=0;i<studentArray.length;i++)
                {
                    let mobileNum=studentArray[i]
                    studentmobileArray.push(mobileNum.mobile)
                }

                const csvString = files[0].buffer.toString();
                csv().fromString(csvString).then((jsonObj)=>{
                   const studentsList = jsonObj;
                   let studentsArray = []
                    async.each(studentsList, function(row, callback){
                        if(row['fullName'] !== "" && row['mobile']){
                            
                            let obj={}
                            obj.fullName = row['fullName']
                            if(row['mobile'].length === 10) obj.mobile = row['mobile']
                            obj.batch=body.batch
                           
                            studentsArray.push(obj)
                            callback();
                        }else{
                            callback("error");
                        }
                    }, function(error){
                        if(error){
                            reject({"status": false, "code": 400, "msg": error})
                        }else{
                            userModel.insertMany(studentsArray).then(function(saved){
                                resolve({"status": true, "code": 200, "msg": 'students uploded'})
                            }).catch(function(error){ 
                                reject({"status": false, "code": 400, "msg": error})
                            });
                        }
                    })
                })
        });
    },
    updateStudent: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.studentId
            let userData = await userModel.findOne({_id:requestedId})
            if(!userData){
                reject({"status": false, "code": 500, "msg": "user does not exist"})
            }
            userData.fullName = body.fullName
            userData.mobile = body.mobile
            userData.batch = body.batch

            userData.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 500, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })

        });
    },

    studentList: async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            let page = query.page || 1
            let count = 0
            let totalPages = 0

            let result = await userModel.find({isDeleted: false}).populate("batch").skip((perPage * page) - perPage).limit(perPage).sort({createdAt: -1}).lean();

            count = await userModel.countDocuments({isDeleted: false})
            if(count > 0){
                totalPages = Math.ceil(count / perPage)
            }
            
            resolve({result,totalPages})
        });
    },
    studentListBatch: async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            let page = query.page || 1
            let count = 0
            let totalPages = 0
            const requestedBatch = body.batch
            let result = await userModel.find({isDeleted: false,batch:requestedBatch}).populate("batch").skip((perPage * page) - perPage).limit(perPage).sort({createdAt: -1}).lean();

            count = await userModel.countDocuments({isDeleted: false})
            if(count > 0){
                totalPages = Math.ceil(count / perPage)
            }
            
            resolve({result,totalPages})
        });
    },

}