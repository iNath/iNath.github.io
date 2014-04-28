function Marqueur(){
	Shape.call(this);
	
	this.x = null;
	this.y = null;
	this.state = null;
	this.context = null;
	
}
Marqueur.prototype = Object.create(Shape.prototype);
Marqueur.prototype.constructor = Marqueur;

Marqueur.STATE_UNLOADED = 000;
Marqueur.STATE_LOADED = 100;
Marqueur.STATE_TOUCHED = 110;
Marqueur.STATE_ENDED = 200;


Marqueur.prototype.init = function(){
	this.state = Marqueur.STATE_UNLOADED;
};

Marqueur.prototype.load = function(x, y){
	// Check if we are in a right state
	if(this.state != Marqueur.STATE_UNLOADED) return false;
	
	// Load canvas
	this._createCanvas(200);
	this.setX(x);
	this.setY(y);

	// Change state if ok
	this.state = Marqueur.STATE_LOADED;
	return true;
};

Marqueur.prototype.touch = function(){
	if(this.state != Marqueur.STATE_LOADED) return false;
		
	// change state
	this.state = Marqueur.STATE_TOUCHED;
};

Marqueur.prototype.end = function(){
	if(-1 == [Marqueur.STATE_TOUCHED, Marqueur.STATE_LOADED].indexOf(this.state)) return false;
		
	// change state
	this.state = Marqueur.STATE_ENDED;
};

Marqueur.prototype.refresh = function(){
	switch(this.state){
		case Marqueur.STATE_UNLOAD: return false;	
		case Marqueur.STATE_LOADED: case Marqueur.STATE_TOUCHED:
			this._draw();
			break;
		case Marqueur.STATE_ENDED: return false;
		default: throw new Error('Wrong state');
	}
	
	
};

Marqueur.prototype.setX = function(x){
	this.x = x;
};

Marqueur.prototype.setY = function(y){
	this.y = y;
};

Marqueur.prototype._draw = function(){
	if(this.state != Marqueur.STATE_LOADED && this.state != Marqueur.STATE_TOUCHED)
		return false;
		
	var style = Configuration.getStyleMarqueurForLigne();
		
	this.context.fillStyle = style.color;
	this.context.fillRect(this.x, this.y, style.width, style.width);
	
};



