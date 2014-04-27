/**
 * Fichier d'initialisation de la plateforme
 */

(function(){
	
	var KEY_1 = 49;	
	var KEY_2 = 50;
	var KEY_3 = 51;
	var KEY_VALIDATE = 13;
	var keyStates = {
		lines: [false, false, false],
		validate: false
	};
	var previousKeyStates = JSON.parse(JSON.stringify(keyStates));
	
	var score = 0;
	
	var backgroundCanvasContext = null; 
	var feedbackEnterContext = null;
	var marqueurs = null;
	var lines = null;
	var referenceTime = null;
	var areaWidth = 600;
	var areaHeight = 300;
	var reachableAreaHeight = 50;
	var reachableAreaOffset = 25;
	
	var vitesseDefilement = 100; // pixel/seconde
	var tempsAnticipation = 1000; // Une seconde d'anticipation
	
	var initialiser = function(){
		
		// ----
		// Chargement des marqueurs
		marqueurs = [
			// Une ligne par entrée
			[
				{delay: 100},
				{delay: 1000},
				{delay: 1500},
				{delay: 2200},
				{delay: 5000},
				{delay: 10500}
			],[
				{delay: 6000},
				{delay: 7200},
				{delay: 8100},
				{delay: 12000}
			],[
				{delay: 4800},
				{delay: 5200},
				{delay: 7100},
				{delay: 8300}
			]
		];
		
		lines = [];
		for(var i=0;i<marqueurs.length;i++){
			lines[i] = {};
		}
			
		backgroundCanvasContext = createCanvasContext(1);
		dessinerBackground();
		

		
		window.onkeydown = onKeyDown;
		window.onkeyup = onKeyUp;
	
		window.requestAnimationFrame(lancer);
	};
	
	var lancer = function(){
		
		referenceTime = referenceTime || Date.now();
		
		// Enchainement des marqueurs
		animerMarqueurs();
		
		// Rendu du feedback touche enter
		animateFeedbackEnter();
		
		// Rendu du feedback touche d'une ligne
		animateFeedbackLine();
		
		window.requestAnimationFrame(lancer);
	};
	
	window.onload = initialiser;
	
	
	
	// --------------------------------------------
	// Handler functions for keyboard
	
	var onKeyDown = function(event){
		switch(event.keyCode){
			case KEY_1: enterLine(0); break;
			case KEY_2: enterLine(1); break;
			case KEY_3: enterLine(2); break;
			case KEY_VALIDATE: enterValidate(); break;
			default: break;
		}
	};
	
	var onKeyUp = function(event){
		switch(event.keyCode){
			case KEY_1: exitLine(0); break;
			case KEY_2: exitLine(1); break;
			case KEY_3: exitLine(2); break;
			case KEY_VALIDATE: exitValidate(); break;
			default: break;
		}
	};
	
	var enterLine = function(index){
		keyStates.lines[index] = true; 
	};
	
	var exitLine = function(index){
		keyStates.lines[index] = false;
	};
	
	var enterValidate = function(){
		keyStates.validate = true;
		validateLines();
	};
	
	var exitValidate = function(){
		keyStates.validate = false;
	};
	
	var keyHasChanged = function(key){
		switch(key){
			case KEY_1: 
				if(keyStates.lines[0] != previousKeyStates.lines[0]){
					previousKeyStates.lines[0] = keyStates.lines[0];
					return true;
				};
				break;
			case KEY_2: 
				if(keyStates.lines[1] != previousKeyStates.lines[1]){
					previousKeyStates.lines[1] = keyStates.lines[1];
					return true;
				};
				break;
			case KEY_3: 
				if(keyStates.lines[2] != previousKeyStates.lines[2]){
					previousKeyStates.lines[2] = keyStates.lines[2];
					return true;
				};
				break;
			case KEY_VALIDATE: 
				if(keyStates.validate != previousKeyStates.validate){
					previousKeyStates.validate = keyStates.validate;
					return true;
				};
				break;
			default: break;
		}
		return false;
	};
	
	var validateLines = function(){
		for(var i=0;i<keyStates.lines.length;i++){
			if(keyStates.lines[i]){
				for(var j=0;j<marqueurs[i].length;j++){
					if(marqueurHasToBeLoaded(marqueurs[i][j]) 
						&& marqueurIsInReachableZone(marqueurs[i][j])){
						//alert('touched i:'+i+' j:'+j);
						marqueurTouched(marqueurs[i][j]);
					}
				}
			}
		}
	};
	
	// --------------------------------------------
	// Specifiques functions
	
	/**
	 * Dessine le background et ses lignes
	 */
	var dessinerBackground = function(){
		
		backgroundCanvasContext.fillStyle = '#aaaaaa';
		backgroundCanvasContext.fillRect(0,0,areaWidth,areaHeight);
		
	};
	
	/**
	 * Anime les marqueurs en les faisant avancer
	 */
	var animerMarqueurs = function(){
		
		var dateNow = Date.now();
		var currentTimeOffset = dateNow - referenceTime;
		var longueurAvance = (vitesseDefilement / 1000) * tempsAnticipation;
		var longueurVisible = areaHeight;
		var longueurACharger = vitesseDefilement + longueurVisible;
		var tempsACharger = longueurACharger / vitesseDefilement;
		for(var i=0;i<marqueurs.length;i++){
				for(var j=0;j<marqueurs[i].length;j++){
				// On détecte les élements qui doivent être initialisés
				// Ceux qui sont dans la zone visibles et ceux anticipés de 1 seconde
				if(marqueurHasToBeLoaded(marqueurs[i][j])){
					var context = null;
					if(!marqueurs[i][j].sprite){
						context = createCanvasContext(200);
						marqueurs[i][j].sprite = {
							x: getLinePositionX(marqueurs.length, i),
							y: null,
							context: context
						};
					}
					
					// MAJ de la position Y
					marqueurs[i][j].sprite.y = ((currentTimeOffset - marqueurs[i][j].delay)) *  (vitesseDefilement/1000);
					
					renderMarqueur(marqueurs[i][j]);
				}		
			}
		}
	};
	
	var animateFeedbackEnter = function(){
		//alert('animateFeedbackEnter ')
		if(keyHasChanged(KEY_VALIDATE) || !feedbackEnterContext){
			
			if(!feedbackEnterContext){
				feedbackEnterContext = createCanvasContext(150);
			}
			
			feedbackEnterContext.clearRect(0,0,areaWidth,areaHeight);
			if(keyStates.validate){
				feedbackEnterContext.globalAlpha = 0.7;
			} else {
				feedbackEnterContext.globalAlpha = 0.2;
			}
			feedbackEnterContext.fillStyle = '#ffffff';
			feedbackEnterContext.fillRect(0,areaHeight-reachableAreaHeight-reachableAreaOffset,areaWidth,reachableAreaHeight);
			feedbackEnterContext.globalAlpha = 1;
		}
	};
	
	var animateFeedbackLine = function(){
		var keys = [KEY_1, KEY_2, KEY_3];
		for(var i=0;i<keys.length;i++){
			if(keyHasChanged(keys[i]) || !lines[i].context){
				renderLine(i);
			}
		}
	};
	
	var renderMarqueur = function(marqueur){
		var context = marqueur.sprite.context;
		if(marqueur.state && marqueur.state.touchedAt){
			context.fillStyle = "#cc0000";
		} else {
			context.fillStyle = '#009900';
		}
		if(!marqueurIsInReachableZone(marqueur)){
			context.strokeStyle = '#000000';
		} else {
			context.strokeStyle = '#ff0000';
		}
		
		context.clearRect(0,0,areaWidth,areaHeight);
		context.beginPath();
		context.arc(marqueur.sprite.x,marqueur.sprite.y,25,0,2*Math.PI);
		context.fill();
		context.stroke();
	};
	
	var renderLine = function(index){
		if(!lines[index].context){
			lines[index] = {
				context: createCanvasContext(100+index)
			};
		}
		var context = lines[index].context;
		context.clearRect(0,0,areaWidth,areaHeight);
		
		if(keyStates.lines[index]){ 
			context.fillStyle = '#'+(index==0?'ff':'00')+(index==1?'ff':'00')+(index==2?'ff':'00');
		} else {
			context.fillStyle = '#ffffff';
		}
		context.fillRect(getLinePositionX(lines.length,index), 0, 2, areaHeight);

	};
	
	var marqueurHasToBeLoaded = function(marqueur){
		return getCurrentTimeOffset() > marqueur.delay - tempsAnticipation;
	};
	
	var marqueurIsInVisibleZone = function(marqueur){
		return 0-25 < marqueur.sprite.y 
				&& marqueur.sprite.y < areaHeight+25;
	};
	
	var marqueurIsInReachableZone = function(marqueur){
		return ((areaHeight-reachableAreaHeight-reachableAreaOffset) < marqueur.sprite.y 
				&& marqueur.sprite.y < (areaHeight-reachableAreaOffset));
	};
	
	var marqueurTouched = function(marqueur){
		marqueur.state = {touchedAt: Date.now()};
		marqueur.score = marqueurComputeScore(marqueur);
		scoreAddMarqueurScore(marqueur);
	};
	
	var marqueurComputeScore = function(marqueur){
		console.log('positions:');
		console.log('reference: ' + (areaHeight-(reachableAreaHeight/2)-reachableAreaOffset));
		console.log('yMarqueur: ' + marqueur.sprite.y);
		var max = reachableAreaHeight/2;
		var score = max - Math.abs((areaHeight-(reachableAreaHeight/2)-reachableAreaOffset)-marqueur.sprite.y);
		return score;
	};

	var scoreAddMarqueurScore = function(marqueur){
		console.log(marqueur.score);
		score += marqueur.score;
		scoreRefreshScore();
	};
	
	var scoreRefreshScore = function(){
		document.getElementById('game_score').innerHTML = '';
		document.getElementById('game_score').appendChild(document.createTextNode('Score: ' + parseInt(score)));
	};
	
	/**
	 * 
	 */
	var getCurrentTimeOffset = function(){
		return Date.now() - referenceTime;
	};
	
	var pixelToSecondes = function(distance){
		 return distance /  vitesseDefilement;
	};
	
	var createCanvasContext = function(zindex) {
		var canvas = window.document.createElement("canvas");
		canvas.style.position = "absolute";
  		canvas.style.zIndex = zindex;
  		canvas.width = areaWidth;
  		canvas.height = areaHeight;
  		document.getElementById('game_area').appendChild(canvas);
  		return canvas.getContext('2d');
   };
	
	/**
	 * Retourne la position X d'une ligne en fonction 
	 * du nombre total et de l'index de la ligne qu'on souhaite positionner
	 */
	var getLinePositionX = function(count, current){
		return (current+1)*(areaWidth/(count+1));
	};
	
	
	
})();
