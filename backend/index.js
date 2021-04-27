import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import Message from './models/Message.js'
import Chat from './models/Chat.js'

const httpSever = createServer(app)
const io = new Server(httpSever, { cors: {origin: '*'} })

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

    client.on('messages', async ({ chatId, message, friendId }) => {
        const userThatSendMessage = onlineUsers.find(user => user.socketId === client.id)
        
        try {
            const chatExist = await Chat.findById(chatId)
            if(chatExist){
              const createdMessage = await Message.create({ user: userThatSendMessage.userId, message })
              chatExist.messages = [...chatExist.messages, createdMessage._id]
              await chatExist.save()
              const msg = await Message.findById(createdMessage._id).populate({ path: 'user', select: 'name lastName profile_photo' })
              io.emit('newMessage', msg)
            }
          } catch (error) {
              console.log('an error occur', error)
          }
    })
})

const PORT = process.env.PORT || 3001

httpSever.listen(PORT, () => void console.log('running at port', PORT))