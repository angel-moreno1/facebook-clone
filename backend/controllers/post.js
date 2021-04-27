import fs from 'fs'
import Post from '../models/Post.js'
import Like from '../models/Like.js'
import Comment from '../models/Comment.js'

export const getAllPostController = async (req, res ) => {
    await Post.find({})
    .populate([{path: 'likes', select: 'user'}, { path: 'user', select: 'name lastName profile_photo' }])
    .sort({createdAt: -1}).exec((err, docs) => { 
        res.json(docs)
    });
}

export const createPostController = async (req, res, next) => {

    try {
        console.log(req.user)
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

export const getSinglePostController = async (req, res) => {
    try {    
        const id = req.params.id
        const post = await Post.findById(id)
    
        if(post) {
            Post.findById(id).populate([
                { path: 'user', select: 'name lastName' },
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
        }else {
            res.status(404).json({ message: 'post not found' })
        }
    } catch (error) {
        
    }   
}

export const createCommentController = async (req, res) => {
    const { id, text } = req.body
    const comment = await Comment.create({ user: id, text })
    const post = await Post.findById({_id: req.params.id})
    post.comments = [...post.comments, comment._id]
    const updated = await post.save()
    res.json(updated)
}

export const createLikeController = async (req, res) => {
    const type = req.body.type
    const userId = req.body.id
    const post = await Post.findById({ _id: req.params.id }).populate('likes', 'user')
    const alreadyFiveLike = post.likes.find(like => like.user == userId)
    if(alreadyFiveLike){
        post.likes = post.likes.filter(like => like._id !== alreadyFiveLike._id)
        const update = await (await post.save()).depopulate()
        return res.json(update)
    }else {
        const like = await Like.create({ user: userId, type })
        post.likes = [...post.likes, like._id]
        const updated = await (await post.save()).depopulate()
        res.json(updated)
    }
}

export const deletePostController = async (req, res, next) => {
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
  }
  
  export const addFriendController = async (req, res, next) => {
  
  }