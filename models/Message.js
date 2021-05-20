import mongoose from 'mongoose'

const { Schema, model } = mongoose

const messageSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        message: { type: String, required: true },
        isFile: { type: Boolean, default: false }
    },
    { timestamps: true }
)

const Message = model('Message', messageSchema)

export default Message