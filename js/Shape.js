function Shape(){

}

Shape.createCanvas = function(zindex){
	var canvas = window.document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.zIndex = zindex;
	canvas.width = Configuration.width;
	canvas.height = Configuration.height;
	Configuration.getWrapper().appendChild(canvas);

    return canvas.getContext('2d');
};
