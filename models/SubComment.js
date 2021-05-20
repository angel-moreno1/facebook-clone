import mongoose from 'mongoose'

const { Schema, model } = mongoose

const subCommentSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    },
    { timestamps: true }
)

const subComment = model('subComment', subCommentSchema)

export default subComment