import Form from "../modules/Form.js";
import mongoose from "mongoose";

class FormController {
    async store (req,res){
        try{
            // console.log(`user id = ${req.jwt.id}`)
            const form = await Form.create({
                userId: req.jwt.id,
                title: 'Untitled Form',
                description: null,
                public: true
            })


            if(!form) throw{code:500, message:'FORM_CREATE_FAILED'}

            return res.status(200).json({
                status: true,
                message:'FORM_CREATED_SUCCESS',
                form
            })
        }catch(err){
            console.log(req.jwt)
            console.log(err.message)
            return res.status(err.code||500).json({
                status: false,
                message:err.message
            })
        }
    }

    async show (req,res){
        try{
            if(!req.params.id) throw{code:400, message:'REQUIRED_ID_FORM'}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw{code:400, message:'ID_NOT_VALID'}
            // console.log('id is valid')

            const form = await Form.findOne({_id: req.params.id, userId: req.jwt.id})
            // console.log('form access')
            if(!form) throw{code:400, message:'FORM_NOT_FOUND'}

            return res.status(200).json({
                status: true,
                message: 'FORM_FOUNDED',
                form
            })
        } catch (err) {
            return res.status(err.code || 500).json({
                status: false,
                message: err.message
            })
        }
    }

    async update(req,res){
        try{
            if(!req.params.id) throw{code:400, message:'REQUIRED_ID_FORM'}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw{code:400, message:'ID_NOT_VALID'}

            const form = await Form.findOneAndUpdate({_id:req.params.id, userId:req.jwt.id},req.body)
            if(!form) throw{code:400, message:'FORM_UPDATE_FAILED'}

            return res.status(200).json({
                status: true,
                message:'FORM_UPDATE_SUCCESS',
                form
            })


        }catch (err) {
            return res.status(err.code || 500).json({
                status: false,
                message: err.message
            })
        }
    }
}

export default new FormController()