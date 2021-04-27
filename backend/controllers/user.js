import mailgun from 'mailgun-js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import emailTemplate from '../utils/emailTemplate.js'

const mg = mailgun(
    {
      apiKey: '3cd2e91b9e8ec0779644121b5dd3af07-a09d6718-7b273fc7',
      domain: 'sandboxb3aebf69717147e0b37de60fb6ef1e5e.mailgun.org'
    }
  )

export const getAllUsersController = async(_req, res, next) => {
    try {
      const user = await User.find({})
      res.json(user)
    } catch (error) {
      next(error)
    } 
}

export const createUserController = async (req, res, next) => {
    const { name, lastName, email, password } = req.body
   try {
     const userExist = await User.findOne({ email: email.trim() })
     if(userExist){
       return res.json('email already exists')
     }else {
      const passwordHashed = await bcrypt.hash(password, 10)
      const user = await User.create({ 
        name,
        lastName,
        email: email.trim(),
        password: passwordHashed })
      const msg = {
        from: 'Social Media <social@mg.media.com.mx>',
        to: 'angelmrsofa@gmail.com',
        subject: 'Social Media. please verify your account',
        html: emailTemplate(jwt.sign(email, 'some'))
      }
      mg.messages().send(msg, (error, body) => {
        if(error){
            return console.log(error);
        }
        console.log('body:', body);
      })
      res.json(user)
     }
   
    } catch (error) {
      next(error)
    }
    
}

export const loginUserController = async (req, res, next) => {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if(user){
        const correctPassword = await bcrypt.compare(password, user.password)
        if(correctPassword){
          return res.json({
            id: user._id,
            role: user.role,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
            profile_photo: user.profile_photo,
            cover_photo: user.cover_photo,
            from: user.from,
            address: user.address,
            description: user.description,
            friends: user.friends,
            chats: user.chats,
            token: jwt.sign(
              {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
              },
              'some'
            )
          })
        }else{
          return res.status(400).json({ error: 'email or password incorrect' })
        }
      }else {
        return res.status(400).json({ error: 'email or password incorrect' })
      }
    } catch (error) {
      next(error)
    }
}

export const updatedUserController = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
      Object.keys(req.body)
        .forEach(
          field => user[field] = req.body[field] 
        )
      const updatedUser = await user.save()
      res.json(updatedUser)
    } catch (error) {
      next(error)
    }
}

export const AddFriendController = async (req, res, next) => {
  try {
    const { id, FriendId } = req.body
    const userExist = await User.findById(id)
    const friendExist = await User.findById(FriendId)
  
    if(userExist && friendExist){
      const alreadyinList = userExist.friends.indexOf(friendExist._id) 
        if(alreadyinList !== -1) {
          res.status(404).json({ error: 'already in list' })
        } else {
          userExist.friends = [...userExist.friends, friendExist._id]
          friendExist.friends = [...friendExist.friends, userExist._id]
          await userExist.save()
          await friendExist.save()
          res.status(200).json({ message: 'successfully added as a friend' })
        }
    }
  } catch (error) {
    next(error)
  }
}


export const getSingleUserController = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    if(user) {
      res.json(user)
    }else{
      res.status(200).json({ error: 'not user found' })
    }
  } catch (error) {
    next(error)
  }
}