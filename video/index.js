const settings = require('../_shared/settings');
const io = require('socket.io-client');
const OmxManager = require('omx-manager');

const manager = new OmxManager();
manager.create('default.mp4', {'--loop': true});

const socket = io.connect(`http://${settings.server.host}:${settings.server.port}`);
socket.on('connect', () => {});



