const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors') // use for connecting ports
const authController = require('./controllers/authController')
const propertyController = require('./controllers/propertyController')
const uploadController = require('./controllers/uploadController')
const app = express()

// mongodb connect
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, () => console.log('MonogoDB has been started sucessfully....'));

// this make it possible to call 
// http://localhost:5000/image
app.use('/images', express.static('public/images'));

// routes & middleware

app.use(cors()) //this position should be above the controller
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/auth", authController)
app.use("/property", propertyController)
app.use("/upload", uploadController)

// starting server
app.listen(process.env.PORT, () => console.log(`Server has been started sucessfully, ${process.env.PORT}`))

