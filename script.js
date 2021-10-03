// Set the dimensions of the canvas
let canvasWidth = window.innerWidth - 50;
let canvasHeight = window.innerHeight - 50;
$("#canvas").attr("width", canvasWidth);
$("#canvas").attr("height", canvasHeight);

// Make the board
let board = new Board();