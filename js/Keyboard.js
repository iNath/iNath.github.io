function Keyboard(){
	this.listeners = {};
	this.keys = [];
	
	Configuration.getWrapper().addEventListener("keydown", (function(evt){
		if(evt.keyCode == Keyboard._ENTER){
			this.fire(Keyboard.VALIDATE);
		}
	}).bind(this));
}

Keyboard._ENTER = 13;
Keyboard._NUM_1 = 49;
Keyboard._NUM_2 = 50;
Keyboard._NUM_3 = 51;

Keyboard.VALIDATE = "VALIDATE";

Keyboard.prototype.addListener = function(evt, func){
	if(!this.listeners[evt]) this.listeners[evt] = [];
	this.listeners[evt].push(func);
};

Keyboard.prototype.fire = function(evt){
	if(!this.listeners[evt]) return;
	
	if(evt == Keyboard.VALIDATE){
		for(var i=0;i<this.listeners[evt].length;i++){
			this.listeners[evt][i]();				
		}
	}
};
