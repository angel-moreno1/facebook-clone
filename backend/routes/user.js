import { Router } from 'express'
import { 
  getAllUsersController,
  createUserController,
  loginUserController,
  getSingleUserController,
  AddFriendController,
  updatedUserController,
} from '../controllers/user.js'

const userRouter = Router()

userRouter.get('/', getAllUsersController)  
userRouter.get('/:id', getSingleUserController)  
userRouter.post('/register', createUserController)
userRouter.post('/login', loginUserController)
userRouter.put('/:id', updatedUserController)
userRouter.put('/friend/add', AddFriendController)

export default userRouter