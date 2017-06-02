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

    function initSocket(){
        if(!settings) return initSettings(initSocket);

        const socketUrl = 'http://'+settings.server.host+':'+settings.server.port;

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

        var reconnectTimer;

        function _onConnect(){
            clearTimeout(reconnectTimer);
            connected = true;
            $html.removeClass('connecting').addClass('connected');
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

    }

}(jQuery))