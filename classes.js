// Set the dimensions of the canvas
let canvasWidth = window.innerWidth - 50;
let canvasHeight = window.innerHeight - 50;
$("#canvas").attr("width", canvasWidth);
$("#canvas").attr("height", canvasHeight);

ctx = $("#canvas").get()[0].getContext("2d");
cHeight = $("#canvas").get()[0].height;
cWidth = $("#canvas").get()[0].width;

// Class: Board
// Description: Represents the entire board. Keeps track of the current game
class Board {
    constructor() {
        this.player = new Player("images/benny.png", 2); // Single player object on the board
        this.enemies = [new Enemy()]; // list of enemies currently on the board
        this.obstacles = []; // list of obstacles currently on the board
		this.width = $("#canvas").get()[0].width; //Width of the board is equal to width of canvas
		this.rowHeight = $("#canvas").get()[0].height / 3;
        // draw the board
        this.redraw();
    }

    // Function: redraw
    // Description: Redraws the entire board. Called whenever something moves
    redraw() {
        this.player.redraw();
        // this.enemies.forEach(enemy=>{enemy.redraw();});
        for ( let i=0; i < this.enemies.length; i++ ) {
            this.enemies[i].redraw();
        }
        this.obstacles.forEach(obstacle=>{obstacle.redraw();});
		
		//Draw the first dividing line
		ctx.beginPath();
		ctx.moveTo(0, this.rowHeight);
		ctx.lineTo(this.width, this.rowHeight);
		ctx.stroke();
		//Draw the second dividing line
		ctx.beginPath();
		ctx.moveTo(0, this.rowHeight * 2);
		ctx.lineTo(this.width, this.rowHeight * 2);
		ctx.stroke();
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
    constructor(imgPath, startingPath) {
        super(imgPath, startingPath);

        let posX = 150;
        let rowHeight = $("#canvas").get()[0].height / 3;
        let posY = rowHeight * startingPath - (rowHeight / 2);
        this.pos = [posX, posY];
    }
}

// Class: NonPlayer
// Description: Abstract class outlining common characteristics/functions for nonplayer units
class NonPlayer extends Entity {
    constructor(imgPath) {
        let row = Math.floor((Math.random() * 3) + 1);
        super(imgPath, row);

        let posX = $("#canvas").get()[0].width - 150;
        let rowHeight = $("#canvas").get()[0].height / 3;
        let posY = rowHeight * row - (rowHeight / 2);
        this.pos = [posX, posY];
    }
}

// Class: Enemy
// Description: Represents a single enemy on the board
class Enemy extends NonPlayer {
    constructor() {
        let possibleImages = ["images/enemy1.png"];
        let enemyImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( enemyImage );
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