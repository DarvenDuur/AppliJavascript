(function(){
	var taille = 6;
	var taillePx = 500; //taille du tableau en px
	var bonusPoints = 50; //incrément des pionts pour chaque bonnus

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

		init(){
			//Initialisation du score
			this.points = 0;

			//Placement de la princesse
			var ligneP = Math.floor(Math.random() * taille);
			var colonneP = Math.floor(Math.random() * taille);
			this.cases[ligneP][colonneP] = 2;

			//Placement du heros
			var ligneH, colonneH;
			do {
				this.ligneH = Math.floor(Math.random() * taille);
				this.colonneH = Math.floor(Math.random() * taille);
			} while (this.ligneH==ligneP || this.colonneH==colonneP);
			this.cases[this.ligneH][this.colonneH] = 1;

			//Placement des bonus et obtacles
			for (var i = 0; i < taille; i++) {
				for (var j = 0; j < taille; j++) {
					if((i != ligneP && j != colonneP) && (i != this.ligneH && j != this.colonneH)) {
						var alea = Math.random();
						if(alea < 0.20){
							this.cases[i][j] = 4; //Placement des obstacles
						}
						else if(alea < 0.45){
							this.cases[i][j] = 3; //Placement des bonus
						}
					}
				}
			}
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

		

		moveLeft(){
			var ligne = this.ligneH,
				colonne = this.colonneH;
			if((colonne-1 > 0) && (this.cases[ligne][colonne-1] != 4)){
				colonne -= 1;
				this.mvmtEffect(ligne, colonne);
			}
		}

		moveUp() {
			var ligne = this.ligneH,
				colonne = this.colonneH;
			if((ligne-1 > 0) && (this.cases[ligne-1][colonne] != 4)){
				ligne -= 1;
				this.mvmtEffect(ligne, colonne);
			}
		}

		moveRight() {
			var ligne = this.ligneH,
				colonne = this.colonneH;
			if((colonne+1 < taille) && (this.cases[ligne][colonne+1] != 4)){
				colonne += 1;
				this.mvmtEffect(ligne, colonne);
			}
		}

		moveDown() {
			var ligne = this.ligneH,
				colonne = this.colonneH;
			if((ligne+1 < taille) && (this.cases[ligne+1][colonne] != 4)){
				ligne += 1;
				this.mvmtEffect(ligne, colonne);
			}
		}

		mvmtEffect(ligne, colonne){
			if(this.cases[ligne][colonne] == 2){
				win();
			}
			else {
				if(this.cases[ligne][colonne] == 3) {
					this.points += bonusPoints;
				}
				if(this.cases[ligne][colonne] == 0)
				{
					this.cases[this.ligneH][this.colonneH] = 0;
					this.cases[ligne][colonne] = 1;
					this.ligneH = ligne;
					this.colonneH = colonne;
				}
			}
		}

		//invoked on keypress
		move(event){
			switch(event.keyCode) {
				case 37: moveLeft(); break;
				case 38: moveUp(); break;
				case 39: moveRight(); break;
				case 40: moveDown();
			}
		}

	}

	

	function setMessage(titre, contenu) {

		var aside = document.createElement("ASIDE"),
			title = document.createElement("H2"),
			content = document.createElement("P");

		title.innerHTML = titre;
		content.innerHTML = contenu;
		aside.id = "text";
		aside.appendChild(title);
		aside.appendChild(content);

		var currentAside = document.getElementById("text");
		currentAside.parentNode.replaceChild(aside, currentAside);
	}

	function win() {
		setMessage("Vous avez gagné !","Vous avez "+points+" points!")
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
		setMessage("lol, it's not even funny","blabla blabla blablablabla blabla blablabla blablabla")
	}

	function testInit() {
		var plateau = new Plateau();
		plateau.init();

		plateau.update();
	}

	function testMove() {
		var plateau = new Plateau();
		plateau.init()

		plateau.update();

		console.log(plateau.ligneH,plateau.colonneH);
		plateau.moveRight();
		console.log(plateau.ligneH,plateau.colonneH);
		plateau.moveUp();
		console.log(plateau.ligneH,plateau.colonneH);

		plateau.update();
	}	

	testMove();




})();