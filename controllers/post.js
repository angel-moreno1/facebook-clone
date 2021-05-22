import fs from 'fs'
import Post from '../models/Post.js'
import Like from '../models/Like.js'
import Comment from '../models/Comment.js'
import SubComment from '../models/SubComment.js'

export const getAllPostController = async (req, res ) => {
    await Post.find({})
    .populate([{ path: 'user', select: 'name lastName profile_photo' }, { path: 'likes', select: 'type user' }])
    .sort({createdAt: -1}).exec((err, docs) => { 
        res.json(docs)
    });
}

export const getOnlyVideosPostController = async (req, res, next) => {
    const videoReg = /[\/.](webm|mkv|flv|vob|mp4|ogv|ogg|drc|gif|gifv|mov|wmv|amv|m4p|mp2|flv)$/i
    try {
          await Post
                .find({})
                .populate([
                    { path: 'user', select: 'name lastName profile_photo' },
                    { path: 'comments', select: 'user text likes createdAt' },
                    { path: 'likes', select: 'user type' }
                ]).exec((err, doc) => {
                    Like.populate(doc.likes, { path: 'user', select: 'name lastName profile_photo' }, (err, likes) => {
                     doc.likes = likes
                    Comment.populate(doc.comments, { path: 'user', select: 'name lastName profile_photo' }, (err, comments) => {
                        doc.comments = comments
                        res.json(doc.filter(post => videoReg.test(post.file))) 
                        }) 
                    })
                })
    } catch (error) {
        next(error)
    }
}

export const createPostController = async (req, res, next) => {
    try {
        const user = req.user
        const { text } = req.body
        const file = req.file
        if(text && file) {
            const postCreated = await Post.create({ user: user._id, text, file: `/uploads/${req.file.filename}` })
            const post = await Post.findById(postCreated._id).populate({ path: 'user', select: 'name lastName profile_photo' })
            res.json(post)
        }else if (text){
            const postCreated = await Post.create({ user: user._id, text })
            const post = await Post.findById(postCreated._id).populate({ path: 'user', select: 'name lastName profile_photo' })
            res.json(post)
        }else {
            const postCreated = await Post.create({ user: user._id, file: `/uploads/${req.file.filename}` })
            const post = await Post.findById(postCreated._id).populate({ path: 'user', select: 'name lastName profile_photo' })
            res.json(post)
        }  
    } catch (error) {
        next(error)
    }
}

export const getAllByUserController =  async (req, res, next) => {
    try {
        const id = req.params.uid
        id ? 
        await Post
            .find({ user: id })
            .populate([
                { path: 'user', select: 'name lastName profile_photo' },
                { path: 'comments', select: 'user text likes createdAt' },
                { path: 'likes', select: 'user type' }
            ]).exec((err, doc) => {
                Like.populate(doc.likes, { path: 'user', select: 'name lastName profile_photo' }, (err, likes) => {
                doc.likes = likes
                Comment.populate(doc.comments, { path: 'user', select: 'name lastName profile_photo' }, (err, comments) => {
                        doc.comments = comments
                        res.json(doc) 
                    }) 
                })
            })
        : res.status(404).json({ message: 'Invalid Id' })
    } catch (error) {
        next(error)
    }
}

export const getCommentsController = async (req, res, next) => {
    try {
        const id = req.params.id
        Comment.findById(id).populate({ path: 'subcomments', select: 'user text likes respondTo'}).exec((err, doc) => {
            SubComment.populate(doc.subcomments, [{path: 'user', select: 'name lastName profile_photo'}, {path: 'respondTo', select: 'name lastName'}], (err, sub) => {
                doc.subcomments = sub
                res.json({subcomments: doc.subcomments})
            })
        }) 
    } catch (error) {
        next(error)
    }
}

export const getSinglePostController = async (req, res) => {
    try {    
        const id = req.params.id
        const post = await Post.findById(id)
    
        if(post) {
            Post.findById(id).populate([
                { path: 'user', select: 'name lastName profile_photo' },
                { path: 'comments', select: 'user text likes createdAt subcomments' },
                { path: 'likes', select: 'user type' }
            ]).exec((err, doc) => {
                Like.populate(doc.likes, { path: 'user', select: 'name lastName profile_photo' }, (err, likes) => {
                doc.likes = likes
                Comment.populate(doc.comments, { path: 'user', select: 'name lastName profile_photo' }, (err, comments) => {
                        doc.comments = comments
                        res.json(doc) 
                    }) 
                })
            })
        }else {
            res.status(404).json({ message: 'post not found' })
        }
    } catch (error) {
        
    }   
}

export const createCommentController = async (req, res, next) => {
    try {
        const { text } = req.body
        const comment = await Comment.create({ user: req.user._id, text })
        const post = await Post.findById(req.params.id)
        post.comments = [...post.comments, comment._id]
        await post.save()
        const commentAndUser = await Comment.findOne({_id: comment._id}).populate('user', 'name lastName profile_photo')
        res.json(commentAndUser)
    } catch (error) {
        next(error)
    }
   
}

export const createLikeController = async (req, res, next) => {
    try {
        const type = req.body.type
        const userId = req.user._id
        const post = await Post.findById(req.params.id).populate('likes', 'user')
        const alreadyGiveLike = post.likes.find(like => like.user == userId)
        if(alreadyGiveLike){
            post.likes = post.likes.filter(like => like._id !== alreadyGiveLike._id)
            const update = await post.save()
            return res.json(update)
        }else {
            const like = await Like.create({ user: userId, type })
            post.likes = [...post.likes, like._id]
            const updated = await post.save()
            res.json(updated)
        }
    } catch (error) {
        next(error)
    }
}

export const createSubCommentController = async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const { text, respondTo } = req.body
        const comment = await Comment.findById(commentId)
        const subComment = await  SubComment.create({ text, respondTo, user: req.user._id })
        comment.subcomments = [...comment.subcomments, subComment._id]
        await comment.save()
        res.json(comment)
    } catch (error) {
        next(error)
    }
}

export const likeCommentController = async (req, res, next) => {
    try {
        const {type, commentId} = req.body
        const post = req.params.id
        const userId = req.user._id 
        const comment = await Comment.findById(commentId).populate('likes', 'user')
        const alreadyGiveLike = comment.likes.find(
            like => like.user.toString() === userId.toString()
        )

        if(alreadyGiveLike) {
            comment.likes = comment.likes.filter(
                like => like._id !== alreadyGiveLike._id
            )
            const updated = await (await comment.save()).depopulate()
            return res.json(updated)
        }else {
            const like = await Like.create({ user: userId, type })
            comment.likes = [...comment.likes, like._id]
            const updated = await (await comment.save()).depopulate()
            res.json(updated)
        }
    } catch (error) {
        next(error)
    }
}

export const deletePostController = async (req, res, next) => {
    try {
        const { id } = req.params
        const postToDelete = await Post.findById(id)
        const img = postToDelete.file
        if(img) {
            fs.unlink(img, (err) => {
                if(err) {
                  res.json({error: err})
                }else {
                  Post.findByIdAndDelete(postToDelete._id)
                  res.status(200)
                }
            })
        }else {
            Post.findByIdAndDelete(postToDelete._id)
            res.status(200)
        }
    } catch (error) {
        next(error)
    }
  }