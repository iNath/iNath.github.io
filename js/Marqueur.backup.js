function Marqueur(){
	Shape.call(this);
	
	this.id = null;
	
	this.delay = null;
	this.duration = null;
	this.x = null;
	this.y = null;
	this.state = null;
	this.context = null;
	
	this.timeDown = 0;
	
	this.state = Marqueur.STATE_INIT;
}
Marqueur.prototype = Object.create(Shape.prototype);
Marqueur.prototype.constructor = Marqueur;

Marqueur.STATE_INIT = 000;
Marqueur.STATE_LOADED = 100;
Marqueur.STATE_DOWN = 200;
Marqueur.STATE_ACTIVE = 300;
Marqueur.STATE_FAIL = 400;
Marqueur.STATE_ENDING = 500;
Marqueur.STATE_ENDED = 600;


Marqueur.prototype._toState = function(state){
	var authorized = false;
	switch(state){
		case Marqueur.STATE_LOADED:
			if(-1 != [Marqueur.STATE_INIT].indexOf(this.state))
				authorized = true;
			break;
		case Marqueur.STATE_ACTIVE:
			if(-1 != [Marqueur.STATE_LOADED].indexOf(this.state))
				authorized = true;
			break;
		case Marqueur.STATE_FAIL:
			if(-1 != [Marqueur.STATE_LOADED, Marqueur.STATE_ACTIVE].indexOf(this.state))
				authorized = true;
			break;
		case Marqueur.STATE_ENDING:
			if(-1 != [Marqueur.STATE_LOADED, Marqueur.STATE_ACTIVE, Marqueur.STATE_FAIL].indexOf(this.state))
				authorized = true;
			break;
		case Marqueur.STATE_ENDED:
			if(-1 != [Marqueur.STATE_ENDING].indexOf(this.state))
				authorized = true;
			break;
		default: throw new Error('Unknown state');
	}	
	if(authorized) this.state = state;
	return authorized;
};

Marqueur.prototype._statetoState = function(from, state){
	if(from != this.state) return false;
	
	var authorized = false;
	switch(state){
		case Marqueur.STATE_LOADED:
			if(-1 != [Marqueur.STATE_INIT].indexOf(this.state))
				authorized = true;
			this._InitToLoaded();
			break;
		case Marqueur.STATE_ACTIVE:
			if(-1 != [Marqueur.STATE_LOADED].indexOf(this.state))
				authorized = true;
			this._LoadedToActive();
			break;
		case Marqueur.STATE_FAIL:
			if(-1 != [Marqueur.STATE_LOADED, Marqueur.STATE_ACTIVE].indexOf(this.state))
				authorized = true;
			if(this.state == Marqueur.STATE_LOADED) this._LoadedToFail();
			if(this.state == Marqueur.STATE_FAIL) this._FailToFail();
			break;
		case Marqueur.STATE_ENDING:
			if(-1 != [Marqueur.STATE_LOADED, Marqueur.STATE_ACTIVE, Marqueur.STATE_FAIL].indexOf(this.state))
				authorized = true;
			if(this.state == Marqueur.STATE_LOADED) this._LoadedToEnding();
			if(this.state == Marqueur.STATE_ACTIVE) this._ActiveToEnding();
			if(this.state == Marqueur.STATE_FAIL) this._FailToEnding();
			break;
		case Marqueur.STATE_ENDED:
			if(-1 != [Marqueur.STATE_ENDING].indexOf(this.state))
				authorized = true;
			this._EndingToEnded();
			break;
		default: throw new Error('Unknown state');
	}	
	if(authorized) this.state = state;
	return authorized;
};

Marqueur.prototype._LoadedtoActive = function(){
	if(!this._toState(Marqueur.STATE_ACTIVE)) return;
	
	if(this.duration == 0) return;
	
	// Prepare next step
	window.setTimeout((this._timeout).bind(this), this.duration);
};



Marqueur.prototype.load = function(x, y, delay, duration, id){
	// Check if we are in a right state
	if(!this._toState(Marqueur.STATE_LOADED)) return;
	
	// Load canvas
	this._createCanvas(200);
	this.id = id;
	this.x = x;
	this.setY(y);
	this.delay = delay;
	this.duration = duration;
};

