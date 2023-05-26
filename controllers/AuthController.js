import User from "../modules/User.js";
import emailExists from "../libraries/emailExist.js";
import bcrypt from 'bcrypt'
import jsonwebtoken, { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

const env = dotenv.config().parsed


const generateAccessToken = async(payload) => {
    return jsonwebtoken.sign({id: payload},env.JWT_ACCESS_SECRET_KEY, {expiresIn: env.JWT_ACCESS_EXPIRATION_TIME})
}
const generateRereshToken = async(payload) => {
    return jsonwebtoken.sign({id: payload},env.JWT_REFRESH_SECRET_KEY, {expiresIn: env.JWT_REFRESH_EXPIRATION_TIME})
}




class AuthController {
    async register(req,res) {
        try{
            if(!req.body.fullname) {throw{code:400,message:'FULLNAME_IS_REQUIRED'}}
            if(!req.body.email) {throw{code:400,message:'EMAIL_IS_REQUIRED'}}
            if(!req.body.password) {throw{code:400,message:'PASSWORD_IS_REQUIRED'}}
            if(req.body.password.length < 6) throw {code:400,message:'PASSWORD_MUST_6_CHARACTERS'}

            const isEmailExist = await emailExists(req.body.email)
            if(isEmailExist) throw{code:409,message:'EMAIL_ALREADY_EXISTS'}

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.password, salt)

            const user = await User.create({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hash
            })

            
            if(!user) {throw {code : 500, message: "Internal Error"}}
            return res.status(200)
                            .json({
                                status : true,
                                message : 'USER_CREATED_SUCCESS',
                                user
                            })
        }
        catch(err){
            return res.status(err.code||500)
                            .json({
                                status: false,
                                message: err.message
                            })
        }
    }

    async login(req, res){
        try{
            if(!req.body.email) {throw{code:400,message:'EMAIL_IS_REQUIRED'}}
            if(!req.body.password) {throw{code:400,message:'PASSWORD_IS_REQUIRED'}}

            const user = await User.findOne({email:req.body.email})
            if(!user) {throw{code:400,message:'USER_NOT_FOUND'}}

            const isPasswordValid = await bcrypt.compareSync(req.body.password, user.password)
            if(isPasswordValid) {throw{code:400,message:'PASSWORD_INVALID'}}

            const accessToken = await generateAccessToken(user.id)
            const refreshToken = await generateRereshToken(user.id)
            return res.status(200)
                            .json({
                                status : true,
                                message : 'USER_LOGIN_SUCCESS',
                                fullname: user.fullname,
                                accessToken,
                                refreshToken
                            })
        }
        catch(err){
            return res.status(err.code||500)
                            .json({
                                status: false,
                                message: err.message
                            })
        }
    }
    async refreshToken(req,res){
        try{
            if(!req.body.refreshToken) {throw {code: 400, message:'REFRESH_TOKEN_SI_REQUIRED'}}

            let payload = {id: verify. id}
            const accessToken = await generateAccessToken(payload.id)
            const refreshToken = await generateRereshToken(payload.id)

            return res.status(200)
                            .json({
                                status : true,
                                message : 'REFRESH_TOKEN_SUCCESS',
                                accessToken,
                                refreshToken
                            })
        }
        catch(err){

            if(err.message == 'jwt expired'){
                err.message = 'REFRESH_TOKEN_EXPIRED'
            } else if(err.message == 'invalid signature' ||
                      err.message == 'jwt malformed' ||
                      err.message == 'jwt must be provide' ||
                      err.message == 'invalid token'){
                        err.message = 'INVALID_TOKEN'
            }

            return res.status(err.code).json({ status: false, message: err.message})

        }
    }
}

export default new AuthController()
