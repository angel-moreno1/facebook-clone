import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import chatRouter from './routes/chat.js'
import required from './routes/required.js'
import unknownEndpoint from './middlewares/unknownEndpoint.js'
import errorHandler from './middlewares/errorHandler.js'

dotenv.config()

mongoose.connect(
    process.env.MONGODB_URL, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    }
).then(() => void console.log('connected to db'))
 .catch(() => void console.log('was an error while trying to connect to db'))
    
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

app.use('/api/users', userRouter)
app.use('/api/post', postRouter)
app.use('/api/chat', chatRouter)
app.use('/uploads', express.static('./uploads'))


app.use(required)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app