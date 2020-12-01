function Game(){
	
} 

Game.prototype.start = function(){
	
	var score = new Score();
	
	var background = new Background();
	background.refresh();

	
	var marqueursManager = new MarqueursManager(Partition, score);
	var audioManager = new AudioManager(marqueursManager);

    audioManager.start(function(){
		// When audios are loaded, whe can run timeline
		marqueursManager.start();
	});
	
	var lignes = [];
	for(var i=0;i<Partition.length;i++){	
		lignes.push(new Ligne());
		lignes[i].load(Util.getXPositionFromIdAndCount(i,Partition.length), i);
		lignes[i].refresh();
	}
		
	var keyboard = new Keyboard();
	var validateHandler = function(){
        if(!Configuration.isModeEnter()) return;

		if(keyboard.keyIsActive(Keyboard.VALIDATE)){
			background.activate();
			background.refresh();
			// Check marqueurs from activated lines
            var linesToNotify = [];
			if(keyboard.keyIsActive(Keyboard.NUM_1)){
				linesToNotify.push(0);
			}
			if(keyboard.keyIsActive(Keyboard.NUM_2)){
                linesToNotify.push(1);
			}
            if(keyboard.keyIsActive(Keyboard.NUM_3)){
                linesToNotify.push(2);
            }
            if(keyboard.keyIsActive(Keyboard.NUM_4)){
                linesToNotify.push(3);
            }
            marqueursManager.downLines(linesToNotify);
		} else { 
			background.deactivate();
			background.refresh();
		}
	};
	var ligneChangeHandler = function(i, isActive){
					
		if(isActive){
            if(!lignes[i].isActive() || Configuration.isModeEnter()) {
                lignes[i].activate();
                if(!Configuration.isModeEnter()) {
                    marqueursManager.downLines([i]);
                }
            }
		} else {
			marqueursManager.upLine(i);
			lignes[i].deactivate();
		}
		lignes[i].refresh();
	};
	keyboard.addListener(Keyboard.VALIDATE, validateHandler);
	keyboard.addListener(Keyboard.NUM_1, function(){
		ligneChangeHandler(0, keyboard.keyIsActive(Keyboard.NUM_1));
	});
	keyboard.addListener(Keyboard.NUM_2, function(){
		ligneChangeHandler(1, keyboard.keyIsActive(Keyboard.NUM_2));
	});
    keyboard.addListener(Keyboard.NUM_3, function(){
        ligneChangeHandler(2, keyboard.keyIsActive(Keyboard.NUM_3));
    });
    keyboard.addListener(Keyboard.NUM_4, function(){
        ligneChangeHandler(3, keyboard.keyIsActive(Keyboard.NUM_4));
    });
	
};
