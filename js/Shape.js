function Shape(){
	
	this.context = null;
}

Shape.prototype._createCanvas = function(zindex){
	if(this.context) return false;
	var canvas = window.document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.zIndex = zindex;
	canvas.width = Configuration.width;
	canvas.height = Configuration.height;
	Configuration.getWrapper().appendChild(canvas);
	this.context = canvas.getContext('2d');
};
