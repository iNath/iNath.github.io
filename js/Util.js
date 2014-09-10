var Util = {
	
	/**
	 * Retourne les positions des count axes sur x
	 * @param {Object} id between 0 and count-1
	 * @param {Object} count, length of collection 
	 */
	getXPositionFromIdAndCount : function(i, count){

        var widthForOneLine = Configuration.getStyleLigneForLigne(0).totalWidth;
        var totalWidth = count * widthForOneLine;

		return Math.ceil(((Configuration.width - totalWidth) / 2) + i*widthForOneLine + widthForOneLine / 2);
	}


    /**
     * Crée un canvas de la taille de la zone de jeu
     * @param zindex
     * @returns {CanvasRenderingContext2D} le contexte
     */
    ,createCanvas : function(zindex){
        var canvas = window.document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.zIndex = zindex;
        canvas.width = Configuration.width;
        canvas.height = Configuration.height;
        Configuration.getWrapper().appendChild(canvas);

        return canvas.getContext('2d');
    }


    /**
     * Converti des millisecondes en pixels
     * @param delay
     * @returns {number} pixels
     */
    ,delayToPixel : function(delay){
        return (delay / 1000) * Configuration.velocity;
    }

    /**
     *
     * @returns {*}
     */
    ,getYOrigin : function(){
        return Configuration.getAreaPositions().reachable.y
            + Configuration.getAreaPositions().reachable.height / 2;
    }

    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} radius The corner radius. Defaults to 5;
     * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
     * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
     */
    ,roundRect : function(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined" ) {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
    }

};