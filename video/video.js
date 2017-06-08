const settings = require('../_shared/settings');
const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const OmxManager = require('omx-manager');

const VIDEO_DIR = './videos',
      VIDEO_EXT = '.mp4';

const manager = new OmxManager();
manager.setVideosDirectory(path.resolve(__dirname,VIDEO_DIR));
manager.setVideosExtension(VIDEO_EXT);



// connect to socket server
var socketUrl = `http://${settings.server.host}:${settings.server.port}`,
    socket = io.connect(socketUrl);

console.info('[VIDEO]','connecting to socket server', socketUrl);
socket.on('connect', () => console.info('[VIDEO]','connected to socket server', socketUrl));

socket.on('command', listenForCommands);


// omxplayer instance
var video;

// initial default video
setDefaultVideo();



function setVideo(name, opts){
    opts = opts || {};
    // check that file exists 
    const filePath = path.resolve(VIDEO_DIR, name+VIDEO_EXT);
    if(!fs.existsSync(filePath)) return;


    console.log('[VIDEO]','set video...', name);
    if(video && video.getStatus){
        const status = video.getStatus();
        if(status.current === filePath && status.args['--loop'])
          return // looping same file atm = dont change
        if(status.playing)
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
        console.log('[VIDEO]','video ended, back to default...');
        setDefaultVideo();
    });
}

function setDefaultVideo(){
    setVideo('default', { loop: true });
}

function sendMessage(type, action, data){
    if(!socket || !socket.emit) {
        console.error('[VIDEO]', 'Tried to send message, but no socket: ', socket);
        return;
    }
    socket.emit(type, {
        sender: 'video',
        action: action,
        data: data
    });
}


function listenForCommands(data){
    onCommandDo(data, 'audio-player', 'play', playByAudioData);
    onCommandDo(data, 'audio-player', 'stop', setDefaultVideo);
}

function onCommandDo(data, matchSender, matchAction, callback){
    data = data || {};
    data.sender = (data.sender+'').toLowerCase();
    data.action = (data.action+'').toLowerCase();
    
    if(data.sender === matchSender && data.action === matchAction){
        return callback(data.data);
    }
}

function playByAudioData(audioData){
    let name = ((audioData||{}).fileName+'');
    name = name.substr(0, name.lastIndexOf('.'));
    console.log('[VIDEO]','set video by audio command...', name);
    setVideo(name);
}