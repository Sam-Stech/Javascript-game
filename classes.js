const NUM_ROWS = 3;

// Class: Board
// Description: Represents the entire board. Keeps track of the current game
class Board {
    constructor() {
		this.width = $("#canvas").get()[0].width; //Width of the board is equal to width of canvas
		this.rowHeight = $("#canvas").get()[0].height / 3;
		this.player = new Player(this.rowHeight, 2); // Single player object on the board
		this.enemies = [new Enemy(this.width - this.rowHeight, this.getRandomRow(), this.rowHeight)]; // list of enemies currently on the board

        this.obsticles = []; // list of obsticles currently on the board
		this.gameOver = false;
		this.ctx = $("#canvas").get([0]).getContext("2d");
        // draw the board
        this.redraw();
		$("#canvas").css("display", "block");
    }

	//Generating a random row number between [1:NUM_ROWS] for enemy & obstacle initial generation position
	getRandomRow() {
		return (Math.floor(Math.random() * NUM_ROWS) * this.rowHeight);
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
		console.log("Redrawing");
		
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
		//Redraw enemies, players, and obsticles
        this.player.redraw(0, this.rowHeight * (this.player.row - 1));
        this.enemies.forEach(enemy=>{enemy.redraw();});
        this.obsticles.forEach(obsticle=>{obsticle.redraw();});
    }
}

// Class: Entity
// Description: Abstract class representing an entity on the board. Could be a player or non-player
class Entity {
    constructor(imgPath, startingPath) {
        this.imgPath = imgPath;
        this.row = startingPath;
    }

    // Function: redraw
    // Description: Redraw this entity on the canvas
    redraw() {
		var img = new Image();
        img.src = this.imgPath;
        var tempPos = this.pos;
        img.onload = function() {
            ctx.drawImage(img, tempPos[0], tempPos[1]);
        }
        console.log("Drawing Enemy at " + tempPos[0] + " - " + tempPos[1]);
    }
}

// Class: Player
// Description: Represents the player unit on the board
class Player extends Entity {
    constructor(dim, startingPath) {
        super("./images/benny.png", startingPath);
		this.img = document.getElementById("benny");
		this.dim = dim;
    }
	
	redraw(x, y) {
		var ctx = $("#canvas").get()[0].getContext("2d");
		console.log("drawing player at 0 " + y);
		ctx.drawImage(this.img, x, y, this.dim, this.dim);
	}
}

// Class: NonPlayer
// Description: Abstract class outlining common characteristics/functions for nonplayer units
class NonPlayer extends Entity {
    constructor(imgPath) {
		console.log("called nonplayer constructor");
        super(imgPath, 1); //Math.floor((Math.random() * 3) + 1)
    }
}

// Class: Enemy
// Description: Represents a single enemy on the board
class Enemy extends NonPlayer {
    constructor(x, y, dim) {
		console.log("called enemy constructor");
		console.log("canvas width " + x);
		let possibleImages = [];
        let enemyImage = "./images/enemy1.png" //possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( enemyImage );
		this.img = document.getElementById("enemy1");
		this.x = x;
		this.y = y;
		this.dim = dim;
    }
	
	redraw() {
		var ctx = $("#canvas").get()[0].getContext("2d");
		ctx.drawImage(this.img, this.x-=10, this.y, this.dim, this.dim); //Updates characters position by 10
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