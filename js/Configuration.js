
	
Configuration = {
	width: 400,
	height: 200,
	getWrapper: function(){ return document.body; },
	getStyleMarqueurForLigne : function(i){
		return {
			width: 25,
			color: '#'+(i==0?'ff':'00')+(i==1?'ff':'00')+(i==2?'ff':'00')
		};
	},
	getStyleLigneForLigne: function(i){
		return {
			width: 4,
			color: '#'+(i==0?'ff':'00')+(i==1?'ff':'00')+(i==2?'ff':'00'),
		};
	}
};