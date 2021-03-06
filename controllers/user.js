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
       return res.status(400).json('email already exists')
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
        html: emailTemplate(jwt.sign(email, process.env.JWT_SECRET))
      }
      mg.messages().send(msg, (error, body) => {
        if(error){
            return console.log(error);
        }
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
            liveIn: user.liveIn,
            studiedAt: user.studiedAt,
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
              process.env.JWT_SECRET
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
      const user = await User.findById(req.user._id)
      if(req.file) {
        user.profile_photo = `/uploads/${req.file.filename}`
        await user.save()
        return res.json(`/uploads/${req.file.filename}`)
       }
        Object
        .keys(req.body)
        .forEach(
          field => user[field] = req.body[field] 
        )
      await user.save()
      res.json(res.json({
        id: user._id,
        role: user.role,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        profile_photo: user.profile_photo,
        cover_photo: user.cover_photo,
        from: user.from,
        liveIn: user.liveIn,
        studiedAt: user.studiedAt,
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
          process.env.JWT_SECRET
        )
      }))
    } catch (error) {
      next(error)
    }
}

export const AddFriendController = async (req, res, next) => {
  try {
    const { friendId } = req.body
    const userExist = await User.findById(req.user._id)
    const friendExist = await User.findById(friendId)
  
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


export const searchUserController = async (req, res, next) => {
  try {

    const { query } = req.query
    const allUsers = await User.find({})
    const findedUsers = allUsers.filter(
      user => user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 || user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    )

    res.json(
      findedUsers.length >= 1 
        ? findedUsers.map(
          user => ({ 
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            profile_photo: user.profile_photo
          })
        ) 
        : []
    )
  } catch (error) {
    next(error)
  }
}


export const getUserFriendsController = async (req, res, next) => {
  try {
    if(req.params.id) {
      const user = await User.findById(req.params.id)
      .populate('friends', 'name lastName profile_photo')
      res.json(user.friends)
    }
  } catch (error) {
    next(error)
  }
}

export const friendsSugesstion = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    const exclude = user.friends
    const sugesstions = await User.find({ _id: { $nin: [...exclude, user._id] } }).limit(13)
    res.json({data: sugesstions})
  } catch (error) {
    next(error)
  }
}