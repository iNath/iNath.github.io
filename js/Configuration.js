
	
Configuration = {
	width: 300,
	height: 400,
	velocity: 250, // px/sec
	getWrapper: function(){ return document.getElementById('game'); },
	getStyleMarqueurForLigne : function(i){
		return {
			width: 41,
			height: 25,
			offsetLeft: -20,
			offsetTop: -12,
            radius: 10,
			color: '#'+(i==0?'ee':'55')+(i==1?'ff':'33')+(i==2?'aa':'33')
		};
	},
	getStyleLigneForLigne: function(i){
		return {
			width: 3,
			color: '#'+(i==0?'ee':'55')+(i==1?'ff':'33')+(i==2?'aa':'33'),
            totalWidth: 51
		};
	},
	getAreaPositions: function(){
		return {
			reachable: { // Zone de touche
				height: 40,
				y: 340
			}
		};
	},
    getLog: function(){
        return {
            info: document.getElementById('log')
        };
    }
};