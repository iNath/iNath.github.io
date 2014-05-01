function MarqueursManager(partition){
	this.lignes = [];
	this.partition = partition;
	
	var configuration = Configuration.getAreaPositions().reachable;
	
	this.durationValidity = (configuration.height / Configuration.velocity) * 1000;
	this.delayInvalid = ((Configuration.height - configuration.height - configuration.y) / Configuration.velocity) * 1000; 
	this.delayShownUntouchable = (Configuration.height / Configuration.velocity) * 1000
								+ 200 // ecart forcé
								- this.delayInvalid
								- this.durationValidity
								;
	this.delayPreload = 500; // Temps de préchargement avant zone visible
	
	this.velocity = Configuration.velocity; // px/sec
	
	this.timeStart = 0;
	this.timeReference = 0;
	this.lastReload = 0;
	
	for(var i=0;i<partition.length;i++){
		this.lignes.push([]);
	}
}

MarqueursManager.prototype.start = function(){
	this.timeStart = Date.now();
	window.requestAnimationFrame((this._loop).bind(this));
};

MarqueursManager.prototype._loop = function(){
	this.timeReference = Date.now() - this.timeStart;
	
	// Reload eventually
	if(this.timeReference - this.lastReload >= this.delayPreload){
		this.lastReload = this.timeReference;
		this.reload();
	}
	
	this.refresh();
	window.requestAnimationFrame((this._loop).bind(this));
};

MarqueursManager.prototype.downLine = function(ligne){
	console.log('down ligne ' + ligne);
	for(var i=0;i<this.lignes[ligne].length;i++){
		if(this.isInReachableArea(this.lignes[ligne][i].getDelay())){
			this.lignes[ligne][i].down(this.timeReference);
			//break;
		}
	}
};

MarqueursManager.prototype.upLine = function(ligne){
	console.log('up ligne ' + ligne);
	for(var i=0;i<this.lignes[ligne].length;i++){
		//if(this.isInFailArea(this.lignes[ligne][i].getDelay())){
			this.lignes[ligne][i].up();
			//break;
		//}
	}
};

MarqueursManager.prototype.refresh = function(){
	var marqueur = null;
	for(var i=0;i<this.lignes.length;i++){
		for(var j=0;j<this.lignes[i].length;j++){
			marqueur = this.lignes[i][j];
			
			if(marqueur.isEnded()){
				// End it
				this.lignes[i].splice(j,1);
				j--;
				continue;
			}
			
			marqueur.setY(this.getYPosition(marqueur.getDelay()));
			marqueur.refresh();
			
			if(this.isInFailArea(marqueur.getDelay())){
				// Le marqueur est passé
				marqueur.fail();
			} else if(this.isInVisibleArea(marqueur.getDelay())){
				// Le marqueur est visible, on l'avance
				// marqueur.setY(this.getYPosition(marqueur.getDelay()));
				// marqueur.refresh();
			}
		}
	}
};

/**
 * On va :
 * - vider les marqueurs terminés
 * - précharger des marqueurs depuis la partition
 */
MarqueursManager.prototype.reload = function(){
	var marqueur = null;
	
	/*
	// Unload
	for(var i=0;i<this.lignes.length;i++){
		for(var j=0;j<this.lignes[i].length;j++){
			marqueur = this.lignes[i][j];
			if(marqueur.isEnded()){
				// End it
				this.lignes[i].splice(j,1);
				j--;
			}
		}
	}
	*/
	
	// Load
	for(var i=0;i<this.partition.length;i++){
		for(var j=0;j<this.partition[i].length;j++){
			if(this.isInLoadedArea(this.partition[i][j].delay)){
				marqueur = new Marqueur();
				marqueur.load(this.getXPosition(i), -100, this.partition[i][j].delay, 0, i);
				this.lignes[i].push(marqueur);
				this.partition[i].splice(j,1);
				j--;
			}
		}
	}
};

MarqueursManager.prototype.isInFailArea = function(delay){
	return delay < this.timeReference - this.durationValidity/2;
};

MarqueursManager.prototype.isInVisibleArea = function(delay){
	return delay > this.timeReference - this.durationValidity/2 - this.delayInvalid 
		&& delay < this.timeReference + this.durationValidity/2 + this.delayShownUntouchable;
};

MarqueursManager.prototype.isInLoadedArea = function(delay){
	return delay < this.timeReference + this.durationValidity/2 + this.delayShownUntouchable + this.delayPreload;
};

MarqueursManager.prototype.isInReachableArea = function(delay){
	return delay > this.timeReference - this.durationValidity/2
		&& delay < this.timeReference + this.durationValidity/2;
};



MarqueursManager.prototype.getYPosition = function(delay){
	var distance = (delay - this.timeReference) * this.velocity / 1000;
	var distanceBas = (this.durationValidity/2 + this.delayInvalid) * this.velocity / 1000;
	return Configuration.height - distance - distanceBas;
};

MarqueursManager.prototype.getXPosition = function(i){
	return Util.getXPositionFromIdAndCount(i, this.lignes.length);
};

