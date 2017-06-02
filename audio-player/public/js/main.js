(function ($) {
    var audioFiles = [];

    $(document).ready(function () {
        $player = $('#player');

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
        new jPlayerPlaylist({
            jPlayer: '#jquery_jplayer_1',
            cssSelectorAncestor: '#jp_container_1'
        }, audioFiles, {
            swfPath: '/js',
            supplied: 'mp3',
            wmode: 'window',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true
        });
    }


}(jQuery))