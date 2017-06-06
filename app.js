const settings = require('./_shared/settings');

/**
 * start all apps
 */ 

// server
if(settings.server.enabled)
    require('./server/server.js');

// audio-player
if(settings.audioPlayer.enabled)
    require('./audio-player/audio-player.js');

// video
if(settings.video.enabled)
    require('./video/video.js');
