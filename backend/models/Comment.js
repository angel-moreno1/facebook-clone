import mongoose from 'mongoose'

const { Schema, model } = mongoose

const commentSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
    },
    { timestamps: true }
)

const Comment = model('Comment', commentSchema)

export default Comment