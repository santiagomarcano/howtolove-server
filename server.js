const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    // allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})
const cors = require('cors')

const state = {}
const messages = []

app.use(cors())

app.get('/state', (req, res) => {
  res.json(state)
})

io.on('connection', socket => {
  socket.on('position', data => {
    state[data.username] = {
      ...data
    }
    socket.emit('state', state)
  })
  socket.on('message', data => {
    messages.push(data)
    console.log(socket)
    socket.emit('chat', messages)
  })
  socket.emit('chat', messages)
  setInterval(() => {
    socket.emit('chat', messages)
  }, 1000)
})

server.listen(process.env.PORT || 4000, () => {
  console.log('listening on *:4000')
})
