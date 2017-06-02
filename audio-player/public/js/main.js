(function ($) {
    var audioFiles = [];
    var jPlayer, $jPlayer, $html;

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
    }

}(jQuery))