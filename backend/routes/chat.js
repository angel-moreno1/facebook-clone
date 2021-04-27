import { Router } from 'express'
import { 
  createSendChatController,
  createMessageController,
  getSingleChatController,
  getLatestChatsByUserController
} from '../controllers/chat.js'

const chatRouter = Router()

chatRouter.post('/:id', createSendChatController)
chatRouter.put('/send', createMessageController )
chatRouter.get('/:id/latest', getLatestChatsByUserController)
chatRouter.get('/:id', getSingleChatController)
  
export default chatRouter