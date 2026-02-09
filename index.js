const express = require('express')
const app = express()
app.use(express.json())

const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')

const PORT = process.env.PORT
const mongodb = process.env.mongo_URI

const frontendURL = process.env.frontend_URL

require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);

const cors = require('cors')
app.use(cors({
    origin: frontendURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}))

mongoose.connect(mongodb)
    .then(() =>{
        console.log(`✅ Database Connected Successfully`)
    }).catch((err) =>{
        console.log(`❌ Database Not Connected ${err}`)
    })


const adminRoutes = require('./routes/admin.routes')
const usersRoutes = require('./routes/users.routes')

app.use('/api/admin', adminRoutes)

app.use('/api/user', usersRoutes)

app.listen(PORT, (err) =>{
    if(err){
        console.log(`❌ Failed to start server ${err}`)
    } else{
        console.log(`🚀 Serve is running at port ${PORT}`)
    }
})