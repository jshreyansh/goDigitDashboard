
const userModel = require('../models/userModel')
const {validator} = require('../../utils')
const jwt = require('jsonwebtoken');
const shortid = require('shortid')
const s3Service = require ('../services/s3Service')
const perPage = 10;
const baseUrl = 'http:localhost:3000'


module.exports = {

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
    signUp: async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestBody = body;
            if(!validator.isValidRequestBody(requestBody)) {
                return res.status(400).send({status: false, message: 'Invalid request parameters. Please provide user details'})
            }
            const {fullName, email, password,} = requestBody; // Object destructing

        if(!validator.isValid(fullName)) {
            reject({"status": false, "code": 400, "msg": ' Name is required'})
        }

        if(!validator.isValid(email)) {
            reject({"status": false, "code": 400, "msg": ' Email is required'})
            
        }
        
        if(!validator.validateEmail(email)) {
            reject({"status": false, "code": 400, "msg": ' Email should be a valid email address'})
            }

        if(!validator.isValid(password)) {
            reject({"status": false, "code": 400, "msg": 'Password is required'})
            
        }
        
        if(!validator.isValidLength(password, 8, 15)) {
            reject({"status": false, "code": 400, "msg": 'Password lenght must be between 8 to 15 char long'})
            
        }
        const isEmailAlreadyUsed = await userModel.findOne({email}); // {email: email} object shorthand property
        if(isEmailAlreadyUsed) {
            console.log("istaken",isEmailAlreadyUsed)

            reject({"status": false, "code": 400, "msg": 'account already exists with this Email'})
        }
        const urlCode = shortid.generate()

        const userData = {fullName, email, password,urlCode}
        const newUser = await userModel.create(userData);
         console.log("im here")

         resolve({"status": true, "code": 201, "msg": "User created successfully","data":newUser})
        });
    },
    login : async (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            const requestBody = body;
            if(!validator.isValidRequestBody(requestBody)) {
                return res.status(400).send({status: false, message: 'Invalid request parameters. Please provide user details'})
            }
            const {email, password} = requestBody; // Object destructing



        if(!validator.isValid(email)) {
            reject({"status": false, "code": 400, "msg": ' Email is required'})
            
        }
        
        if(!validator.validateEmail(email)) {
            reject({"status": false, "code": 400, "msg": ' Email should be a valid email address'})
            }

        if(!validator.isValid(password)) {
            reject({"status": false, "code": 400, "msg": 'Password is required'})
            
        }
        
        if(!validator.isValidLength(password, 8, 15)) {
            reject({"status": false, "code": 400, "msg": 'Password lenght must be between 8 to 15 char long'})
            
        }
            // Validation ends
    
            const user = await userModel.findOne({email, password});

            if(!user) {
                
                reject({"status": false, "code": 401, "msg": 'Invalid login credentials'})

            }
                jwt.sign({ email: email }, process.env.JWT_PRIVATE_KEY_HOST, (err, token) => {
                    if (err) {
                        reject({"status": false, "code": 401, "msg": 'Invalid login credentials'})
                    } else {
                        resolve({"status": true, "code": 200, "msg": "user login successful","data":{token}})
                    }
                })

            // return res.status(200).send({status: true, message: `User login successfull`, data: {token}});
       
    });
},

}






