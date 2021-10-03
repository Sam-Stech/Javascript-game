// Class: Board
// Description: Represents the entire board. Keeps track of the current game
class Board {
    constructor() {
        this.player = new Player("", 2); // Single player object on the board
        this.enemies = []; // list of enemies currently on the board
        this.obsticles = []; // list of obsticles currently on the board

        // draw the board
        this.redraw();
    }

    // Function: redraw
    // Descrption: Redraws the entire board. Called whenever something moves
    redraw() {
        this.player.redraw();
        this.enemies.forEach(enemy=>{enemy.redraw();});
        this.obsticles.forEach(obsticle=>{obsticle.redraw();})
    }
}

// Class: Entity
// Description: Abstract class representing an entity on the board. Could be a player or non-player
class Entity {
    constructor(imgPath, startingPath) {
        this.imgPath = imgPath;
        this.path = startingPath;
    }

    // Function: redraw
    // Description: Redraw this entity on the canvas
    redraw() {

    }
}

// Class: Player
// Description: Represents the player unit on the board
class Player extends Entity {
    constructor(imgPath, startingPath) {
        super(imgPath, startingPath);
    }
}

// Class: NonPlayer
// Description: Abstract class outlining common characteristics/functions for nonplayer units
class NonPlayer extends Entity {
    constructor(imgPath) {
        super(imgPath, Math.floor((Math.random() * 3) + 1));
    }
}

// Class: Enemy
// Description: Represents a single enemy on the board
class Enemy extends NonPlayer {
    constructor() {
        let possibleImages = [];
        let enemyImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( enemyImage );
    }
}

// Class: Obsticle
// Description: Represents a single obsticle on the board
class Obsticle extends NonPlayer {
    constructor() {
        let possibleImages = [];
        let enemyImage = possibleImages[Math.floor((Math.random() * (possibleImages.length)))];
        super( enemyImage );
    }
}