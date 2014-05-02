function Marqueur(x, delay, duration, id){
	Shape.call(this);
	
	// Load canvas
	this._createCanvas(200);
	this.id = id;
	this.x = x;
	this.y = -100;
	this.delay = delay;
	this.duration = duration;
	
	this.timeDown = 0;
	
	this.state = Marqueur.STATE_INACTIVE;
}
Marqueur.prototype = Object.create(Shape.prototype);
Marqueur.prototype.constructor = Marqueur;

Marqueur.STATE_INACTIVE = 000;
Marqueur.STATE_ACTIVE = 100;
Marqueur.STATE_FAIL = 200;
Marqueur.STATE_SUCCESS = 210;
Marqueur.STATE_ENDED = 300;

Marqueur.EVENT_DOWN = "DOWN";
Marqueur.EVENT_UP = "UP";
Marqueur.EVENT_SUCCESS = "SUCCESS";
Marqueur.EVENT_FAIL = "FAIL";
Marqueur.EVENT_TIMEOUT = "TIMEOUT";

Marqueur.TRANSITIONS = [
	{
		from: Marqueur.STATE_INACTIVE,
		to: Marqueur.STATE_ACTIVE,
		events: [Marqueur.EVENT_DOWN],
		condition: function(){ 
			return this.duration == 0; 
		},
		action: function(){ 
			this._trigger(Marqueur.EVENT_SUCCESS); 
		}
	},
	{
		from: Marqueur.STATE_INACTIVE,
		to: Marqueur.STATE_ACTIVE,
		events: [Marqueur.EVENT_DOWN],
		condition: function(){ return this.duration > 0; },
		action: function(){ 
			this.timeDown = Date.now();
			window.setTimeout((function(){ this._trigger(Marqueur.EVENT_TIMEOUT);}).bind(this), this.duration); // post action, devrai être mutualisé
		}
	},{
		from: Marqueur.STATE_INACTIVE,
		to: Marqueur.STATE_FAIL,
		events: [Marqueur.EVENT_FAIL],
		condition: null,
		action: function(){ 
			window.setTimeout((function(){ 
				this._trigger(Marqueur.EVENT_TIMEOUT);
			}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},{
		from: Marqueur.STATE_ACTIVE,
		to: Marqueur.STATE_SUCCESS,
		events: [Marqueur.EVENT_SUCCESS],
		condition: null,
		action: function(){ 
			window.setTimeout((function(){ this._trigger(Marqueur.EVENT_TIMEOUT);}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},{
		from: Marqueur.STATE_ACTIVE,
		to: Marqueur.STATE_FAIL,
		events: [Marqueur.EVENT_UP],
		condition: null,
		action: function(){ 
			window.setTimeout((function(){ this._trigger(Marqueur.EVENT_TIMEOUT);}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},{
		from: Marqueur.STATE_SUCCESS,
		to: Marqueur.STATE_ENDED,
		events: [Marqueur.EVENT_TIMEOUT],
		condition: null,
		action: function(){
			this._draw();
		}
	},{
		from: Marqueur.STATE_FAIL,
		to: Marqueur.STATE_ENDED,
		events: [Marqueur.EVENT_TIMEOUT],
		condition: null,
		action: function(){
			this._draw();
		}
	}
];

Marqueur.prototype._trigger = function(event){
	var tr = Marqueur.TRANSITIONS;
	for(var i=0;i<tr.length;i++){
		if(-1 != tr[i].events.indexOf(event) 
		&& tr[i].from == this.state
		&& (!tr[i].condition || (tr[i].condition.bind(this))()) 
		){
			this.state = tr[i].to;
			if(tr[i].action) (tr[i].action.bind(this))();
			return true;
		}
	}
	return false;
};


// Evenement externes
Marqueur.prototype.down = function(timeDown){
	console.log('Down');
	if(this._trigger(Marqueur.EVENT_DOWN)){
		console.log('Touched');
		this.timeDown = timeDown;
	}
};
Marqueur.prototype.up = function(){
	this._trigger(Marqueur.EVENT_UP);
};
Marqueur.prototype.fail = function(){
	this._trigger(Marqueur.EVENT_FAIL);
};

Marqueur.prototype.refresh = function(){
	
	//this._computeScore();
	
	console.log("Event: " + this.state);
	
	this._draw();
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
	
	this.context.clearRect(0,0,Configuration.width, Configuration.height);
		
	if(Marqueur.STATE_ENDED == this.state) return;
		
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



