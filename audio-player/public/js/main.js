(function ($) {
    var audioFiles = [];
    var $html, jPlayer, $jPlayer,
        settings, socket, connected;

    $(document).ready(function () {
        $html = $('html');
        initAudioFiles(initPlayer);
    });


    function initAudioFiles(callback) {
        $.getJSON('/audios', function (files) {
            audioFiles = files.map(function (f) {
                return {
                    title: f,
                    mp3: '/audios/' + f
                }
            });
            callback && callback(audioFiles)
        });
    }


    function initPlayer() {
        var jPlayerSelector = '#jquery_jplayer_1';
        $jPlayer = $(jPlayerSelector);

        $jPlayer.bind($.jPlayer.event.ready + ".denk", onPlayerLoaded);
        $jPlayer.bind($.jPlayer.event.setmedia + ".denk", function disableAutoPlay(){
            setTimeout($.jPlayer.pause, 0);
        });

        jPlayer = new jPlayerPlaylist({
            jPlayer: jPlayerSelector,
            cssSelectorAncestor: '#jp_container_1'
        }, audioFiles, {
            swfPath: '/js',
            supplied: 'mp3',
            wmode: 'window',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: false,
            keyEnabled: true,
            playlistOptions: {
                autoPlay: false
            },
        });
    }

    function onPlayerLoaded(){
        $html.addClass('player-loaded');

        initSocket();
    }

    function initSettings(callback){
        $.getJSON('/settings', function(data){
            settings = data;
            callback && callback(data);
        });
    }

    
    function toggleRemote(){
        $html.toggleClass('remote-active');
    }
    function isRemoteAvailable(){
        return (window.location.search.toLowerCase() === '?remote');
    }
    function isRemote(){
        return isRemoteAvailable() && $html.hasClass('remote-active');
    }

    function initSocket(){
        if(!settings) return initSettings(initSocket);

        const socketUrl = 'http://'+settings.server.host+':'+settings.server.port;
        $('.server-host').text(socketUrl);

        // socket.io
        socket = io(socketUrl, {
            // options
        }); 

        socket.on('connect', _onConnect);
        socket.on('reconnect', _onConnect);
        socket.on('disconnect', _onDisconnect);
        socket.on('reconnecting', _onReconnecting);
        socket.on('reconnect_error', _onDisconnect);
        socket.on('reconnect_failed', _onDisconnect);
        socket.on('command', _listenForCommands);

        $jPlayer.bind($.jPlayer.event.play + '.denk', _sendPlay);
        //$jPlayer.bind($.jPlayer.event.timeupdate + '.denk', _sendPlayStatus);
        $jPlayer.bind($.jPlayer.event.pause + '.denk', _sendStop);

        var reconnectTimer;

        function _onConnect(){
            clearTimeout(reconnectTimer);
            connected = true;
            $html.removeClass('connecting').addClass('connected');

            if(isRemoteAvailable()){
                $html.addClass('remote');
                $('#remote-bar').unbind('click').bind('click', toggleRemote);
            }
        }
        function _onDisconnect(){
            connected = true;
            $html.removeClass('connected').removeClass('connecting');
        }
        function _onReconnecting(){
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(function(){
                $html.addClass('connecting');
            }, 1000);
        }

        function _playerStatus(jPlayerEvent){
            var fileName = '/'+jPlayerEvent.jPlayer.status.src;
            fileName = fileName.substr(fileName.lastIndexOf('/')+1);

            return {
                fileName: fileName,
                paused: jPlayerEvent.jPlayer.status.paused,
                ended: jPlayerEvent.jPlayer.status.ended,
                duration: jPlayerEvent.jPlayer.status.duration,
                currentTime: jPlayerEvent.jPlayer.status.currentTime
            }
        }
        function _createMessage(action, data){
            return {
                sender: 'audio-player',
                action: action,
                data: data
            }
        }
        var _sendMessageTimer = null;
        function _sendMessage(type, action, data){
            // add delay due to play/pause issue at player
            clearTimeout(_sendMessageTimer);
            _sendMessageTimer = setTimeout(function(){
                socket.emit(type, _createMessage(action, data));
            }, 250);            
        }

        function _sendPlay(e){
            //console.log('_sendPlay', arguments);
            _sendMessage('command', isRemote()?'remote_play':'play', _playerStatus(e));
        }
        function _sendPlayStatus(e){
            //console.log('_sendPlayStatus', arguments);
            _sendMessage('command', 'playing', _playerStatus(e));
        }
        function _sendStop(e){
            //console.log('_sendStop', arguments);
            _sendMessage('command', isRemote()?'remote_stop':'stop', _playerStatus(e));
        }

        
        function _listenForCommands(data){
            //console.log('command', data);
            if(isRemote()) return;
            _onCommandDo(data, 'audio-player', 'remote_play', _playByRemote);
            _onCommandDo(data, 'audio-player', 'remote_stop', _stopByRemote);
        }

        function _onCommandDo(data, matchSender, matchAction, callback){
            data = data || {};
            data.sender = (data.sender+'').toLowerCase();
            data.action = (data.action+'').toLowerCase();
            
            if(data.sender === matchSender && data.action === matchAction){
                return callback(data.data);
            }
        }

        function _trackIndexByFileName(fileName){
            return audioFiles.findIndex(function(f){
                return '/audios/'+fileName === f.mp3;
            });
        }

        function _playOrPauseByRemote(playOrPause ,data){
            data = data || {};
            var trackIndex = _trackIndexByFileName(data.fileName);

            // select track
            if(trackIndex >= 0) {
                jPlayer.select(trackIndex);
            }
            // after selecting, play/pause at given time
            setTimeout(function(){
                $jPlayer.jPlayer(playOrPause, data.currentTime || 0);
            }, 0);
        }
        function _playByRemote(data){
            _playOrPauseByRemote('play', data);
        }
        function _stopByRemote(data){
            _playOrPauseByRemote('pause', data);
        }

    }

}(jQuery))