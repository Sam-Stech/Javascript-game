$(document).ready(function() {
	// Set the dimensions of the canvas
	let canvasWidth = window.innerWidth - 50;
	let canvasHeight = window.innerHeight - 50;
	$("#canvas").attr("width", canvasWidth);
	$("#canvas").attr("height", canvasHeight);
	$("#canvas").attr("margin-right", -canvasWidth);
	document.getElementById("canvas").style.background = "transparent";
	$("#container").attr("width", canvasWidth);
	$("#container").attr("height", canvasHeight/2);
	$("#background").attr("width", canvasWidth);
	$("#background").attr("height", canvasHeight);

	// Set up animation variables
	var lastFrameTimeMs = 0,
		maxFPS = 60,
		delta = 0,
		timestep = 1000 / 60 // We want to simulate 1000 ms / 60 FPS = 16.667 ms per frame every time we run update()

	// Make the board
	let board = new Board();
	requestAnimationFrame(gameLoop);
	
	// Function: gameLoop
	// Description: Function that gets called whenever the page is ready to update
	//				It gets the timestamp and uses that to calculate a delta, that gets used for
	//				movement calculations. Then redraws the board.
	function gameLoop(timestamp) {
		// Throttle the frame rate.    
		if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
			requestAnimationFrame(gameLoop);
			return;
		}
		// Track the accumulated time that hasn't been simulated yet
		delta += timestamp - lastFrameTimeMs;
		lastFrameTimeMs = timestamp;
	
		 // Simulate the total elapsed time in fixed-size chunks
		var numUpdateSteps = 0;
		while (delta >= timestep) {
			board.update(timestep);
			delta -= timestep;
			// Sanity check
			if (++numUpdateSteps >= 240) {
				panic(); // fix things
				break; // bail out
			}
		}

		// Redraw the board
		board.redraw();

		// Loop if the game is still going
		if ( !board.gameOver ) {
			requestAnimationFrame(gameLoop);
		}
	}

	// Function: panic
	// Description: Enter this function if the catching up on missed frames is taking too long
	//				This usually means we've entered a 'spiral of death' on updating frames...
	function panic() {
		delta = 0;
	}
});