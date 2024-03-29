const express = require('express')
const app = express()
const port = 3000 
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const { User, Room } = require('./db')
const { default: mongoose } = require('mongoose')
require('dotenv').config();

const dbConnectionString = process.env.DB_CONNECTION_STRING;
mongoose.connect(dbConnectionString)

app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        methods: ['GET', 'POST'],
        credentials: true
    }
))

app.use(bodyParser.json())


// const USERS = [] // [{ email: ..., password: ... }, ...]

// const ROOMS = [] // [{ roomId: '...', people: ['sam@123', 'deepti@234'], chats: [{ sender: '', message: '' }] }]


const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    path: '/socket.io',
    cors: {
        origin: [process.env.FRONTEND_URL], // 'http://localhost:5173'
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('User Connected:', socket.id)

    socket.on('send', async (sender, message, roomId) => {

        await Room.findOneAndUpdate({ roomId }, {
            '$push': {
                chats: {
                    sender,
                    message
                }
            }
        })
        io.in(roomId).emit('receive', sender, message, roomId)
    })

    socket.on('add', async (sender, newContact, roomId) => {

        socket.join(roomId)
        await Room.create({ roomId, people: [sender, newContact], chats: [] })
        io.emit('add contact', sender, newContact, roomId)
    })

    socket.on('add receiver', (sender, newContact, roomId) => {
        socket.join(roomId)
    })

    socket.on('re-join rooms', (rooms) => {

        rooms.forEach(room => {
            socket.join(room.roomId)
        });
    })
})


app.post('/user', async (req, res) => {

    const email = req.body.email
    const password = req.body.password

    const alreadyExists = await User.findOne({ email })
    console.log('Does the user already exist?', alreadyExists)

    if (alreadyExists) {
        res.status(400).json({ signup: false, message: 'User already exists' })
    }
    else if (email === '' || password === '') {
        res.status(400).json({ signup: false, message: `${ email === '' ? 'Enter a valid email' : 'Enter a valid password' }` })
    }
    else {
        await User.create({ email, password })
        res.status(200).json({ signup: true, message: 'Added user', password })
    }
})

app.get('/user', async (req, res) => {
    
    const email = req.query.email
    const password = req.query.password

    const alreadyExists = await User.findOne({ email })
    console.log('Does the user already exist?', alreadyExists)

    if (!alreadyExists) {
        res.status(400).json({ login: false, message: 'User with this email doesn\'t exist' })
    }
    else if (alreadyExists.password !== password) {
        res.status(400).json({ login: false, message: 'Incorrect Password' })
    }
    else {
        res.status(200).json({ login: true, message: 'Logged in', password })
    }
})

app.get('/newContacts', async (req, res) => {
    const email = req.query.email

    const mongoContacts = await Room.find({ 
        people: {
            '$all': [email]
        }
    })
    const mongoContacts2 = mongoContacts.map(({ people }) => {
        const person = people.find(x => x !== email)
        return person
    })

    const mongoNewContacts = await User.find({
        email: { 
            '$nin': [...mongoContacts2, email] 
        }
    })
    const mongoNewContacts2 = mongoNewContacts.map(({ email }) => email)

    res.status(200).json(mongoNewContacts2)
})

app.post('/rooms', async (req, res) => {
    const email = req.body.email

    const filteredRooms = await Room.find({ 
        people: {
            '$all': [email]
        }
    })    
    res.status(200).json(filteredRooms)
})

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })