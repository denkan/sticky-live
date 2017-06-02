const settings = require('../_shared/settings');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const HOST = settings.server.host;
const PORT = settings.server.port;


app.use(express.static('public'));

io.on('connection', function(socket){

  // broadcast all "commands" to everybody
  socket.on('command', data => {
    console.log(`### COMMAND from ${socket.id}`, data);
    socket.broadcast.emit('command', data)
  });

  // info messages, for server only
  socket.on('info', data => {
    console.log(`### INFO from ${socket.id}`, data);
  });

});

http.listen(PORT, function(){
  console.log(`SERVER listening on ${HOST}:${PORT}`);
});