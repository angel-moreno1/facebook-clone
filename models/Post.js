import mongoose from 'mongoose'

const { Schema, model } = mongoose

const postSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String },
        file: {  type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        filling: { type: String, default: '' }
    },
    { timestamps: true }
)

const Post = model('Post', postSchema)

export default Post