function AudioManager(marqueursManager){
    this.marqueursManager = marqueursManager;
}

AudioManager.prototype.start = function(){

    this.marqueursManager.addListener(MarqueursManager.EVENT_FAIL, function(){
        document.getElementById('audio-guitar').volume = 0;
    });
    this.marqueursManager.addListener(MarqueursManager.EVENT_ACTIVE, function(){
        document.getElementById('audio-guitar').volume = 1;
    });

    document.getElementById('audio-guitar').play();
    document.getElementById('audio-song').play();
};