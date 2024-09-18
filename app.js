var express = require('express')
const cors = require('cors')
var app = express()
app.use(cors())
var server = require('http').createServer(app)
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
var port = process.env.PORT || 3000

server.listen(port, function () {
    console.log('Server listening at port %d', port)
})

const clients = new Map()
const sessions = new Map()

io.on('connection', function (socket) {
    socket.on('reply', function (data) {
        console.log(data)
        const { key } = data
        const client = clients.get(key)

        if (client) {
            client.emit('answer', data)
            // clients.delete(key)
        }
    })

    socket.on('setSession', data => {
        sessions.set(data.key, data)
    })

    socket.on('getSession', key => {
        const session = sessions.get(key)
        console.log(key, session)

        socket.emit('getSession', session)
        // sessions.delete(key)
    })

    socket.on('key', function (key) {
        clients.set(key, socket)
    })
})
