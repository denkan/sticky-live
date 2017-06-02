const settings = require('../_shared/settings');

const io = require('socket.io-client');


const socket = io.connect(`http://${settings.server.host}:${settings.server.port}`);

socket.on('connect', () => {});


socket.emit('command', {
    sender: 'video',
    action: 'hello',
    data: 'hey everybody!'
});