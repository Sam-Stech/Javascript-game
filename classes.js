const NUM_ROWS = 3;

// Class: Board
// Description: Represents the entire board. Keeps track of the current game
class Board {
    constructor() {
		this.width = $("#canvas").get()[0].width; //Width of the board is equal to width of canvas
		this.rowHeight = $("#canvas").get()[0].height / 3;
		this.player = new Player(1); // Single player object on the board
		console.log(this.player.row);
		this.enemies = [new Enemy()]; // list of enemies currently on the board
        this.obstacles = [new Obstacle()]; // list of obstacles currently on the board
		this.gameOver = false;
		this.playerBlocked = false;
		this.ctx = $("#canvas").get([0]).getContext("2d");

        // draw the board
        this.redraw();
		$("#canvas").css("display", "inline-block");
		
		var currentBoard = this;
		document.addEventListener("keydown", function(e) {
			currentBoard.ctx.clearRect(currentBoard.player.x, currentBoard.player.row * currentBoard.player.rowHeight + 2.5,
				currentBoard.player.dim, currentBoard.player.dim);
			if (e.code == "ArrowUp" && currentBoard.player.row > 0) {
				currentBoard.player.row -= 1;
			} else if (e.code == "ArrowDown" && currentBoard.player.row < 2) {
				currentBoard.player.row += 1;
			}
			
			currentBoard.player.redraw();
		});
    }
	
	//Function: startGame
	//Begins the animation and creates the necessary event handlers.
	startGame() {
		console.log("Started game");
		this.redraw();	
	}
	
	//Function: addEnemy
	//Description: adds the given enemy to the boards enemy list
	addEnemy(enemy) {
		this.push(enemy);
	}

    // Function: redraw
    // Description: Redraws the entire board. Called whenever something moves
    redraw() {
		// console.log("Redrawing");
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
        for ( let i=0; i < this.enemies.length; i++ ) {
			this.ctx.clearRect(this.enemies[i].x, 
				this.enemies[i].row * this.enemies[i].rowHeight + 2.5,
				this.enemies[i].dim + 3, this.enemies[i].dim);
			this.enemies[i].x-=10;
            this.enemies[i].redraw();
        }
		for ( let i=0; i < this.obstacles.length; i++ ) {
			this.ctx.clearRect(this.obstacles[i].x, 
				this.obstacles[i].row * this.obstacles[i].rowHeight + 2.5,
				this.obstacles[i].dim + 3, this.obstacles[i].dim);
            this.obstacles[i].redraw();
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
		console.log("called player constructor.");
        super(document.getElementById("benny"), startingPath);
		this.x = 0;
		console.log(this.row);
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