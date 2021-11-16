const quizModel= require('../models/dailyQuizQuestions')
const categorySchema = require('../models/categoryModel')

const s3Service = require ('../services/s3Service')
const perPage = 10;


module.exports = {
    createQuestion: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
             let quetype=files.length!==0?"image":"text";
            
            if(typeof body.question==="object"){
                console.log('body',body)
       
                let imageArr=[]
                  
               if(files) {
                for(let i=0; i<files.length; i++){
                    let imageUrl={}
                    let file = files[i]
                    file.folder = `questionImage/${file.fieldname}/`

                    await s3Service.uploadToS3(file)
                        .then(async doc => {
                            if(doc) imageUrl = doc;
                        
                        })
                        .catch(error => {
                            console.log("uploadToS3 error: ", error);
                            throw new Error(error);
                        })
                        imageUrl.index=file.fieldname-1
                        imageArr.push(imageUrl)
                  }
                 }
            

                let questionArr=body.question;
                let answerArr=body.answer;
                let itemNameArr=body.itemName
                let itemPriceArr=body.itemPrice
                
                let responseArray=[];
        
            for(let i=0;i<itemNameArr.length;i++){
                  let image={
                      Location:"image.Url"
                  }

               if(imageArr.some(e => e.index === i))
                  image=imageArr.filter(function(e) { if( e.index === i) return e;})[0]
              
                
                let queObj={
                    topic:[body.topic],
                    itemDetails:questionArr[i],
                    itemName: itemNameArr[i],
                    itemPrice:itemPriceArr[i],
                    imageUrl:image.Location
                }
                responseArray.push(queObj)

            }
            quizModel.insertMany(responseArray).then(function(saved){
                resolve({"status": true, "code": 200, "msg": saved})
            }).catch(function(error){ 
                reject({"status": false, "code": 500, "msg": error})
            });
         }else{

               let imageUrl=""
                  
               if (files) {
                for(let i=0; i<files.length; i++){
                    let file = files[i]
                    file.folder = `questionImage/${file.fieldname}/`

                    await s3Service.uploadToS3(file)
                        .then(async doc => {
                            if(doc) imageUrl = doc.Location;
                        
                        })
                        .catch(error => {
                            console.log("uploadToS3 error: ", error);
                            throw new Error(error);
                        })
                  }
                 }
                 

            
                let question=new quizModel({
                    itemName:body.itemName,
                    itemPrice:body.itemPrice,
                    topic:[body.topic],
                    itemDetails:body.question,
                    imageUrl:imageUrl,
                })
                question.save((err, saved)=>{
                    if(err){
                        reject({"status": false, "code": 500, "msg": err})
                    }else{
                        resolve({"status": true, "code": 200, "msg": saved})
                    }
                })   
            }
        });
    },
    createCategory: async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            let category = new categorySchema({
                categoryName:body.categoryName,
            })
            category.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 500, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })
        });
    },
    fetchCategoryList: async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {

         
            
            let result = await categorySchema.find().lean();
            
            // count = await quizModel.countDocuments({isDeleted: false})
            // if(count > 0){
            //     totalPages = Math.ceil(count / perPage)
            // }
            
            resolve({result})
        });
    },
    findTopicQuestions: async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            let page = query.page || 1
            let count = 0
            let totalPages = 0
            const requestedTopic = [body.topic]
         
            
            let result = await quizModel.find({topic:requestedTopic}).lean();
            console.log("categorydata",result)
            
            // count = await quizModel.countDocuments({isDeleted: false})
            // if(count > 0){
            //     totalPages = Math.ceil(count / perPage)
            // }
            
            resolve({result})
        });
    },
    updateQuestion: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            let quetype=files.length!==0?"image":"text";
       
            let uploadedUrl=""
                  
               if (files) {
                for(let i=0; i<files.length; i++){
                    let file = files[i]
                    file.folder = `questionImage/${file.fieldname}/`

                    await s3Service.uploadToS3(file)
                        .then(async doc => {
                            if(doc) uploadedUrl = doc.Location;
                        
                        })
                        .catch(error => {
                            console.log("uploadToS3 error: ", error);
                            throw new Error(error);
                        })
                  }
                 }
            const requestedId = params.questionID
            let questionData = await quizModel.findOne({_id:requestedId})
            if(!questionData){
                reject({"status": false, "code": 404, "msg": "question does not exist"})
            }
            
            questionData.topic=[body.topic]
            questionData.question=body.question
          
            questionData.options=body.options   
           
            questionData.answer=parseInt(body.answer)
            questionData.questionType=quetype
            questionData.imageUrl=files.length!==0?uploadedUrl:questionData.imageUrl         
            

            questionData.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 500, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })

        });
    },
    updateItem: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            console.log("updateddata",body,files)
            let uploadedUrl=""
                  
               if (files) {
                for(let i=0; i<files.length; i++){
                    let file = files[i]
                    file.folder = `questionImage/${file.fieldname}/`

                    await s3Service.uploadToS3(file)
                        .then(async doc => {
                            if(doc) uploadedUrl = doc.Location;
                        
                        })
                        .catch(error => {
                            console.log("uploadToS3 error: ", error);
                            throw new Error(error);
                        })
                  }
                 }
            const requestedId = params.itemID
            let itemData = await quizModel.findOne({_id:requestedId})
            if(!itemData){
                reject({"status": false, "code": 404, "msg": "question does not exist"})
            }
            console.log("itemData",itemData)
            
            itemData.topic=[body.topic]
            itemData.itemDetails=body.question
            itemData.itemName=body.itemName
            itemData.itemPrice=body.itemPrice
            itemData.imageUrl=files.length!==0?uploadedUrl:itemData.imageUrl         
            

            itemData.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 500, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })

        });
    },
    deleteQuestion: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestedId = params.questionID
            let questionData = await quizModel.findOne({_id:requestedId})
            if(!questionData){
                reject({"status": false, "code": 404, "msg": "user does not exist"})
            }
            questionData.isDeleted = true
            questionData.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 500, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })

        });
    },
}






