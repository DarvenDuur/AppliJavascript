//(function(){
	var taille = 8;
	var taillePx = 600; //taille du tableau en px
	var points;
	var maxTime = 30; // max time in seconds
	var pointBonnus = 50; // points added on bonnus
	var bonnusRate = 0.2;
	var obstacleRate = 0.2;
	var canPlay;

	class Plateau{
		constructor(){
			this.cases=new Array();
			for (var i = 0; i < taille; i++) {
				this.cases[i]=new Array();
				for (var j = 0; j < taille; j++) {
					this.cases[i][j]=0;//valeur va etre 0 pour une case vide, 1 pour un heros, 2 pour une princesse, 3 pour un bonus, 4 pour un obstacle
				}
			}
		}
		
		//clear table and refill it
		resetCases(){
			canPlay = true;
			for (var i = 0; i < taille; i++) {
				this.cases[i]=new Array();
				for (var j = 0; j < taille; j++) {
					this.cases[i][j]=0;
				}
			}
			this.init();
		}

		//initialise all parameters
		init(){	
			//Initialisation du texte
			setMessage("Sauvez la princesse!","Vous devez sauver la princesse avant la fin du temps imparti.");
		
			//Initialisation du timer
			setTimer();
			
			//Initialisation du score
			points = 0;
			showPoints();
		
			//Placement de la princesse
			var ligneP = Math.floor(Math.random() * taille);
			var colonneP = Math.floor(Math.random() * taille);
			this.cases[ligneP][colonneP] = 2;

			//Placement du heros
			do {
				this.ligneH = Math.floor(Math.random() * taille);
				this.colonneH = Math.floor(Math.random() * taille);
			} while (this.ligneH==ligneP || this.colonneH==colonneP);
			this.cases[this.ligneH][this.colonneH] = 1;

			//Placement des bonus et obtacles
			for (var i = 0; i < taille; i++) {
				for (var j = 0; j < taille; j++) {
					if(!(i == ligneP && j == colonneP) && !(i == this.ligneH && j == this.colonneH)) {
						var alea = Math.random();
						if(alea < obstacleRate){
							this.cases[i][j] = 4; //Placement des obstacles
						}
						else if(alea < obstacleRate+bonnusRate){
							this.cases[i][j] = 3; //Placement des bonus
						}
					}
				}
			}
			if (!this.isWinable()) {this.resetCases();} //si on ne peut pas gagner
		}

		//determines if the board allows win (hero can access the princess)
		isWinable(){
			var acessibleTiles = new Array(),
				accessible = false,
				quickCoor = [[1,0],[-1,0],[0,1],[0,-1]],
				newCaseI,
				newCaseJ,
				toSpreadTiles = new Array(),
				tile;
				
			//initialise the array representing the accessible tiles for the hero
			for (var i = 0; i < taille; i++) {
				acessibleTiles[i]=new Array();
				for (var j = 0; j < taille; j++) {
					acessibleTiles[i][j]=false;
				}
			}
			
			//seting the hero tile as accessible
			acessibleTiles[this.ligneH][this.colonneH]=true;
			toSpreadTiles.push([this.ligneH,this.colonneH]);
			
			//while there are tiles to spread
			while (toSpreadTiles.length>0) {
				tile = toSpreadTiles.pop();
				//spreading truth to adjacent tiles
				for (var coor = 0; coor < 4; coor++) {
					newCaseI=tile[0]+quickCoor[coor][0];
					newCaseJ=tile[1]+quickCoor[coor][1];
					//if the tile is in the board
					if ((newCaseI<taille && newCaseI>=0) && (newCaseJ<taille && newCaseJ>=0)){
						//if the tile is not occupied by an obstacle and not already tested
						if(!acessibleTiles[newCaseI][newCaseJ] && this.cases[newCaseI][newCaseJ] != 4) {
							acessibleTiles[newCaseI][newCaseJ] = true;
							toSpreadTiles.push([newCaseI,newCaseJ]);
						}
					}	
				}
			}
			
			//check if the princess is in the accessible tiles
			for (var i = 0; i < taille; i++) {
				for (var j = 0; j < taille; j++) {
					if (acessibleTiles[i][j] && this.cases[i][j]==2) {accessible = true;}
				}
			}
			console.log(accessible);
			return accessible;
		}		
		
		/** creates HTML Node
		 * Returns the html pseudo-table corresponding to the current Plateau state
		 */
		toHtmlNode() {
			var table,
				line,
				cell,
				subCell;

			table = document.createElement("SECTION");
			table.id = "plateau";
			
			for (var i = 0; i < taille; i++) {
				line=document.createElement("DIV");
				line.className = "ligne";
				line.style.height = taillePx/taille+"px";
				
				for (var j = 0; j < taille; j++) {
					cell=document.createElement("DIV");
					cell.className = "case";
					cell.style.width = taillePx/taille+"px";

					switch (this.cases[i][j]){
						case 1: // if the cell contains the hero
							subCell = document.createElement("DIV");
							subCell.id = "hero";
							cell.appendChild(subCell);
							break;

						case 2: // if the cell contains the princess
							subCell = document.createElement("DIV");
							subCell.id = "princesse";
							cell.appendChild(subCell);
							break;

						case 3: // if the cell contains a bonus
							subCell = document.createElement("DIV");
							subCell.className = "bonus";
							cell.appendChild(subCell);
							break;

						case 4: // if the cell contains an obstacle
							subCell = document.createElement("DIV");
							subCell.className = "obstacle";
							cell.appendChild(subCell);
							break;
					}
					line.appendChild(cell);
				}
				table.appendChild(line);
			}

			return table;
		}

		update() {
			plateau=document.getElementById("plateau");
			plateau.parentNode.replaceChild(this.toHtmlNode(), plateau);
		}

		mvmtEffect(ligne, colonne){
			if(this.cases[ligne][colonne] == 2){
				win();
			}
			else if(this.cases[ligne][colonne] == 3) {
				bonnus();
			}
		}

		moveLeft(){
			if(this.colonneH > 0 && this.cases[this.ligneH][this.colonneH-1] != 4){
				this.mvmtEffect(this.ligneH, this.colonneH-1);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH][this.colonneH-1] = 1;
				this.colonneH -= 1;
			}
		}

		moveUp() {
			if(this.ligneH > 0 && this.cases[this.ligneH-1][this.colonneH] != 4){
				this.mvmtEffect(this.ligneH-1, this.colonneH);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH-1][this.colonneH] = 1;
				this.ligneH -= 1;
			}
		}

		moveRight() {
			if(this.colonneH < taille-1 && this.cases[this.ligneH][this.colonneH+1] != 4){
				this.mvmtEffect(this.ligneH, this.colonneH+1);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH][this.colonneH+1] = 1;
				this.colonneH += 1;
			}
		}

		moveDown() {
			if(this.ligneH < taille-1 && this.cases[this.ligneH+1][this.colonneH] != 4){
				this.mvmtEffect(this.ligneH+1, this.colonneH);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH+1][this.colonneH] = 1;
				this.ligneH += 1;
			}
		}


	}
	
	//invoked on keypress
	function move(event, plateau){
		if (canPlay) {
			switch(event.keyCode) {
				case 37: plateau.moveLeft(); break;
				case 38: plateau.moveUp(); break;
				case 39: plateau.moveRight(); break;
				case 40: plateau.moveDown();
			}
			plateau.update();
		}
		
	}

	function setMessage(titre, contenu) {
		var title = document.getElementById("textTitre"),
			content = document.getElementById("textContenu");

		title.innerHTML = titre;
		content.innerHTML = contenu;
	}
	
	//points
	function showPoints() {
		var HTMLtimer = document.getElementById("score");

		HTMLtimer.innerHTML = "Score : " + points + " points";
	}
	
	function bonnus() {
		points += pointBonnus;
		showPoints();
	}
	
	//reset button
	function reinit(plateau) {
		plateau.resetCases();
		plateau.update();
	}
	
	function addButton(plateau) {
		var resetButton = document.createElement("BUTTON");
		resetButton.addEventListener("click",function(){reinit(plateau);});
		resetButton.innerHTML = "Click to reset";
		document.getElementById("interface").appendChild(resetButton);
	}
	
	function addKeyboardEvent(plateau) {
		document.addEventListener("keypress",function(event){move(event,plateau);});
	}

	// timer (second/10 based)
	var time, timer;
	function setTimer(){
		if (timer){clearInterval(timer);} // stops the timer if it exists
		time = maxTime*10;
		timer = setInterval(updateTimer, 100);
	}
	
	function showTimer(){
		var HTMLtimer = document.getElementById("timer");

		HTMLtimer.innerHTML = "Il vous reste : " + (time/10).toFixed(1) + " secondes";
	}
	
	function updateTimer(){
		time -= 1;
		showTimer();
		if (time==0){
			clearInterval(timer);
			lose();
		}
	}

	/** test Plateau.update()
	 * only for debug use
	 */
	function testUpdate() {
		var plateau = new Plateau();
		plateau.cases[5][4]=1;
		plateau.cases[0][2]=2;
		plateau.cases[4][4]=4;
		plateau.cases[3][2]=4;
		plateau.cases[0][4]=4;

		plateau.update();

		plateau.cases[3][4]=3;
		plateau.cases[4][2]=3;
		plateau.cases[0][3]=3;

		plateau.update();
	}

	/** test setMessage()
	 * only for debug use
	 */
	function testSetMessage() {
		setMessage("lol, it's not even funny","blabla blabla blablablabla blabla blablabla blablabla");
	}

	function testInit() {
		var plateau = new Plateau();
		plateau.init();

		plateau.update();
		addKeyboardEvent(plateau);
		addButton(plateau);

	}

	//victory and loss
	function freeze() {
		if (timer){clearInterval(timer);} // stops the timer if it exists
		canPlay = false;
	}
	function win() {
		setMessage("Vous avez gagné!", "Bravo, vous pouvez recommencer (il y a plein de princesses qui attendent d'etre sauvées)!");
		freeze();
	}
	function lose() {
		setMessage("Vous avez perdu!", "Dommage, essayez encore (on a plein de princesses en stock)!");
		freeze();
	}
	
	testInit();
	
	



//})();