const settings = require('../_shared/settings');

const express = require('express');
const app = express();
const http = require('http').Server(app);

const HOST = settings.client.host;
const PORT = settings.client.port;

app.use(express.static('public'));

http.listen(PORT, function(){
  console.log(`AUDIO-PLAYER listening on ${HOST}:${PORT}`);
});