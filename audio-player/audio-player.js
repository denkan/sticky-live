const settings = require('../_shared/settings');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');

const HOST = settings.client.host;
const PORT = settings.client.port;

const AUDIO_DIR = __dirname+'/audios';

app.use(express.static(__dirname+'/public'));

// get list of audio files
app.get('/audios', (req, res) => {
    fs.readdir(AUDIO_DIR, (err, files) => 
        res.json(files.filter(f => (''+f).toLowerCase().endsWith('.mp3')))
    );
});

// expose audios
app.use('/audios',express.static(AUDIO_DIR));


// expose settings
app.get('/settings', (req, res) => {
    res.json(settings);
});


// expose socket.io-client script
app.use('/socket.io',express.static('./node_modules/socket.io-client/dist'));



http.listen(PORT, function(){
  console.log(`AUDIO-PLAYER listening on ${HOST}:${PORT}`);
});