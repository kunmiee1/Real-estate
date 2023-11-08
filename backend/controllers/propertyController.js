const Property = require('../models/Property')
const propertyController = require('express').Router()
const verifyToken = require("../middlewares/verifyToken")

// get all
propertyController.get('/getAll', async(req, res) => {
    try {
        const propertise = await Property.find({})
        return res.status(200).json(propertise)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get featured
propertyController.get('/find/featured', async(req, res) => {
    try {
        const featureProperties = await Property.find({featured: true}).populate('currentOwner', '-password', {strictPopulate: false}) //-password is to no inlcude password of the currentOwner in the data

        return res.status(200).json(featureProperties)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get all from a specific type
propertyController.get('/find', async(req, res) => {
    const type = req.query // the .query is to get the attachement on the url call, eg /find?type=beach?continent=africa, its's start with ? in this mention case
    // its also in a key value pair {type: 'beach'}
    try {
        if(type){
        const properties = await Property.find(type).populate('currentOwner')
        return res.status(200).json(properties)
        } else {
            return res.status(500).json({msg: "No such type"})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get counts of  types => {beach: 2, village: 5, mountain: 12}
propertyController.get('/find/types', async(req, res) => {
    const type = req.query
    // {type: 'beach}
    try {
        // const beachType = await Property.find({type: 'beach'}).length // this is not the best pratice, but may be use for some application like this, but let use the best pratice below.
        const beachType = await Property.countDocuments({type: 'beach'}) // this is the best pratice, especially for large project
        const mountainType = await Property.countDocuments({type: 'mountain'})
        const villageType = await Property.countDocuments({type: 'village'})

        return res.status(200).json({
            beach: beachType,
            mountain: mountainType,
            village: villageType
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get individual property
propertyController.get('/find/:id', async(req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("currentOwner", "-password")

        if(!property) {
            throw new Error("No such property with this id")
        } else {
            return res.status(200).json(property)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// create an property
propertyController.post('/', verifyToken, async(req, res) => {
    try {
        const newProperty = await Property.create({...req.body, currentOwner: req.user.id})

        return res.status(201).json(newProperty)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// update property
propertyController.put('/:id', verifyToken, async(req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        if(property.currentOwner.toString() !== req.user.id.toString()) {
            throw new Error("You are not allowed to update other people propertise")
        } else {
            const updatedProperty = await Property.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true} // this is use to help return the updated one, not the formal one, after change have been made.
            )
            return res.status(201).json(updatedProperty)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// delete estate
propertyController.delete('/:id', verifyToken, async(req, res) => {
    try {
        const property = await Property.findById(req.params.id)

        if(property.currentOwner.toString() !== req.user.id.toString()) {
            throw new Error("You are not allowed to delete other people property")
        } else {
            await property.delete()
            return res.status(200).json({msg: 'Sucessfully deleted property'})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = propertyController