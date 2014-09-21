function Ligne(){

    this.context = null;

	this.x = null;
	this.y = null;
	this.id = null;
	
	this.state = Ligne.STATE_INIT;
	
}

Ligne.STATE_INIT = 000;
Ligne.STATE_ACTIVE = 100;
Ligne.STATE_INACTIVE = 200;


Ligne.prototype.load = function(x, id){
	if(this.state != Ligne.STATE_INIT) return false;
	
	this.context = Util.createCanvas(100);
	this.id = id;
	this.x = x;
	this.y = 0;
	
	this.state = Ligne.STATE_INACTIVE;
};

Ligne.prototype.activate = function(){
	if(this.state != Ligne.STATE_INACTIVE)
		return false;
		
	this.state = Ligne.STATE_ACTIVE;
};

Ligne.prototype.deactivate = function(){
	if(this.state != Ligne.STATE_ACTIVE)
		return false;

	this.state = Ligne.STATE_INACTIVE;
};

Ligne.prototype.isActive = function() {
    return this.state == Ligne.STATE_ACTIVE;
};

Ligne.prototype.refresh = function(){
	if(this.state == Ligne.STATE_INIT) return false;
	
	this._draw();
};

Ligne.prototype._draw = function(){
	if(this.state == Ligne.STATE_INIT) return false;

    this.context.clearRect(0,0,Configuration.width, Configuration.height);

	var style = Configuration.getStyleLigneForLigne(this.id);
    var styleMarqueur = Configuration.getStyleMarqueurForLigne(this.id);
    var widthStrokeMarqueur = 10;


    // Dessin de la ligne
    this.context.fillStyle = '#ffffff';
    this.context.globalAlpha = this.state == Ligne.STATE_ACTIVE ? 0.2 : 0.1;
    this.context.fillRect(this.x-1, 0, style.width, Util.getYOrigin() + styleMarqueur.offsetTop - widthStrokeMarqueur / 2);

    // Dessin de la zone d'attache finale des marqueurs
    this.context.globalAlpha = 0.5;
    this.context.strokeStyle = '#ffffff';
    this.context.lineWidth = widthStrokeMarqueur;
    Util.roundRect(this.context,
        this.x + styleMarqueur.offsetLeft, Util.getYOrigin() + styleMarqueur.offsetTop,
        styleMarqueur.width, styleMarqueur.height,
        styleMarqueur.radius, false, true
    );

    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = "destination-out";
    Util.roundRect(this.context,
        this.x + styleMarqueur.offsetLeft, Util.getYOrigin() + styleMarqueur.offsetTop,
        styleMarqueur.width, styleMarqueur.height,
        styleMarqueur.radius, true, false
    );
    this.context.globalCompositeOperation = "source-over";


    this.context.globalAlpha = 1;
};



