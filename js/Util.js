
Util = {
	
	/**
	 * Retourne les positions des count axes sur x
	 * @param {Object} id between 0 and count-1
	 * @param {Object} count, length of collection 
	 */
	getXPositionFromIdAndCount : function(i, count){
		return (i+1)*(Configuration.width/(count+1));
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

};