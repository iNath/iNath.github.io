function Game(){
	
} 

Game.prototype.start = function(){
	
	var marqueur = new Marqueur();
	marqueur.init();
	marqueur.load(50, 20);
	marqueur.refresh();
	marqueur.end();
	
	var ligne = new Ligne();
	ligne.init();
	ligne.load(100, 0);
	ligne.activate();
	
	ligne = new Ligne();
	ligne.init();
	ligne.load(130, 1);
	
	var keyboard = new Keyboard();
	keyboard.addListener(Keyboard.VALIDATE, function(){ alert('validate!'); });
	
	window.setTimeout(function(){
		ligne.activate();
	},2000);
	
};
