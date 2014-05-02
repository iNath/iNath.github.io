function Marqueur(x, delay, duration, id, scoreManager){
	Shape.call(this);
	
	// Load canvas
	this._createCanvas(200);
	this.id = id;
	this.x = x;
	this.y = -100;
	this.delay = delay;
	this.duration = duration;
	this.scoreManager = scoreManager;
	
	this.delayDown = null;
	this.delayEnd = null;
	this.delayLastScoreUpdate = null;
	
	this.score = 0;
	
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
Marqueur.EVENT_SUCCESS = "SUCCESS"; // unused
Marqueur.EVENT_FAIL = "FAIL";
Marqueur.EVENT_TIMEOUT = "TIMEOUT";

Marqueur.TRANSITIONS = [
	{
		from: Marqueur.STATE_INACTIVE,
		to: Marqueur.STATE_SUCCESS,
		events: [Marqueur.EVENT_DOWN],
		condition: function(){ 
			return this.duration == 0; 
		},
		action: function(event){
			this.delayDown = event.delayDown;
			this._enterScore();
		},
		postAction: function(){ 
			window.setTimeout((function(){ this._trigger(Marqueur.EVENT_TIMEOUT);}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},
	{
		from: Marqueur.STATE_INACTIVE,
		to: Marqueur.STATE_ACTIVE,
		events: [Marqueur.EVENT_DOWN],
		condition: function(){ return this.duration > 0; },
		action: function(event){ 
			this.delayDown = event.delayDown;
			this.delayLastScoreUpdate = event.delayDown;
			this._enterScore();
		},	
		postAction: function(){ 			
			
			window.setTimeout((function(){
				this._trigger(Marqueur.EVENT_TIMEOUT, {delayEnd: this.delayDown + this.duration});
			}).bind(this), this.duration); // post action, devrai être mutualisé
		}
	},{
		from: Marqueur.STATE_INACTIVE,
		to: Marqueur.STATE_FAIL,
		events: [Marqueur.EVENT_FAIL],
		condition: null,
		action: null,
		postAction: function(){
			this.scoreManager.fail(); 
			window.setTimeout((function(){ 
				this._trigger(Marqueur.EVENT_TIMEOUT);
			}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},{
		from: Marqueur.STATE_ACTIVE,
		to: Marqueur.STATE_SUCCESS,
		events: [Marqueur.EVENT_TIMEOUT],
		condition: null,
		action: function(event){
			this.delayEnd = event.delayEnd;
		},
		postAction: function(){ 
			window.setTimeout((function(){ this._trigger(Marqueur.EVENT_TIMEOUT);}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},{
		from: Marqueur.STATE_ACTIVE,
		to: Marqueur.STATE_FAIL,
		events: [Marqueur.EVENT_UP],
		condition: null,
		action: function(event){
			this.delayEnd = event.delayEnd;
		},
		postAction: function(){ 
			this.scoreManager.fail();
			window.setTimeout((function(){ this._trigger(Marqueur.EVENT_TIMEOUT);}).bind(this), 500); // le temps d'une eventuelle animation, post action
		}
	},{
		from: Marqueur.STATE_SUCCESS,
		to: Marqueur.STATE_ENDED,
		events: [Marqueur.EVENT_TIMEOUT],
		condition: null,
		action: null,
		postAction: function(){
			this._draw();
		}
	},{
		from: Marqueur.STATE_FAIL,
		to: Marqueur.STATE_ENDED,
		events: [Marqueur.EVENT_TIMEOUT],
		condition: null,
		action: null,
		postAction: function(){
			this._draw();
		}
	}
];

Marqueur.prototype._trigger = function(event, data){
	var tr = Marqueur.TRANSITIONS;
	for(var i=0;i<tr.length;i++){
		if(-1 != tr[i].events.indexOf(event) 
		&& tr[i].from == this.state
		&& (!tr[i].condition || (tr[i].condition.bind(this))()) 
		){
			this.state = tr[i].to;
			if(tr[i].action) (tr[i].action.bind(this))(data);
			if(tr[i].postAction) (tr[i].postAction.bind(this))();
			return true;
		}
	}
	return false;
};


// Evenement externes
Marqueur.prototype.down = function(delayDown){
	this._trigger(Marqueur.EVENT_DOWN, {delayDown: delayDown});
};
Marqueur.prototype.up = function(delayEnd){
	this._trigger(Marqueur.EVENT_UP, {delayEnd: delayEnd});
};
Marqueur.prototype.fail = function(){
	this._trigger(Marqueur.EVENT_FAIL);
};

Marqueur.prototype.refresh = function(delayReference){
	
	this._refreshScore(delayReference);
	
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

	var color = style.color;
	switch(this.state){
		case Marqueur.STATE_ACTIVE:
			color = '#ffffff';
			break;
		case Marqueur.STATE_SUCCESS:
			color = '#00ff00';
			break;
		case Marqueur.STATE_FAIL:
			color = '#000000';
			break;
	}

	if(this.duration > 0){
		var hauteur = this.duration * Configuration.velocity / 1000;
		this.context.fillStyle = color;
		this.context.fillRect(
			this.x-6,
			this.y+style.offsetTop+style.height - hauteur,
			12,
			hauteur
		);
	}
		
	this.context.fillStyle = color;
	this.context.fillRect(this.x+style.offsetLeft, this.y+style.offsetTop, style.width, style.width);

};

Marqueur.prototype._enterScore = function(){
	console.log('delayDown: ' + this.delayDown + ' delay: ' + this.delay);
	var basicScore = (200/2) - Math.abs(this.delayDown - this.delay);
	console.log('Score de base: ' + basicScore);
	this.scoreManager.add(basicScore, false);
};

Marqueur.prototype._refreshScore = function(delayReference){
	if(!this.delayDown) return;
	if(this.duration == 0) return;
	
	var basicScore = (200/2) - Math.abs(this.delayDown - this.delay);
	var delayToCompute = (this.delayEnd ? this.delayEnd : delayReference) - this.delayLastScoreUpdate;
	if(delayToCompute <= 0) return;
	 
	var ratio = (delayToCompute / 100); // Une fois le score de base toutes les 100ms
	this.scoreManager.add(basicScore * ratio, true);
	this.delayLastScoreUpdate = delayReference;
	
};



