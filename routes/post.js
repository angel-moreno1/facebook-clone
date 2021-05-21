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
    getOnlyVideosPostController,
    likeCommentController,
    createSubCommentController
} from '../controllers/post.js'

const postRouter = Router()

postRouter.get('/', getAllPostController)
postRouter.get('/:uid/posts', isAuth, getAllByUserController)
postRouter.get('/:id', getSinglePostController)
postRouter.get('/videos/all', isAuth, getOnlyVideosPostController)
postRouter.post('/', isAuth, upload.single('file'), createPostController)
postRouter.put('/:id/comment', isAuth, createCommentController)
postRouter.put('/:id/like', isAuth, createLikeController)
postRouter.delete('/:id', isAuth, deletePostController)
postRouter.put('/:id/comment/like', isAuth, likeCommentController)
postRouter.put('/:commentId/comment/sub', isAuth, createSubCommentController)

export default postRouter