const settings = require('../_shared/settings');
const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const OmxManager = require('omx-manager');

const VIDEO_DIR = './videos',
      VIDEO_EXT = '.mp4';

const manager = new OmxManager();
manager.setVideosDirectory(VIDEO_DIR);
manager.setVideosExtension(VIDEO_EXT);



// connect to socket server
var socketUrl = `http://${settings.server.host}:${settings.server.port}`,
    socket = io.connect(socketUrl);

console.log('connecting to socket server', socketUrl);
socket.on('connect', () => console.log('connected to socket server', socketUrl));


// omxplayer instance
var video;

// initial default video
setDefaultVideo();



function setVideo(name, opts){
    opts = opts || {};
    // check that file exists 
    const filePath = path.resolve(VIDEO_DIR, name+VIDEO_EXT);
    if(!fs.existsSync(filePath)) return;


    if(video && video.getStatus && video.getStatus().playing){
        video.stop();
    }
    video = manager.create(name, { 
        '--loop': !!opts.loop,
        '--blank': true, 
        //'--refresh': true 
    });
    video.play();

    sendMessage('info', 'play', video.getStatus());

    video.on('end', function(){
        console.log('video ended, back to default...');
        setDefaultVideo();
    });
}

function setDefaultVideo(){
    setVideo('default', { loop: true });
}

function sendMessage(type, action, data){
    if(!socket || !socket.emit) {
        console.error('Tried to send message, but no socket: ', socket);
        return;
    }
    socket.emit(type, {
        sender: 'video',
        action: action,
        data: data
    });
}