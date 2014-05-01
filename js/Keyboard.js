function Keyboard(){
	this.listeners = {};
	this.states = {};
	
	
	Configuration.getWrapper().addEventListener("keydown", (function(evt){
		
		// If already
		if(this.keyIsActive([Keyboard.VALIDATE])) return;
		
		switch(evt.keyCode){
			case Keyboard._ENTER: 
				this.states[Keyboard.VALIDATE] = true;
				this._fire(Keyboard.VALIDATE);
				break;
			case Keyboard._NUM_1: 
				this.states[Keyboard.NUM_1] = true;
				this._fire(Keyboard.NUM_1);
				break;
			case Keyboard._NUM_2: 
				this.states[Keyboard.NUM_2] = true;
				this._fire(Keyboard.NUM_2);
				break;
			case Keyboard._NUM_3:  
				this.states[Keyboard.NUM_3] = true;
				this._fire(Keyboard.NUM_3);
				break;
			default: break;
		}
	}).bind(this));
	Configuration.getWrapper().addEventListener("keyup", (function(evt){
		switch(evt.keyCode){
			case Keyboard._ENTER: 
				this.states[Keyboard.VALIDATE] = false;
				this._fire(Keyboard.VALIDATE);
				break;
			case Keyboard._NUM_1: 
				this.states[Keyboard.NUM_1] = false;
				this._fire(Keyboard.NUM_1);
				break;
			case Keyboard._NUM_2: 
				this.states[Keyboard.NUM_2] = false;
				this._fire(Keyboard.NUM_2);
				break;
			case Keyboard._NUM_3:  
				this.states[Keyboard.NUM_3] = false;
				this._fire(Keyboard.NUM_3);
				break;
			default: break;
		}
	}).bind(this));
}

Keyboard._ENTER = 13;
Keyboard._NUM_1 = 49;
Keyboard._NUM_2 = 50;
Keyboard._NUM_3 = 51;

Keyboard.VALIDATE = "VALIDATE";
Keyboard.NUM_1 = "NUM"+Keyboard._NUM_1;
Keyboard.NUM_2 = "NUM"+Keyboard._NUM_2;
Keyboard.NUM_3 = "NUM"+Keyboard._NUM_3;

Keyboard.prototype.addListener = function(evt, func){
	if(!this.listeners[evt]) this.listeners[evt] = [];
	this.listeners[evt].push(func);
};

Keyboard.prototype.keyIsActive = function(evt){
	if(!this.states[evt]) return false;
	return this.states[evt];
};

Keyboard.prototype._fire = function(evt){
	if(!this.listeners[evt]) return;
	
	for(var i=0;i<this.listeners[evt].length;i++){
		this.listeners[evt][i]();				
	}
};
