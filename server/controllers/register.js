const User = require('../db/model/user')

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(500).send('Please enter email and password')
    }
    const user = await User.findOne({ email });
    if(!user){
        return res.status(401).json({status: 1000, message: 'User not found!'})
    }
    const isCorrectPassword = await user.matchPassword(password);
    if(!isCorrectPassword){
        return res.status(401).json({status: 1000, message: 'Invalid Credentials'})
    }
    const token = await user.createJWT();
    res.cookie("token", token, { httpOnly: true, secure: false })
    return res.status(200).json({user: {
            name: user.name,
            email: user.email,
            isSuperAdmin: user.superAdmin
        }});
}
const loginOutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ logout: "logout successful" })

}

module.exports = {
    loginUser,
    loginOutUser
}
