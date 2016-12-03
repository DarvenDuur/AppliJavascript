//(function(){
	var taille = 6;
	var taillePx = 600; //taille du tableau en px
	var points = 0;

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
			if(colonneH > 0 && this.cases[ligneH][coloneH-1] != 4){
				mvmtEffect(this.ligneH, this.colonneH-1);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH][this.colonneH-1] = 1;
				this.colonneH -= 1;
			}
		}

		moveUp() {
			if(ligneH > 0 && this.cases[ligneH-1][colonneH] != 4){
				mvmtEffect(this.ligneH-1, this.colonneH);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH-1][this.colonneH] = 1;
				this.ligneH -= 1;
			}
			
		}

		moveRight() {
			if(colonneH < taille && this.cases[ligneH][colonneH+1] != 4){
				mvmtEffect(this.ligneH, this.colonneH+1);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH][this.colonneH+1] = 1;
				this.colonneH += 1;
			}
		}

		moveDown() {
			if(ligneH < taille && this.cases[ligneH+1][colonneH] != 4){
				mvmtEffect(this.ligneH+1, this.colonneH);
				this.cases[this.ligneH][this.colonneH] = 0;
				this.cases[this.ligneH+1][this.colonneH] = 1;
				this.colonneH += 1;
			}
		}


	}
	//invoked on keypress
	function move(event, plateau){
		switch(event.keyCode) {
			case 37: plateau.moveLeft(); break;
			case 38: plateau.moveUp(); break;
			case 39: plateau.moveRight(); break;
			case 40: plateau.moveDown();
		}
	}

	function mvmtEffect(ligne, colonne){
		if(plateau[ligne][colonne] == 2){
			win();
		}
		else if(plateau[ligne][colonne] == 3) {
			points += 50;
		}
	}

	function setMessage(titre, contenu) {
		var title = document.getElementById("textTitre"),
			content = document.getElementById("textContenu");

		title.innerHTML = titre;
		content.innerHTML = contenu;
	}
	
	function addButton() {
		var resetButton = document.createElement("BUTTON");
		resetButton.addEventListener("click",Plateau.init);
		resetButton.innerHTML = "Reset";
		document.getElementById("interface").appendChild(resetButton);
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
	}

	testInit();
	testSetMessage();
	addButton()




//})();