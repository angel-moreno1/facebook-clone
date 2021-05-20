import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import app from './app.js'
import Message from './models/Message.js'
import Chat from './models/Chat.js'

dotenv.config()

const httpSever = createServer(app)
const io = new Server(httpSever, { cors: {origin: '*'} })
const PORT = process.env.PORT

let onlineUsers = []

io.on('connection', client => {
    console.log('user connected')
    onlineUsers = [...onlineUsers, {userId: 'anonimo', socketId: client.id}]

    client.on('newPost', post => {
        client.broadcast.emit('newPost', post)
    })

    client.on('updateUserId', id => {
        onlineUsers = onlineUsers.map(user =>  user.socketId === client.id ? {...user, userId: id } : user )
    })

    client.on('disconnect', () => {
        console.log('user has left')
        onlineUsers = onlineUsers.filter(user => user.socketId !== client.id)
    })

    client.on('joinChat', async ({ userId, ref }) => {
        // const subscribeUser = onlineUsers.find(user => user.userId === userId)
        const socketsInRom = (await io.sockets.in(ref).allSockets()).size
        if(socketsInRom > 2) {
            return
        }else {
            await client.join(ref)
        }

    })

    client.on('messages', async data => {
        const { chatId, message, ref, isFile } = data        
        try {
            const userThatSendMessage = onlineUsers.find(user => user.socketId === client.id)
            const chatExist = await Chat.findById(chatId)
            if(chatExist){
                client.broadcast.in(ref).emit('newMessageNotifycation')
                if(isFile) {
                    const createdMessage = await Message.create({ user: userThatSendMessage.userId, message, isFile: true })
                    chatExist.messages = [...chatExist.messages, createdMessage._id]
                    await chatExist.save()
                    const msg = await Message.findById(createdMessage._id).populate({ path: 'user', select: 'name lastName profile_photo' })
                    io.in(ref).emit('newMessage', { msg, chatId, isFile: true })
                }else {
                    const createdMessage = await Message.create({ user: userThatSendMessage.userId, message })
                    chatExist.messages = [...chatExist.messages, createdMessage._id]
                    await chatExist.save()
                    const msg = await Message.findById(createdMessage._id).populate({ path: 'user', select: 'name lastName profile_photo' })
                    io.in(ref).emit('newMessage', { msg, chatId })
                } 
            }
          } catch (error) {
              console.log('an error occur', error)
          }
    })
})

httpSever.listen(PORT, () => void console.log('running at port', PORT))