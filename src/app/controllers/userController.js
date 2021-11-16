const userService = require('../services/userService');
const quizModel= require('../models/dailyQuizQuestions')

const topicsData =["Redis","MongoDB","JavaScript","Data Structures"]


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

    register:async(req, res) => {
        try{ 
            console.log('bodyNew',req.body)
             const data = await userService.signUp(req.body, req.files, req.params, req.query)
             console.log(data)
            // const categoryData=await quizService.fetchCategoryList()
            if(data.status){
                res.render('signup',{
                        successMsg:"succesfully signed up"
                     });
            }else{
                res.render('signup',{
                    errorMsg:`error ${data.msg}`
                 });
                }
            
        } catch(error){
            console.log("error box",error)
            res.render('signup',{
                errorMsg:error.msg

            });
 
        }
    }, 
    signUp: async(req, res) => {
        res.render('signup',{
        });
    },
    login:async(req, res) => {
        try{ 
            console.log('bodyNew',req.body)
             const data = await userService.login(req.body, req.files, req.params, req.query)
             console.log(data)
            // const categoryData=await quizService.fetchCategoryList()
            if(data.status){

                res.redirect('/dashboard');

            }else{
                res.render('login',{
                    errorMsg:`error ${data.msg}`
                 });
                }
            
        } catch(error){
            console.log("error box",error)
            res.render('login',{
                errorMsg:error.msg

            });
 
        }
    }, 
        
    
    }
