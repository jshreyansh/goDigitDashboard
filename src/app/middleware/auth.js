const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
        try{
            cosole.log("req",req)
    
        let token=req.cookie('x-auth-token')
        if(token) {
            let validatedToken=jwt.verify(token,'mysecretkey')
    
            if(validatedToken){
                   req.validatedToken=validatedToken;
                   next()
            } else {
                res.render('login',{
                    errorMsg:`invalid token`
                 });
                
    }
        } else {
            res.render('login',{
                errorMsg:`no token`
             });        }
            
        } catch(error){
            res.render('login',{
                errorMsg:"error box"
             });        
    
    }
}