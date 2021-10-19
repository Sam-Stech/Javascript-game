const NUM_ROWS = 3;
minRandTime = 2000;	// 2000 ms = 2 s
maxRandTime = 7000;	// 7000 ms = 7 s

// Class: Board
// Description: Represents the entire board. Keeps track of the current game
class Board {
    constructor() {
		// Canvas related variables
		this.width = $("#canvas").get()[0].width; //Width of the board is equal to width of canvas
		this.rowHeight = $("#canvas").get()[0].height / 3;
		this.ctx = $("#canvas").get([0]).getContext("2d");
        this.startGame();

        // draw the board
        this.redraw();
		$("#canvas").css("display", "inline-block");
		
		var currentBoard = this;
		document.addEventListener("keydown", function(e) {
			//remove after image
			currentBoard.ctx.clearRect(currentBoard.player.x, currentBoard.player.row * currentBoard.player.rowHeight + 2.5,
				currentBoard.player.dim, currentBoard.player.dim);
			//
			var pressedMovementKey = true;
			var startingRow = currentBoard.player.row;
			
			//check what the user did
			if (e.code == "ArrowUp" && currentBoard.player.row > 0) {
				currentBoard.player.row -= 1;
			} else if (e.code == "ArrowDown" && currentBoard.player.row < 2) {
				currentBoard.player.row += 1;
			} else {
				pressedMovementKey = false;
			}
			
			if (pressedMovementKey) {
				
				var playerCurrentlyBlocked = currentBoard.playerBlocked;
				var playerWillBeBlocked = false;
				//Check if the player will be blocked in their new row.
				for ( let i=0; i < currentBoard.obstacles.length; i++ ) {
					if ( currentBoard.obstacles[i].row == currentBoard.player.row &&
						 currentBoard.obstacles[i].x + currentBoard.obstacles[i].dim > currentBoard.player.x && 
						 currentBoard.obstacles[i].x < (currentBoard.player.x + currentBoard.player.dim - 5) ) {
						playerWillBeBlocked = true;
						break;
					}
				}
				
				if (playerWillBeBlocked) {
					currentBoard.player.row = startingRow;
				} else {
					currentBoard.playerBlocked = false;
					currentBoard.redraw();
				}
			}
		});
    }
	
	//Function: startGame
	//Begins the animation and creates the necessary event handlers.
	startGame() {
        // Clear the canvas
        this.ctx.clearRect(0,0, $("#canvas").get([0]).width, $("#canvas").get([0]).height);
		$("#gameOverScreen").css("visibility", "hidden");

        // Game play related variables
        this.gameOver = false;

        // Player related init variables
        this.player = new Player(1); // Single player object on the board
        this.playerBlocked = false;

        // Non-player related init variables
        this.enemies = [new Enemy()]; // list of enemies currently on the board
        this.obstacles = [new Obstacle()]; // list of obstacles currently on the board
        this.enemyInitTime = new Date().getTime();	// Getting the current time to track for enemy generation
        this.enemyGenTime = Math.floor(Math.random() * (maxRandTime - minRandTime + 1) + minRandTime),	// Generate random time between 2 and 7 s
        this.obstacleInitTime = new Date().getTime();	// Getting the current time to track for obstacle generation
        this.obstacleGenTime = Math.floor(Math.random() * (maxRandTime - minRandTime + 1) + minRandTime),	// Generate random time between 2 and 7 s
        this.playerScore = 0;
	}
	
	//Function: addEnemy
	//Description: adds the given enemy to the boards enemy list
	addEnemy() {
		this.enemies.push(new Enemy());
	}

	//Function: addObstacle
	//Description: adds the given enemy to the boards enemy list
	addObstacle() {
		this.obstacles.push(new Obstacle());
	}

	//Function: timeCheck
	//Description: determines if a new enemy/obstacle should be added to the board
	timeCheck() {
		// Get current timestamp
		this.currTime = new Date().getTime();

		// Checking to see if the time has elapsed to generate a new enemy to put on the board
		if (this.currTime - this.enemyInitTime > this.enemyGenTime) {
			this.addEnemy();		// Adding the new enemy
			this.enemyInitTime = new Date().getTime();	// Getting the current time to track for enemy generation
			this.enemyGenTime = Math.floor(Math.random() * (maxRandTime - minRandTime + 1) + minRandTime);	// Random time for enemy generation 
		}

		// Checking to see if the time has elapsed to generate a new obstacle to put on the board
		if (this.currTime - this.obstacleInitTime > this.obstacleGenTime) {
			this.addObstacle();		// Adding the new obstacle
			this.obstacleInitTime = new Date().getTime();	// Getting the current time to track for obstacle generation
			this.obstacleGenTime = Math.floor(Math.random() * (maxRandTime - minRandTime + 1) + minRandTime);	// Random time for obstacle generation
		}
	}

