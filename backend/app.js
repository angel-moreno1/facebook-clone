import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import chatRouter from './routes/chat.js'
import upload from './middlewares/uploads.js'
import User from './models/User.js'

mongoose.connect('mongodb+srv://admin:reyescsp2001@cluster0.ux4rh.mongodb.net/fb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => void console.log('connected to db'))
    .catch(() => void console.log('was an error while trying to connect to db'))
    

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

app.use('/api/users', userRouter)
app.use('/api/post', postRouter)
app.use('/api/chat', chatRouter)

app.use('/uploads', express.static('./uploads'))

app.post('/account/verified/:id', async (req, res) => {
    const decode = jwt.verify(req.params.id, 'some')
    const user = await User.findOneAndUpdate({ email: decode }, { active: true })
    res.status(202)
})

app.post('/upload', upload.single('file'), (req, res) => {
    res.send(`http:localhost:3001/uploads/${req.file.filename}`)
})

app.use((req, res) => {
    res.status(404).send('unkown endpoint')
})
app.use((error, req, res, next) => {
    console.log(error)
    if(error.code === 11000){
        return res.status(400).json({ message: 'mongo error', error })
    }
    if(error) {
        return res.status(400).json({ message: 'was an error', error })
    }
})


export default app