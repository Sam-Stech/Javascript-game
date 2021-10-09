const NUM_ROWS = 3;

// Class: Board
// Description: Represents the entire board. Keeps track of the current game
class Board {
    constructor() {
		this.width = $("#canvas").get()[0].width; //Width of the board is equal to width of canvas
		this.rowHeight = $("#canvas").get()[0].height / 3;
		this.player = new Player(1); // Single player object on the board
		this.enemies = [new Enemy()]; // list of enemies currently on the board

        this.obstacles = []; // list of obstacles currently on the board
		this.gameOver = false;
		this.ctx = $("#canvas").get([0]).getContext("2d");

        // draw the board
        this.redraw();
		$("#canvas").css("display", "block");
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
		
		//Redraw white background
		this.ctx.beginPath();
		this.ctx.rect(0,0, this.width, this.rowHeight * 3);
		this.ctx.fillStyle = "white";
		this.ctx.fill();
		
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
		
		console.log(this.player.path);
		//Redraw enemies, players, and obstacles
        this.player.redraw();
        for ( let i=0; i < this.enemies.length; i++ ) {
			this.enemies[i].x-=10;
            this.enemies[i].redraw();
        }
		for ( let i=0; i < this.obstacles.length; i++ ) {
            this.obstacles[i].redraw();
        }
    }
}

// Class: Entity
// Description: Abstract class representing an entity on the board. Could be a player or non-player
class Entity {
    constructor(imgPath, startingPath) {
        this.imgPath = imgPath;
        this.row = startingPath;
		this.rowHeight = $("#canvas").get()[0].height / 3;
		this.dim = this.rowHeight - 5;
    }

    // Function: redraw
    // Description: Redraw this entity on the canvas
    redraw() {
		var ctx = $("#canvas").get()[0].getContext("2d");
		// var img = new Image();
        // img.src = this.imgPath;
        var tempPos = [this.x, this.row * this.rowHeight + 2.5];
		var tempDim = this.dim;
        // img.onload = function() {
        //     ctx.drawImage(img, tempPos[0], tempPos[1], tempDim, tempDim);
        // }
		ctx.drawImage(this.img, tempPos[0], tempPos[1], tempDim, tempDim);
    }
}

// Class: Player
// Description: Represents the player unit on the board
class Player extends Entity {
    constructor(startingPath) {
        super("./images/benny.png", startingPath);
		this.img = document.getElementById("benny");
		this.x = 0;
    }
}

// Class: NonPlayer
// Description: Abstract class outlining common characteristics/functions for nonplayer units
class NonPlayer extends Entity {
    constructor(imgPath) {
		console.log("called nonplayer constructor");
        super(imgPath, Math.floor(Math.random() * NUM_ROWS));
		this.x = $("#canvas").get()[0].width - $("#canvas").get()[0].height / 3;
    }
}

// Class: Enemy
// Description: Represents a single enemy on the board
class Enemy extends NonPlayer {
    constructor() {
		console.log("called enemy constructor");
		let possibleImages = ["./images/enemy1.png"];
        let enemyImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];

        super( enemyImage );
		this.img = document.getElementById("enemy1");
    }
}

// Class: Obstacle
// Description: Represents a single obstacle on the board
class Obstacle extends NonPlayer {
    constructor() {
        let possibleImages = [];
        let enemyImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( enemyImage );
    }
}