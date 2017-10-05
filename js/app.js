var letHover = false;

//Different winning combinations
$(document).ready(function() {
	// Good approach!
	var wins = [[0,1,2], [3,4,5], [6,7,8],
				[0,3,6], [1,4,7], [2,5,8],
				[0,4,8], [2,4,6]];


	//Choosing to "X" or "O" prior to starting games
	// We can create new elements in a much easier way than this:
	var choice = "You will be <br>"; 
	choice += "<input type='radio' name='choice' value='x'> X";
	choice += "<br>";
	choice += "<input type='radio' name='choice' value='o'> O"; 
	choice += "<br>";
	choice += "<button id='ok'>Ok</button>";
	// Nice use of constructors!
	var currentGame = new Game();
	var playerX = new Player();
	var playerO = new Player();

	// You could also use the 'button' selector or add an id to the button instead
	$(".play button").on("click", function() {
		currentGame.clearGame();
		$("#alert span").html(choice);
		$("#alert").show();
	});

	// Very, very hard to understand due to naming choices
	$(".box").hover(
		// Even though we dont have to, naming the callbacks helps us understand the code
		function() {
			// 'let' is more appropriate in this situation than 'var'
			// 'currentCellIndex' is a better name than 'count'
			var count = $(this).index(".box");
			if (letHover) {
				// Reverse the logic: if (!currentGame.cells[count]) { change text here }
				if (currentGame.cells[count])
					return;
				$(this).text(currentGame.currentStep);	
			}
		},
		// Again, naming the callbacks just helps the code be more readable.
		function() {
			var count = $(this).index(".box");
			if (letHover) {
				if (currentGame.cells[count])
					return;
				$(this).text("");
			}
		}
	);

	$(".box").on("click", function() {
		var count = $(this).index(".box");
		if (letHover && !currentGame.cells[count]) {
			letHover = false;
			// its not clear what 'fixStep' means -- work on naming for more readable code
			currentGame.fixStep(count);
		}
	});

	$("#alert").on("click", "button", function() {
		var x, o;
		if ($(this).attr("id") === "ok") {
			x = $("input[name='choice'][value='x']").is(":checked");
			o = $("input[name='choice'][value='o']").is(":checked");
			if (x) {
				playerX.user = true;
				playerO.user = false;
			} else if (o) {
				playerX.user = false;
				playerO.user = true;
			} else {
				return;
			}
			currentGame.currentStep = "X";
			currentGame.doStep();
		}
		if ($(this).attr("id") === "close") {
			currentGame.clearGame();
		}
		$("#alert").hide();
	});

	function Game() {
		// Naming: it looks like currentStep should be currentTurn or currentMark?
		this.currentStep = "",
		this.cells = ["", "", "", "", "", "", "", "", ""],
        // would be better to name clearGame to 'reset'
		this.clearGame = function(){
			this.currentStep = "";
			// Since we have Game.cells then Player.cells would be more consistent and readable
			playerX.steps = [];
			playerO.steps = [];
			this.cells = ["", "", "", "", "", "", "", "", ""];
			$(".box").text("");
		},
		// I think isGameOver would be a good name too
		this.checkEnd = function() {
			var result = false;
			if (this.currentStep == "X") {
				result = playerX.checkStep();
				if (result) { this.finish = "Player X won!"; }
				

			} else {
				result = playerO.checkStep();
				if (result) this.finish = "Player O won!";
			}
			var cond = 
			(playerX.steps.length + playerO.steps.length == 9);
			// Keep standard syntax: if (cond) { commands }
			if (cond && (!result)) this.finish = "Draw...";
			return result || cond;
		},
		// instead of using <br> we can create a new element
		this.endGame = function() {
			var str = this.finish;
			str += "<br>";
			str += "<button id='close'>Ok</button>";
			$("#alert").show();
			$("#alert span").html(str);
		},

		this.doStep = function() {
			var curPlayer, otherPlayer, count;
			if (this.currentStep === "X") {
				curPlayer = playerX;
				otherPlayer = playerO;
			}
			else {
				curPlayer = playerO;
				otherPlayer = playerX;
			}
			if (!curPlayer.user) {
				count = computer(curPlayer.steps, otherPlayer.steps);
				this.fixStep(count);
			} else {
				letHover = true;
			}
		},

		this.fixStep = function(value) {
			if (this.currentStep == "X") {
				playerX.addStep(value);
			} else {
				playerO.addStep(value);
			}
			$(".box").eq(value).text(this.currentStep);
			this.cells[value] = this.currentStep;
			if (this.checkEnd()) {
				this.endGame();
			} else {
				this.currentStep = 
					this.currentStep == "X" ? "O" : "X";
				this.doStep();
			}
		}
	}

	function Player() {
		this.steps = [],
		this.user,
		this.addStep = function(step) {
			this.steps.push(step);
		},
		this.checkStep = function() {
			var result;
			for (var i = 0; i < 8; i++) {
				result = true;
				for (var j = 0; j < 3; j++) {
					if (this.steps.indexOf(wins[i][j]) < 0) {
						result = false;
						break;
					}
				}
				if (result) return true;

			}
			return false;
		}
	}
// Really not clear what computer is :D
	function computer(arr1, arr2) {
		var result, count1, count2;

		for (var i = 0; i < 8; i++) {
			count1 = 0;
			count2 = 0;
			for (var j = 0; j < 3; j++) {
				if (arr1.indexOf(wins[i][j]) >= 0)  
					count1++;
				else 
					result = wins[i][j];
				if (arr2.indexOf(wins[i][j]) >= 0) count2++;
			}
			if (count1 === 2 & count2 === 0) {
				return result;
			}
		}

		for (var i = 0; i < 8; i++) {
			count1 = 0;
			count2 = 0;
			for (var j = 0; j < 3; j++) {
				if (arr1.indexOf(wins[i][j]) >= 0)  count1++;
				if (arr2.indexOf(wins[i][j]) >= 0) 
					count2++;
				else
					result = wins[i][j];
			}
			if (count1 === 0 & count2 === 2) {
				return result;
			}
		}

		for (var i = 0; i < 8; i++) {
			count1 = 0;
			count2 = 0;
			for (var j = 0; j < 3; j++) {
				if (arr1.indexOf(wins[i][j]) >= 0)  
					count1++;
				else 
					result = wins[i][j];
				if (arr2.indexOf(wins[i][j]) >= 0) count2++;
			}
			if (count1 === 1 & count2 === 0) {
				return result;
			}
		}

		result = Math.floor(Math.random() * 9);
		while (arr1.indexOf(result) >= 0 || arr2.indexOf(result) >= 0)
			result = Math.floor(Math.random() * 9);
		return result;
	}
});