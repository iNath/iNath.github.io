function MarqueursManager(partition, scoreManager){
	this.lignes = [];
	this.partition = partition;
	this.scoreManager = scoreManager;
    this.listeners = {
        fail: [],
        active: []
    };
    this.context = Util.createCanvas(200);
	
	var configuration = Configuration.getAreaPositions().reachable;
	
	this.durationValidity = (configuration.height / Configuration.velocity) * 1000;
	this.delayInvalid = ((Configuration.height - configuration.height - configuration.y) / Configuration.velocity) * 1000; 
	this.delayShownUntouchable = (Configuration.height / Configuration.velocity) * 1000
								+ 200 // ecart forcé
								- this.delayInvalid
								- this.durationValidity
								;
	this.delayPreload = 100; // Temps de préchargement avant zone visible
	
	this.velocity = Configuration.velocity; // px/sec
	
	this.timeStart = 0;
	this.timeReference = 0;
	this.lastReload = 0;
	
	for(var i=0;i<partition.length;i++){
		this.lignes.push([]);
	}
}

MarqueursManager.EVENT_FAIL = "EVENT_FAIL";
MarqueursManager.EVENT_ACTIVE = "EVENT_ACTIVE";

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

MarqueursManager.prototype.downLines = function(lignes){
    var nbTotalReached = 0;
    var marqueurToDown = [];
    var fail = false;

    for(var i=0;i<lignes.length;i++){
        var nbReachedPerLine = 0;
        for(var j=0;j<this.lignes[lignes[i]].length;j++){
            if(this.isInReachableArea(this.lignes[lignes[i]][j].getDelay())){
                //console.log('Down at ---> timeReference: ' +this.timeReference);
                nbTotalReached++;
                nbReachedPerLine++;
                //this.lignes[lignes[i]][j].down(this.timeReference);
                marqueurToDown.push(this.lignes[lignes[i]][j]);
                break;
            }
        }

		// Si une ligne a été tapée pour rien
        if(nbReachedPerLine == 0) {
            // et si il n'y a aucun marqueur actif dessus
            if(!this.lineHasActif(lignes[i])){
                // alors on fail tout
                fail = true;
            }
        }
    }

    // Si on a tapé ds le vide, c'est du fail pour tous
    if(nbTotalReached == 0) {
        fail = true;
    }

    if(!fail){
        for(var i=0;i<marqueurToDown.length;i++) {
            marqueurToDown[i].down(this.timeReference);
        }
    } else {
        this.failAll();
    }
};

MarqueursManager.prototype.upLine = function(ligne){
	for(var i=0;i<this.lignes[ligne].length;i++){
		this.lignes[ligne][i].up(this.timeReference);
	}
};

MarqueursManager.prototype.failAll = function(){
    for(var i=0;i<this.lignes.length;i++){
        for(var j=0;j<this.lignes[i].length;j++){
            if(this.lignes[i][j].isActive()){
                this.lignes[i][j].fail();
            }
        }
    }
    this._fire(MarqueursManager.EVENT_FAIL);
    // TODO: fail combo
};

MarqueursManager.prototype.refresh = function(){
	var marqueur = null;
    this.context.clearRect(0,0,Configuration.width, Configuration.height);
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
			marqueur.refresh(this.timeReference);
			
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
				marqueur = new Marqueur(this.getXPosition(i), this.partition[i][j].delay, this.partition[i][j].duration, i, this.context, this.scoreManager);
                marqueur.addListener(Marqueur.EVENT_FAIL, (function(){
                    this._fire(MarqueursManager.EVENT_FAIL);
                }).bind(this));
                marqueur.addListener(Marqueur.EVENT_ACTIVE, (function(){
                    this._fire(MarqueursManager.EVENT_ACTIVE);
                }).bind(this));
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

MarqueursManager.prototype.lineHasActif = function(i){
    for(var j=0;j<this.lignes[i].length;j++){
        if(this.lignes[i][j].isActive()){
            return true;
        }
    }
    return false;
};


MarqueursManager.prototype.addListener = function(event, handler){
    if(event == MarqueursManager.EVENT_FAIL) {
        this.listeners.fail.push(handler);
    }
    if(event == MarqueursManager.EVENT_ACTIVE) {
        this.listeners.active.push(handler);
    }
};

MarqueursManager.prototype._fire = function(event){
    var toFire = null;
    switch (event){
        case MarqueursManager.EVENT_FAIL: toFire = this.listeners.fail; break;
        case MarqueursManager.EVENT_ACTIVE: toFire = this.listeners.active; break;
        default: break;
    }

    if(toFire == null) return;

    for(var i=0;i<toFire.length;i++){
        if(typeof(toFire[i]) == 'function'){
            toFire[i]();
        }
    }
};