Marqueur.prototype.down = function(timeDown){
		
	console.log("Down marqueur, delay: "+this.delay+", duration:" + this.duration);
	
	if(!this._statetoState(Marqueur.STATE_LOADED, Marqueur.STATE_ACTIVE)) return;
	if(!this._statetoState(Marqueur.STATE_LOADED, Marqueur.STATE_ENDING)) return;
	if(!this._statetoState(Marqueur.STATE_LOADED, Marqueur.STATE_FAIL)) return;
	
};

Marqueur.prototype.up = function(){
	if(!this._toState(Marqueur.STATE_FAIL)) return;
	
	console.log("Up marqueur, delay: "+this.delay+", duration:" + this.duration);
};

Marqueur.prototype.fail = function(){
	if(!this._toState(Marqueur.STATE_FAIL)) return;
		
	window.setTimeout((this._failTimeout).bind(this), 500);
};

Marqueur.prototype._activeTimeout = function(){
	if(!this._toState(Marqueur.STATE_ENDING)) return;
	
};

Marqueur.prototype._failTimeout = function(){
	if(!this._toState(Marqueur.STATE_ENDING)) return;
	
};

Marqueur.prototype._fail = function(){
	if(!this._toState(Marqueur.STATE_FAIL)) return;
	
};

Marqueur.prototype._end = function(){
	if(-1 == [Marqueur.STATE_FAIL, Marqueur.STATE_DOWN, Marqueur.STATE_ACTIVE].indexOf(this.state)) return false;
		
	// change state
	this.state = Marqueur.STATE_ENDING;
	
	if(this.duration > 0){
		window.setTimeout((function(){
			 
			// when finished, end it
			this.state = Marqueur.STATE_ENDED;
			this._draw();
				
			// TODO: supprimer les éléments du dom
		}).bind(this), 500);
	} else {
		this.state = Marqueur.STATE_ENDED;	
		this._draw();
	}
};

Marqueur.prototype.refresh = function(){
	
	//this._computeScore();
	
	switch(this.state){
		case Marqueur.STATE_INIT: return false;	
		case Marqueur.STATE_LOADED: case Marqueur.STATE_DOWN: case Marqueur.STATE_ACTIVE: 
		case Marqueur.STATE_FAIL: case Marqueur.STATE_ENDING: case Marqueur.STATE_ENDED:
			this._draw();
			break;
		default: throw new Error('Wrong state');
	}
};

Marqueur.prototype.setY = function(y){
	this.y = y;
};

Marqueur.prototype.getDelay = function(){
	return this.delay;
};

Marqueur.prototype.isEnded = function(){
	return this.state == Marqueur.STATE_ENDED;
};

Marqueur.prototype._draw = function(){
	if(-1 == [Marqueur.STATE_ENDED, Marqueur.STATE_ENDING, Marqueur.STATE_FAIL, Marqueur.STATE_ACTIVE, Marqueur.STATE_DOWN, Marqueur.STATE_LOADED].indexOf(this.state)) return false;
		
	this.context.clearRect(0,0,Configuration.width, Configuration.height);
		
	if(-1 != [Marqueur.STATE_END, Marqueur.STATE_ENDING].indexOf(this.state)) return;
		
	var style = Configuration.getStyleMarqueurForLigne(this.id);

	if(this.state == Marqueur.STATE_ACTIVE){
		style.color = '#ffffff';
	}
	
	var color = this.state == Marqueur.STATE_FAIL ? '#000000' : style.color;

	if(this.duration > 0){
		var hauteur = this.duration * Configuration.velocity / 1000;
		this.context.fillStyle = color;
		this.context.fillRect(
			this.x-6,
			this.y+style.offsetTop+style.width - hauteur,
			12,
			hauteur
		);
	}
		
	this.context.fillStyle = color;
	this.context.fillRect(this.x+style.offsetLeft, this.y+style.offsetTop, style.width, style.width);

};

Marqueur.prototype._computeScore = function(){
	if(-1 == [Marqueur.STATE_DOWN].indexOf(this.state)) return 0;
		
	var basicScore = Math.abs(this.timeDown - this.delay);
	
	if(this.duration > 0){
		var timeElapsed = Date.now() - this.timeStartDown;
		
	}
};



