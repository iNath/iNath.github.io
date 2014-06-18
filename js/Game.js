function Game(){
	
} 

Game.prototype.start = function(){
	
	var score = new Score();
	
	var background = new Background();
	background.refresh();
	
	
	var marqueursManager = new MarqueursManager(Partition, score);
	marqueursManager.start();
	
	document.getElementById('audio').play();
	
	var lignes = [];
	for(var i=0;i<Partition.length;i++){	
		lignes.push(new Ligne());
		lignes[i].load(Util.getXPositionFromIdAndCount(i,Partition.length), i);
		lignes[i].refresh();
	}
		
	var keyboard = new Keyboard();
	var validateHandler = function(){
		if(keyboard.keyIsActive(Keyboard.VALIDATE)){
			background.activate();
			background.refresh();
			// Check marqueurs from activated lines
			if(keyboard.keyIsActive(Keyboard.NUM_1)){
				marqueursManager.downLine(0);
			}
			if(keyboard.keyIsActive(Keyboard.NUM_2)){
				marqueursManager.downLine(1);				
			}
            if(keyboard.keyIsActive(Keyboard.NUM_3)){
                marqueursManager.downLine(2);
            }
            if(keyboard.keyIsActive(Keyboard.NUM_4)){
                marqueursManager.downLine(3);
            }
		} else { 
			background.deactivate();
			background.refresh();
		}
	};
	var ligneChangeHandler = function(i, isActive){
					
		if(isActive){
			lignes[i].activate();
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
	
	/*
	var marqueur = new Marqueur();
	marqueur.load(50, 20);
	marqueur.refresh();
	marqueur.end();
	
	
	var lignes = [];
	
	lignes.push(new Ligne());
	lignes[0].init();
	lignes[0].load(100, 0);
	lignes[0].refresh();
	
	lignes.push(new Ligne());
	lignes[1].init();
	lignes[1].load(130, 1);
	lignes[1].refresh();
	
	var keyboard = new Keyboard();
	var validateHandler = function(){
		var isActive = keyboard.keyIsActive(Keyboard.VALIDATE);
		if(isActive){
			// Check marqueurs from activated lines
			if(keyboard.keyIsActive(Keyboard.NUM_1)){
				
			}
			if(keyboard.keyIsActive(Keyboard.NUM_2)){
				
			}
			if(keyboard.keyIsActive(Keyboard.NUM_3)){
				
			}
		}
	};
	var ligneChangeHandler = function(i, isActive){
		if(isActive){
			lignes[0].activate();
		} else {
			lignes[0].deactivate();
		}
		lignes[0].refresh();
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
	*/
};
