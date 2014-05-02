function Score(){

	this.total = 0;
	this.combo = 0;
	this.conteneur = document.getElementById('score');
	this.conteneurSkill = document.getElementById('skill');
	this.conteneurCombo = document.getElementById('combo');
}

Score.prototype.add = function(toAdd, long){
	
	toAdd = Math.ceil(toAdd);
	
	if(toAdd == 0) return;
	
	this.total += toAdd;
	if(!long){
		var text = '';
		if(toAdd >= 95){
			text = 'PERFECT';
		} else if(toAdd >= 80){
			text = 'NICE';
		} else if(toAdd >= 50){
			text = 'GOOD';
		} else if(toAdd >= 30){
			text = 'OK';
		} else {
			text = 'UGLY';
		}
		this.conteneurSkill.innerHTML = toAdd + ' ' +text;
		
		this.combo += 1;
	}
	
	this._refresh();
};

Score.prototype.fail = function(){
	this._refresh();
	this.combo = 0;
};

Score.prototype._refresh = function(){
	this.conteneur.innerHTML = this.total;
	this.conteneurCombo.innerHTML = this.combo;
};
