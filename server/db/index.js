const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
})

const RoomSchema = new mongoose.Schema({
    roomId: String,
    people: [String, String],
    chats: [{
        sender: String,
        message: String
    }]
})

const User = mongoose.model('User', UserSchema)
const Room = mongoose.model('Room', RoomSchema)

module.exports = {
    User, 
    Room
}