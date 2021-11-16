const quizService = require('../services/quizService');
const quizModel= require('../models/dailyQuizQuestions')

const topicsData =["Redis","MongoDB","JavaScript","Data Structures"]
const batchService = require('../services/batchService');
module.exports = {
    addQuestion: async(req, res) => {
        const data=await quizService.fetchCategoryList()
        console.log('data',data)
        res.render('quiz/add-question',{
            topicList: data.result
        });
    },
    manageQuestions: async(req, res) => {
        const data=await quizService.fetchCategoryList()

        res.render('quiz/manage-question',{
            topicList: data.result,
          
        });
    },
    createTest:async(req, res) => {
        
        const batchData = await batchService.batchList()
        res.render('quiz/create-test',{
            topicList: topicsData,
            batchList: batchData
        });
    },
    saveCategory:async(req,res) =>{
        try{
            
            console.log('reqbody for test creation', req.body)
          
            const data = await quizService.createCategory(req.body, req.files, req.params, req.query)
          
                     
            res.render('quiz/create-test',{
                successMsg:`category created succesfully`
                // pageUrl:`/student/find-student-batch/${requestedBatch}`
            });
        } catch(error){
            res.render('quiz/create-test',{
                topicList: topicsData,
                errorMsg:`Test creation failed`
                // pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        }

    },
    fetchCategory:async(req,res) =>{
        try{    
            const data = await quizService.fetchCategoryList(req.body, req.files, req.params, req.query)
          
                     
            res.render('quiz/manage-question',{
                data: data,
                currentPage: req.query.page || 1,
                topicList: topicsData,
                requestedTopic:requestedTopic
                // pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        } catch(error){
            res.status(400).send(error);
        }

    },

    saveTest:async(req,res) =>{
        try{
            
            console.log('reqbody for test creation', req.body)
          
            // const data = await quizService.findTopicQuestions(req.body, req.files, req.params, req.query)
          
                     
            res.render('quiz/create-test',{
                topicList: topicsData,
                successMsg:`Test created succesfully`
                // pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        } catch(error){
            res.render('quiz/create-test',{
                topicList: topicsData,
                errorMsg:`Test creation failed`
                // pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        }

    },
    findTopicQuestions:async(req,res) =>{
        try{
            
            const requestedTopic = req.body.topic
            const categorydata=await quizService.fetchCategoryList()

          
            const data = await quizService.findTopicQuestions(req.body, req.files, req.params, req.query)
          
                     
            res.render('quiz/manage-question',{
                data: data,
                currentPage: req.query.page || 1,
                topicList: categorydata.result,
                requestedTopic:requestedTopic
                // pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        } catch(error){
            res.status(400).send(error);
        }

    },
    findTopicQuestionsTest:async(req,res) =>{
        try{
            
            const requestedTopic = req.body.topic
            const batchData = await batchService.batchList()
            const data = await quizService.findTopicQuestions(req.body, req.files, req.params, req.query)
          
                     
            res.render('quiz/create-test',{
                data: data,
                currentPage: req.query.page || 1,
                topicList: topicsData,
                requestedTopic:requestedTopic,
                batchList: batchData
                // pageUrl:`/student/find-student-batch/${requestedBatch}`

            });
        } catch(error){
            res.status(400).send(error);
        }

    },
    editQuestion: async(req, res) => {
        try{
            const requestedId = req.params.questionID
            const categoryData=await quizService.fetchCategoryList()
            const data = await quizModel.findOne({_id:requestedId}).lean()
            console.log("EditData",data)
          
            res.render('quiz/edit-question',{
                data: data,
                topicList: categoryData.result
            });
        } catch(error){
            res.status(400).send(error);
        }
    },
    createQuestion:async(req, res) => {
            try{ 
                console.log('bodyNew',req.body)
                const data = await quizService.createQuestion(req.body, req.files, req.params, req.query)
                const categoryData=await quizService.fetchCategoryList()

                
        
                if(data.status){
                    res.render('quiz/add-question',{
                        topicList: categoryData.result,
                        successMsg:`Uploaded succesfully in `
                    });
                }else{
                    res.render('quiz/add-question',{
                        topicList: topicsData,
                        errorMsg:`Upload failed succesfully in }`,
                        data:req.body
                    });
                }
                
            } catch(error){
                console.log(error)
                res.render('quiz/add-question',{
                    errorMsg:error.msg, 
                    topicList: topicsData,
                    data:req.body
                });
            }
        },
        updateQuestion: async(req, res) => {
            try{
              
                const data = await quizService.updateQuestion(req.body, req.files, req.params, req.query)
                
    
                if(data.status){
                    
                    res.render('quiz/manage-question',{
                        
                        successMsg:`question updated Successfully in topic ${data.msg.topic[0]}`,
                        topicList: topicsData,
                 
                    })
                }else{
                    res.render('quiz/edit-question',{
                        data: data,
                        topicList: topicsData,
                        errorMsg:`question not updated in/to topic ${data.msg.topic[0]}`
                    });
                }
                
            } catch(error){
                res.render('quiz/edit-question',{
                    data: data,
                    topicList: topicsData,
                    errorMsg:`question not updated in/to topic ${data.msg.topic[0]}`

                });
            }
        },
        updateItem: async(req, res) => {
            try{
              
                const categoryData=await quizService.fetchCategoryList()

                const data = await quizService.updateItem(req.body, req.files, req.params, req.query)
                
    
                if(data.status){
                    
                    res.render('quiz/manage-question',{
                        
                        successMsg:`question updated Successfully in topic ${data.msg.topic[0]}`,
                        topicList: categoryData.result,
                 
                    })
                }else{
                    res.render('quiz/edit-question',{
                        data: data,
                        topicList: topicsData,
                        errorMsg:`question not updated in/to topic ${data.msg.topic[0]}`
                    });
                }
                
            } catch(error){
                res.render('quiz/edit-question',{
                    data: data,
                    topicList: topicsData,
                    errorMsg:`question not updated in/to topic ${data.msg.topic[0]}`

                });
            }
        },
        deleteQuestion : async(req, res) => {
            try{
                const data = await quizService.deleteQuestion(req.body, req.files, req.params, req.query)
                if(data.status){
                    res.render('quiz/manage-question',{
                        
                        successMsg:`question deleted Successfully`,
                        topicList: topicsData,
                 
                    })
    
                }else{
                    res.render('quiz/manage-question',{
                        
                        errorMsg:`question deletion failed`,
                        topicList: topicsData,
                 
                    })
                }
                
            } catch(error){
                res.render('quiz/manage-question',{
                        
                    errorMsg:`question deletion failed`,
                    topicList: topicsData,
             
                })
            }
        },
    
    }
