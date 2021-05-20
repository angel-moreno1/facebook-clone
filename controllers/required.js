import User from "../models/User.js"
import jwt from 'jsonwebtoken'

export const verifyEmail = async (req, res) =>  {
    const decode = jwt.verify(req.params.id, process.env.JWT_SECRET)
    await User.findOneAndUpdate({ email: decode }, { active: true })
    res.status(202)
}


export const uploadFile = (req, res) => {
    res.json({ location: `http://localhost:3001/uploads/${req.file.filename}` })
}