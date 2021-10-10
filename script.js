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

	// Make the board
	let board = new Board();
});
