import mongoose from 'mongoose'

const { Schema, model } = mongoose

const subCommentSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
        respondTo: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
)

const SubComment = model('subComment', subCommentSchema)

export default SubComment