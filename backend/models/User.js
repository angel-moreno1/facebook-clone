import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String, 
            default: 'user'
        },
        active: { 
            type: Boolean,
            default: false 
        },
        profile_photo: {
            type: String, 
            default: '/uploads/default_user_photo.png'
        },
        cover_photo: {
            type: String, 
            default: '/uploads/cover_default_photo.jfif'
        },
        from: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
    },
    { timestamps: true }
)

const User = model('User', userSchema)

export default User