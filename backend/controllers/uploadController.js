const multer = require('multer') //multer is use to upload images
const uploadController = require('express').Router()

// destination -> where the image will be saved(in which the directory)
// filename -> what will be the name of the saved image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage
})

// upload.single("image") is going to check in the req.body for the req.body.image
uploadController.post("/image", upload.single("image"), async(req, res) => {
    try {
        return res.status(200).json("File uploaded sucessfully")
    } catch (error) {
        console.error(error)
    }
})

module.exports = uploadController