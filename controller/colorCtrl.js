const asyncHandler = require('express-async-handler')
const validateId = require("../utils/validateMongoDb.js")
const Color = require("../models/colorModel.js")

const { response } = require('express')


const createColor = asyncHandler(


    async (request, response) => {

        try {

            let newColor = new Color(request.body)
            
            newColor  = await newColor.save()


            response.json(newColor)



        } catch (error) {

            throw new Error(error)
        }
    }



)


const updateColor = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)

            let updateColor = await Color.findByIdAndUpdate(id, request.body,
                {
                    new: true
                }
            )
            response.json(updateColor)

        } catch (error) {

            throw new Error(error)
        }
    }



)


const deleteColor = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)
            let delColor = await Color.findByIdAndDelete(id)

            response.json(delColor)

        } catch (error) {

            throw new Error(error)
        }
    }



)



const getColor = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)
            let gColor = await Color.findById(id)

            response.json(gColor)

        } catch (error) {

            throw new Error(error)
        }
    }



)




const getAllColor = asyncHandler(


    async (request, response) => {

        try {


            let allColor = await Color.find({})

            response.json(allColor)

        } catch (error) {

            throw new Error(error)
        }
    }



)
module.exports = { createColor, updateColor, deleteColor, getColor, getAllColor }