/*
 * Adds elements such as buttons, canvas', and divs
 */
var figNum = 0;

//Drawing window <div>
var drawDiv = document.createElement('div');
drawDiv.id = "draw_window" + figNum;
drawDiv.style.width = "300px";
drawDiv.style.height = "350px";
drawDiv.style.cssFloat = "right";

//Variable window area <div>
var variableWindowDiv = document.createElement('div');
variableWindowDiv.id = "variable_window" + figNum;
variableWindowDiv.style.width = "300px";
variableWindowDiv.style.height = "150px";
variableWindowDiv.style.cssFloat = "left";

//<div> for variable window
var variableDiv = document.createElement('div');
variableDiv.id = "var_win" + figNum;
variableDiv.style.width = "210px";
variableDiv.style.height = "128px";
variableDiv.style.border = "ridge";
variableDiv.style.overflow = "auto";
variableDiv.style.cssFloat = "left";

//Program window <div>
var programWindowDiv = document.createElement('div');
programWindowDiv.id = "program_window" + figNum;
programWindowDiv.style.width = "300px";
programWindowDiv.style.height = "300px";
programWindowDiv.style.cssFloat = "left";

//program window
var programDiv = document.createElement('div');
programDiv.id = "program_code" + figNum;
programDiv.style.width = "210px";
programDiv.style.height = "260px";
programDiv.style.border = "ridge";
programDiv.style.overflow = "auto";
programDiv.style.cssFloat = "left";
programDiv.style.fontSize = "10pt"; //This may be syntactically wrong

//<div> for run and walk buttons
var run_walkDiv = document.createElement('div');
run_walkDiv.id = "run_walk" + figNum;
run_walkDiv.style.width = "220px";
run_walkDiv.style.height = "25px";
run_walkDiv.style.cssFloat = "right";

//<div> for variable window buttons
var buttonDiv = document.createElement('div');
buttonDiv.id = "buttons" + figNum;
buttonDiv.style.width = "70px";
buttonDiv.style.height = "130px";
buttonDiv.style.cssFloat = "right";

//<div> for program buttons
var progButtonDiv = document.createElement('div');
progButtonDiv.id = "program_buttons" + figNum;
progButtonDiv.style.width = "83px";
progButtonDiv.style.height = "155px";
progButtonDiv.style.cssFloat = "right";

//<canvas> element for drawing window
var canvas = document.createElement('canvas');
canvas.id = "drawCanvas" + figNum;
canvas.width = "300px";
canvas.height = "300px";
canvas.style.border = "1px solid";

//<button> elements
var runButton = document.createElement('button');
runButton.id = "runButton" + figNum;
runButton.onclick = function() {run()};
runButton.innerHTML = "Run";

var walkButton = document.createElement('button');
walkButton.id = "walkButton" + figNum;
walkButton.onclick = function() {walk()};
walkButton.innerHTML = "Walk";














