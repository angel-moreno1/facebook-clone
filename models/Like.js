import mongoose from 'mongoose'

const { Schema, model } = mongoose

const likeSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, required: true, default: 'like' }
    }
)


const Like = model('Like', likeSchema)

export default Like