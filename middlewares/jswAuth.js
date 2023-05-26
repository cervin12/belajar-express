import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const jwtAuth = () => {
    return async (req,res,next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const verify = jsonwebtoken.verify(token, env.JWT_ACCESS_SECRET_KEY)
            req.jwt = verify
            console.log(verify)

            next()
        } catch (err) {
            if(err.message == 'jwt expired'){
                err.message = 'ACCESS_TOKEN_EXPIRED'
            } else if(err.message == 'invalid signature' ||
                      err.message == 'jwt malformed' ||
                      err.message == 'jwt must be provide' ||
                      err.message == 'invalid token'){
                        err.message = 'INVALID_ACCESS_TOKEN'
            }

            return res.status(err.code).json({ status: false, message: err.message})
        }
    }
}

export default jwtAuth