import { Router } from 'express'
import { 
  createSendChatController,
  createMessageController,
  getSingleChatController,
  getLatestChatsByUserController
} from '../controllers/chat.js'
import isAuth from '../middlewares/auth.js'

const chatRouter = Router()

chatRouter.post('/', isAuth, createSendChatController)
chatRouter.put('/send', isAuth, createMessageController )
chatRouter.get('/:id/latest', getLatestChatsByUserController)
chatRouter.get('/:id', isAuth, getSingleChatController)
  
export default chatRouter