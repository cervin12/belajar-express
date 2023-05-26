import User from '../modules/User.js'

const emailExists = async (email) => {
    const emailUser = await User.findOne({email: email})
    if(emailUser) return true
    return false
}

export default emailExists