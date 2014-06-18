
	
Configuration = {
	width: 300,
	height: 400,
	velocity: 250, // px/sec
	getWrapper: function(){ return document.getElementById('game'); },
	getStyleMarqueurForLigne : function(i){
		return {
			width: 24,
			height: 10,
			offsetLeft: -12,
			offsetTop: -5,
			color: '#'+(i==0?'ee':'55')+(i==1?'ff':'33')+(i==2?'aa':'33')
		};
	},
	getStyleLigneForLigne: function(i){
		return {
			width: 2,
			color: '#'+(i==0?'ee':'55')+(i==1?'ff':'33')+(i==2?'aa':'33')
		};
	},
	getAreaPositions: function(){
		return {
			reachable: { // Zone de touche
				height: 40,
				y: 340
			}
		};
	}
};