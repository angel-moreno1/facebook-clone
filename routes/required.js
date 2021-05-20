import { Router } from 'express'
import { verifyEmail, uploadFile } from '../controllers/required.js'
import upload from '../middlewares/uploads.js'

const requiredRouter = Router()

requiredRouter.post('/account/verified/:id', verifyEmail)
requiredRouter.post('/upload', upload.single('file'), uploadFile)

export default requiredRouter
