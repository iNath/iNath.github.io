function Ligne(){
	Shape.call(this);

	this.x = null;
	this.y = null;
	this.id = null;
	
};
Ligne.prototype = Object.create(Shape.prototype);
Ligne.prototype.constructor = Ligne;

Ligne.STATE_INIT = 000;
Ligne.STATE_ACTIVE = 100;
Ligne.STATE_INACTIVE = 200;

Ligne.prototype.init = function(){
	this.state = Ligne.STATE_INIT;
};

Ligne.prototype.load = function(x, id){
	if(this.state != Ligne.STATE_INIT) return false;
	
	this._createCanvas(100);
	this.id = id;
	this.x = x;
	this.y = 0;
	
	this.state = Ligne.STATE_INACTIVE;
};

Ligne.prototype.activate = function(){
	if(this.state != Ligne.STATE_INACTIVE)
		return false;
		
	this._draw();
		
	this.state = Ligne.STATE_ACTIVE;	
};

Ligne.prototype.deactivate = function(){
	if(this.state != Ligne.STATE_ACTIVE)
		return false;

	this._draw();
		
	this.state = Ligne.STATE_INACTIVE;
};

Ligne.prototype._draw = function(){
	if(this.state == Ligne.STATE_INIT) return false;

	style = Configuration.getStyleLigneForLigne(this.id);
	
	this.context.fillStyle = style.color;
	this.context.fillRect(this.x, 0, style.width, Configuration.height);
	
};



