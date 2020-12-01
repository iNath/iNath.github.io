function AudioManager(marqueursManager){
    this.marqueursManager = marqueursManager;
}

AudioManager.prototype.start = function(cb){

    this.marqueursManager.addListener(MarqueursManager.EVENT_FAIL, function(){
        document.getElementById('audio-guitar').volume = 0;
    });
    this.marqueursManager.addListener(MarqueursManager.EVENT_ACTIVE, function(){
        document.getElementById('audio-guitar').volume = 1;
    });

    var guitare = document.getElementById('audio-guitar'),
        song = document.getElementById('audio-song'),
        audioLoaded = 0,
        onAudioCanPlay = function(){
            console.trace(arguments);
            audioLoaded++;
            if(audioLoaded == 2){
                guitare.play();
                song.play();
                cb();
            }
        };

    guitare.addEventListener('canplaythrough', onAudioCanPlay, false);
    song.addEventListener('canplaythrough', onAudioCanPlay, false);

    guitare.load();
    song.load();

};