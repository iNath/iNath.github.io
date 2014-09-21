function Keyboard(){
	this.listeners = {};
	this.states = {};
	
	
	document.body.addEventListener("keydown", (function(evt){
        evt.stopPropagation();
        evt.preventDefault();
		switch(evt.keyCode){
			case Keyboard._ENTER: 
				if(this.keyIsActive([Keyboard.VALIDATE])) return;
				this.states[Keyboard.VALIDATE] = true;
				this._fire(Keyboard.VALIDATE);
				break;
			case Keyboard._NUM_1: 
				if(this.keyIsActive([Keyboard.NUM_1])) return;
				this.states[Keyboard.NUM_1] = true;
				this._fire(Keyboard.NUM_1);
				break;
			case Keyboard._NUM_2: 
				if(this.keyIsActive([Keyboard.NUM_2])) return;
				this.states[Keyboard.NUM_2] = true;
				this._fire(Keyboard.NUM_2);
				break;
            case Keyboard._NUM_3:
                if(this.keyIsActive([Keyboard.NUM_3])) return;
                this.states[Keyboard.NUM_3] = true;
                this._fire(Keyboard.NUM_3);
                break;
            case Keyboard._NUM_4:
                if(this.keyIsActive([Keyboard.NUM_4])) return;
                this.states[Keyboard.NUM_4] = true;
                this._fire(Keyboard.NUM_4);
                break;
            default: break;
		}
	}).bind(this));
	document.body.addEventListener("keyup", (function(evt){
        evt.stopPropagation();
        evt.preventDefault();
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
            case Keyboard._NUM_4:
                this.states[Keyboard.NUM_4] = false;
                this._fire(Keyboard.NUM_4);
                break;
			default: break;
		}
	}).bind(this));
}

Keyboard._ENTER = 13;
Keyboard._NUM_1 = 49;//112
Keyboard._NUM_2 = 50;//113
Keyboard._NUM_3 = 51;//114
Keyboard._NUM_4 = 52;//115

Keyboard.VALIDATE = "VALIDATE";
Keyboard.NUM_1 = "NUM"+Keyboard._NUM_1;
Keyboard.NUM_2 = "NUM"+Keyboard._NUM_2;
Keyboard.NUM_3 = "NUM"+Keyboard._NUM_3;
Keyboard.NUM_4 = "NUM"+Keyboard._NUM_4;

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
