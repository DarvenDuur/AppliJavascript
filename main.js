(function(){
	var nbObstacle = 8;
	var nbBonus = 8;
	var taille = 6;


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

		}
	}











})();