const express = require('express')
const app = express()
const dotenv = require('dotenv').config({path:'./env/.env'})
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')

//mongoDB connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('mongodb successfull connection!!')
}).catch(err => {
    console.log(err) 
})

//DATA REQUESTS
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//ROUTES
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)

const port = process.env.PORT || 8080

app.listen(port,()=>{
    console.log('serever running on port: ' + port)
})