const settings = require('../_shared/settings');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket){

  // broadcast all "commands" to everybody
  socket.on('command', data => socket.broadcast.emit('command', data));

  // ping pong privately
  socket.on('ping', data => {
    console.log(`ping from ${socket.id}`);
    socket.emit('pong', data);
  });

});

http.listen(settings.ws.port, function(){
  console.log(`listening on ${settings.ws.host}:${settings.ws.port}`);
});