    // Function: redraw
    // Description: Redraws the entire board. Called whenever something moves
    redraw() {
		//Draw the first dividing line
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.rowHeight);
		this.ctx.lineTo(this.width, this.rowHeight);
		this.ctx.stroke();
		//Draw the second dividing line
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.rowHeight * 2);
		this.ctx.lineTo(this.width, this.rowHeight * 2);
		this.ctx.stroke();
		
		//Redraw enemies, players, and obstacles
        this.player.redraw();
		
		
		this.timeCheck();

        for ( let i=0; i < this.enemies.length; i++ ) {
			this.ctx.clearRect(this.enemies[i].x, 
				this.enemies[i].row * this.enemies[i].rowHeight + 2.5,
				this.enemies[i].dim + 3, this.enemies[i].dim);
            this.enemies[i].redraw();
        }
		for ( let i=0; i < this.obstacles.length; i++ ) {
			this.ctx.clearRect(this.obstacles[i].x, 
				this.obstacles[i].row * this.obstacles[i].rowHeight + 2.5,
				this.obstacles[i].dim + 3, this.obstacles[i].dim);
            this.obstacles[i].redraw();
        }
		
		var score = "SCORE: " + this.playerScore.toString();
		var metrics = this.ctx.measureText(score);
		this.ctx.clearRect(this.width - 10 - metrics.width, 5, metrics.width, 20);
		this.ctx.font = '16px serif';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(score, this.width - 10 - metrics.width, 20);
		if (!this.playerBlocked) {
			this.playerScore += 1;
		} else if (this.playerScore > 0) {
			this.playerScore -= 1;
		}
    }

    // Function: showGameOver
    // Description: Called when the game is over. Shows the game over screen and asks the user if they want to play again
    showGameOver() {
        $("#scoreSlot").text(this.playerScore.toString());
		$("#gameOverScreen").css("visibility", "visible");

		// Setting the local high score if there is a new high score
		var highscore = localStorage.getItem("#highScore") ? localStorage.getItem("#highScore") : null;
		if(highscore !== null){
			if (this.playerScore > highscore) {
				$("#highScore").text(this.playerScore.toString());
				highscore = this.playerScore;     
				localStorage.setItem("#highScore", this.playerScore);
			}
			$("#highScore").text(this.highscore);
		}
		else{
			$("#highScore").text(this.playerScore.toString());
			localStorage.setItem("#highScore", this.playerScore);
		}
    }

	// Function: update
	// Input: delta - the amount of time that has passed since the last update
	// Description: Calls the corresponding update functions for all things that need to update as time passes
	//				Then checks if a collision has occured, or if an entity has gone off screen
	update(delta) {
		// If the player is blocked: don't bother updating
		if ( this.playerBlocked ) {
			return;
		}

		// Update the non-players... and check if they now have a collision or are out of bounds
		// Update Enemies:
		var enemiesToDelete = [];
		console.log("updating enemies");
		for ( let i=0; i < this.enemies.length; i++ ) {
			this.enemies[i].update(delta);

			// Collision Check
			if ( this.enemies[i].row == this.player.row &&
				 this.enemies[i].x > this.player.x && 
				 this.enemies[i].x < (this.player.x + this.player.dim) ) {
				this.gameOver = true;
				// TODO: Any more events that should happen after hitting an enemy go here
			}
			// Out-of-bounds check
			if ( this.enemies[i].x < (0 - this.enemies[i].dim) ) {
				// Since we're looping through the array of enemies right now, we don't want to delete the enemy just yet
				// So mark it for deletion so that we can delete it after exiting the loop
				enemiesToDelete.push(i);
			}
        }
		// Perform our deletions
		for ( let i= enemiesToDelete.length - 1; i >=0; i-- ) {
			this.enemies.splice(enemiesToDelete[i], 1);
		}

		// Update Obstacles:
		var obstaclesToDelete = [];
		for ( let i=0; i < this.obstacles.length; i++ ) {
			this.obstacles[i].update(delta);

			// Collision Check
			if ( this.obstacles[i].row == this.player.row &&
				 this.obstacles[i].x > this.player.x && 
				 this.obstacles[i].x < (this.player.x + this.player.dim) ) {
				this.playerBlocked = true;
				// TODO: Any more events that should happen after hitting an obstacle go here
			}
			// Out-of-bounds check
			if ( this.obstacles[i].x < (0 - this.obstacles[i].dim) ) {
				// Since we're looping through the array of obstacles right now, we don't want to delete the enemy just yet
				// So mark it for deletion so that we can delete it after exiting the loop
				obstaclesToDelete.push(i);
			}
        }
		// Perform our deletions
		for ( let i= obstaclesToDelete.length - 1; i >=0; i-- ) {
			this.obstacles.splice(obstaclesToDelete[i], 1);
		}
	}
}

// Class: Entity
// Description: Abstract class representing an entity on the board. Could be a player or non-player
class Entity {
    constructor(img, startingPath) {
        this.img = img;
        this.row = startingPath;
		this.rowHeight = $("#canvas").get()[0].height / 3;
		this.dim = this.rowHeight - 5;
    }

    // Function: redraw
    // Description: Redraw this entity on the canvas
    redraw() {
		var ctx = $("#canvas").get()[0].getContext("2d");
        var pos = [this.x, this.row * this.rowHeight + 2.5];
		ctx.drawImage(this.img, pos[0], pos[1], this.dim, this.dim);
    }
}

// Class: Player
// Description: Represents the player unit on the board
class Player extends Entity {
    constructor(startingPath) {
        super(document.getElementById("benny"), startingPath);
		this.x = 0;
    }
}

// Class: NonPlayer
// Description: Abstract class outlining common characteristics/functions for nonplayer units
class NonPlayer extends Entity {
    constructor(img) {
        super(img, Math.floor(Math.random() * NUM_ROWS));
		// this.x = $("#canvas").get()[0].width - $("#canvas").get()[0].height / 3;
		this.x = $("#canvas").get()[0].width;
    }

	// Function: update
	// Input: delta - the time since the last update
	// Description: updates the position of the entity based on delta and its velocity
	update(delta) {
		this.x += this.velocity * delta;
	}
}

// Class: Enemy
// Description: Represents a single enemy on the board
class Enemy extends NonPlayer {
    constructor() {
		let possibleImages = [document.getElementById("enemy1")];
        let enemyImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( enemyImage );
		this.velocity = -0.08;
    }
}

// Class: Obstacle
// Description: Represents a single obstacle on the board
class Obstacle extends NonPlayer {
    constructor() {
        let possibleImages = [document.getElementById("wall")];
        let obstacleImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( obstacleImage );
		this.velocity = -0.08;
    }
}