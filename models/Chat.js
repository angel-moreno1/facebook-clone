import mongoose from 'mongoose'

const { Schema, model } = mongoose

const chatSchema = Schema(
    {
        reference: { type: String, required: true, unique: true },
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
    },
    { timestamps: true }
)

const Chat = model('Chat', chatSchema)

export default Chat