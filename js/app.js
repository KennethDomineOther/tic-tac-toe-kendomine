var letHover = false;

$(document).ready(function() {
	var wins = [[0,1,2], [3,4,5], [6,7,8],
				[0,3,6], [1,4,7], [2,5,8],
				[0,4,8], [2,4,6]];
	var choice = "You will be <br>"; 
	choice += "<input type='radio' name='choice' value='x'> X";
	choice += "<br>";
	choice += "<input type='radio' name='choice' value='o'> O"; 
	choice += "<br>";
	choice += "<button id='ok'>Ok</button>";
	var currentGame = new Game();
	var playerX = new Player();
	var playerO = new Player();

	$(".play button").on("click", function() {
		currentGame.clearGame();
		$("#alert span").html(choice);
		$("#alert").show();
	});

	$(".box").hover(
		function() {
			var count = $(this).index(".box");
			if (letHover) {
				if (currentGame.cells[count])
					return;
				$(this).text(currentGame.currentStep);	
			}
		}, 
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
		this.currentStep = "",
		this.cells = ["", "", "", "", "", "", "", "", ""],

		this.clearGame = function(){
			this.currentStep = "";
			playerX.steps = [];
			playerO.steps = [];
			this.cells = ["", "", "", "", "", "", "", "", ""];
			$(".box").text("");
		},

		this.checkEnd = function() {
			var result = false;
			if (this.currentStep == "X") {
				result = playerX.checkStep();
				if (result) this.finish = "Player X won!";
			} else {
				result = playerO.checkStep();
				if (result) this.finish = "Player O won!";
			}
			var cond = 
			(playerX.steps.length + playerO.steps.length == 9);
			if (cond && (!result)) this.finish = "Draw...";
			return result || cond;
		},

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