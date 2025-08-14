const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const connect = require('./config/database-config');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  // console.log('a user connected', socket.id);
  socket.on('join_room', (data) => {
    console.log("joining a room", data.roomid);
    socket.join(data.roomid, function(){
      console.log("joined a room");
    });
  });

  socket.on('msg_send', (data) => {
    console.log(data);
    io.to(data.roomid).emit('msg_rcvd', data);
    // socket.emit('msg_rcvd', data);
    // socket.broadcast('msg_rcvd', data);
  })

});

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/public'));


app.get('/chat/:roomid', (req, res) => {
  res.render('index', {
    name: 'Kalpana',
    id: req.params.roomid
  })
})

server.listen(3000, async() => {
    console.log('Server started');
    await connect();
    console.log('mongodb is connected');
})