
Util = {
	
	/**
	 * Retourne les positions des count axes sur x
	 * @param {Object} id between 0 and count-1
	 * @param {Object} count, length of collection 
	 */
	getXPositionFromIdAndCount : function(i, count){
		return (i+1)*(Configuration.width/(count+1));
	}
};