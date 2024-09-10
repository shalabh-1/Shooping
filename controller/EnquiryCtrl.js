const asyncHandler = require('express-async-handler')
const validateId = require("../utils/validateMongoDb.js")

const Color = require("../models/enquiryModel.js")

const { response } = require('express')


const createEnquiry = asyncHandler(


    async (request, response) => {

        try {

            let newEnquiry = new Enquiry(request.body)
            newEnquiry  = await newEnquiry.save()
            response.json(newEnquiry)
        } catch (error) {

            throw new Error(error)
        }
    }



)


const updateEnquiry = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)

            let updateEnquiry = await Enquiry.findByIdAndUpdate(id, request.body,
                {
                    new: true
                }
            )
            response.json(updateEnquiry)

        } catch (error) {

            throw new Error(error)
        }
    }



)


const deleteEnquiry = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)
            let delEnquiry = await Enquiry.findByIdAndDelete(id)

            response.json(delEnquiry)

        } catch (error) {

            throw new Error(error)
        }
    }



)



const getEnquiry = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)
            let gEnquiry = await Enquiry.findById(id)

            response.json(gEnquiry)

        } catch (error) {

            throw new Error(error)
        }
    }



)




const getAllEnquiry = asyncHandler(


    async (request, response) => {

        try {


            let allEnquiry = await Enquiry.find({})

            response.json(allEnquiry)

        } catch (error) {

            throw new Error(error)
        }
    }



)
module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquiry }