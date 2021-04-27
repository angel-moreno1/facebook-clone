import User from '../models/User.js'
import Message from '../models/Message.js'
import Chat from '../models/Chat.js'

export const createSendChatController = async (req, res, next) => {
    try {
      const senderUserId = req.params.id.trim()
      const responderUserId = req.body.id.trim()
      const senderExist = await User.findById(senderUserId)
      const responderExist = await User.findById(responderUserId)
  
      if(senderExist && responderExist) {
        const chatExist = await Chat.findOne({ 
          $or: [
            { reference: senderUserId+responderUserId },
            { reference: responderUserId+senderUserId }
          ]
         })
        if(chatExist) {
          res.json(chatExist)
        }else {
          const message = await Message.create({ 
            user: senderExist._id,
            message: `${senderExist.name} ${senderExist.lastName} started a new conversation`  
          })
          const createdChat = await Chat.create({ reference: senderUserId+responderUserId, messages: [message._id] })
          senderExist.chats = [...senderExist.chats, createdChat._id]
          responderExist.chats = [...responderExist.chats, createdChat._id]
          await senderExist.save()
          await responderExist.save()
          res.json(createdChat)
        }
      }else {
        res.status(404).json({ message: 'Invalid ids' })
      }
    } catch (error) {
      next(error)
    }
  }

export const createMessageController = async (req, res, next) => {
    try {
      const { id, from, message } = req.body
      const chatExist = await Chat.findById(id)
      if(chatExist){
        const createdMessage = await Message.create({ user: from, message })
        chatExist.messages = [...chatExist.messages, createdMessage._id]
        const updatedChat = await chatExist.save()
        res.json(updatedChat)
      }else{
        res.status(404).json({ message: 'chat not found' })
      }
    } catch (error) {
      next(error)
    }
}

export const getLatestChatsByUserController = async (req, res, next) => {
  try {
    const { id } = req.params
    User.findById(id)
        .populate({ path: 'chats', select: 'messages' })
        .exec((err, doc) => {
          Message.populate(doc.chats, {path: 'messages', select: 'user message createdAt'}, (err, chats) => {
            doc.chats = chats
            User.populate(doc.chats, {path: 'messages.user', select: 'name lastName profile_photo'}, (err, chats) => {
              doc.chats = chats
              res.json({
                chats: doc.chats.map(
                  chat => ({
                    chatId: chat.id,
                    lastMessage: chat.messages[chat.messages.length -1],
                  })
                )
              })
            })
          })
        })
  } catch (error) {
    next(error)
  }
}

export const getSingleChatController = async (req, res, next) => {
  try {
    const { id } = req.params
    await Chat.findById(id).populate({ path: 'messages', select: 'user message createdAt' })
      .exec((err, doc) => {
        User.populate(doc.messages, {path: 'user', select: 'name lastName profile_photo'}, (err, messages) => {
          doc.messages = messages
          res.json(doc.messages)
        })
      })
  } catch (error) {
    next(error)
  }
}

export const getAllReferenceByUser = async (req, res, next) => {
  try {
    const { id } = req.params
    await User.findById(id)
    res.json()
  } catch (error) {
    next(error)
  }
}
