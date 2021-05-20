import { Router } from 'express'
import { 
  getAllUsersController,
  createUserController,
  loginUserController,
  getSingleUserController,
  AddFriendController,
  updatedUserController,
  searchUserController,
  getUserFriendsController,
  friendsSugesstion
} from '../controllers/user.js'
import isAuth from '../middlewares/auth.js'
import uploads from '../middlewares/uploads.js'

const userRouter = Router()

userRouter.get('/', getAllUsersController)  
userRouter.get('/:id',  getSingleUserController)  
userRouter.get('/find/user', searchUserController)  
userRouter.post('/register', createUserController)
userRouter.post('/login', loginUserController)
userRouter.put('/:id', isAuth, uploads.single('profile_photo'),  updatedUserController)
userRouter.put('/friend/add', isAuth, AddFriendController)
userRouter.get('/:id/friend/all', getUserFriendsController)
userRouter.get('/user/suggestion/:id', friendsSugesstion)

export default userRouter