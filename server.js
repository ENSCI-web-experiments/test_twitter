const path = require('path')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const Twit = require('twit')
const T = new Twit({
    consumer_key: 'gbDE9S0htGnaQaMcQY1GWZpVu',
    consumer_secret: 'vnchb5k9IBRu3skflBI4qcrhBN4YjT9aoLqRXLEkrgGCDabxAQ',
    access_token: '17386789-Wxu3jES772hU2FLV9uQVFlqReakMYDRIfcOeSwBiy',
    access_token_secret: 'N4R0psxdlomaz4TGIjvKop7jjglULYpaDGZ09a4HIZNXf',
    timeout_ms: 60 * 1000,
    strictSSL: true,
})

let streams = {}
let clients = {}
let defaultKeyword = '#testensci'

streams[defaultKeyword] = T.stream('statuses/filter', { track: defaultKeyword })
streams[defaultKeyword].on('tweet', (tweet) => {
    for (let id in clients) {
        if (clients[id].keyword === defaultKeyword) {
            clients[id].socket.emit('tweet', {
                tweet: tweet,
                keyword: defaultKeyword
            })
        }
    }
})

server.listen(8080)

app.use(require('express').static(path.join(__dirname, 'client')))

io.on('connection', (socket) => {
    if (clients[socket.id] === undefined) {
        clients[socket.id] = {
            socket: socket,
            keyword: defaultKeyword
        }
        socket.emit('connected', {
            id: socket.id,
            keyword: defaultKeyword
        })
    }
    socket.on('keyword', (data) => {
        let keyword = data.keyword
        clients[socket.id].keyword = keyword
        if (streams[keyword] === undefined) {
            streams[keyword] = T.stream('statuses/filter', { track: keyword })
            streams[keyword].on('tweet', (tweet) => {
                for (let id in clients) {
                    if (clients[id].keyword === keyword) {
                        clients[id].socket.emit('tweet', {
                            tweet: tweet,
                            keyword: keyword
                        })
                    }
                }
            })
        }
    })
})
