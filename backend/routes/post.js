import { Router } from 'express'
import isAuth from '../middlewares/auth.js'
import upload from '../middlewares/uploads.js'
import { 
    getAllPostController,
    createPostController,
    getAllByUserController,
    getSinglePostController,
    createCommentController ,
    createLikeController,
    deletePostController,
} from '../controllers/post.js'

const postRouter = Router()

postRouter.get('/', getAllPostController)
postRouter.get('/:uid/posts', getAllByUserController)
postRouter.get('/:id', getSinglePostController)
postRouter.post('/', isAuth, upload.single('file'), createPostController)
postRouter.put('/:id/comment', createCommentController)
postRouter.put('/:id/like', createLikeController)
postRouter.delete('/:id', deletePostController)

export default postRouter