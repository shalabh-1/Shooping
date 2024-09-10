const asyncHandler = require('express-async-handler')
const validateId = require("../utils/validateMongoDb.js")
const Brand = require("../models/brandModel.js")

const { response } = require('express')


const createBrand = asyncHandler(


    async (request, response) => {

        try {

            let newBrand = new Brand(request.body)

            newBrand = await newBrand.save()


            response.json(newBrand)



        } catch (error) {

            throw new Error(error)
        }
    }



)


const updateBrand = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)

            let updateBrand = await Brand.findByIdAndUpdate(id, request.body,
                {
                    new: true
                }
            )
            response.json(updateBrand)

        } catch (error) {

            throw new Error(error)
        }
    }



)


const deleteBrand = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)
            let delBrand = await Brand.findByIdAndDelete(id)

            response.json(delBrand)

        } catch (error) {

            throw new Error(error)
        }
    }



)



const getBrand = asyncHandler(


    async (request, response) => {

        try {
            const { id } = request.params
            validateId(id)
            let gBrand = await Brand.findById(id)

            response.json(gBrand)

        } catch (error) {

            throw new Error(error)
        }
    }



)




const getAllBrand = asyncHandler(


    async (request, response) => {

        try {


            let allBrand = await Brand.find({})

            response.json(allBrand)

        } catch (error) {

            throw new Error(error)
        }
    }



)
module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand }