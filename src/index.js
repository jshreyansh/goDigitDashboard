if (process.env.NODE_ENV) {
    require ("dotenv").config({
        path:`${__dirname}/.env.${process.env.NODE_ENV}`
    })
} else require ("dotenv").config()


const mongoose=require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))


const app= require('./server.js').app

//express routes
app.use('/',require('./app/routes/adminRoute.js'));
app.use('/quiz',require('./app/routes/quizRoute.js'));
app.use('/user',require('./app/routes/userRoute.js'));

module.exports = app