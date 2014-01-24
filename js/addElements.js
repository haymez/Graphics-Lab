/*
 * Adds elements such as buttons, canvas', and divs
 */
var figNum = 0; //This will be removed eventually when dealing with namespace issues

//Drawing window <div>
var drawDiv = document.createElement('div');
drawDiv.id = "draw_window" + figNum;
drawDiv.style.width = "300px";
drawDiv.style.height = "350px";
drawDiv.style.cssFloat = "right";

//Variable window area <div>
var variableWindowDiv = document.createElement('div');
variableWindowDiv.id = "variable_window" + figNum;
variableWindowDiv.style.width = "330px"; //added 30
variableWindowDiv.style.height = "150px";
variableWindowDiv.style.cssFloat = "left";

//<div> for variable window
var variableDiv = document.createElement('div');
variableDiv.id = "var_win" + figNum;
variableDiv.style.width = "240px"; //added 30
variableDiv.style.height = "128px";
variableDiv.style.border = "ridge";
variableDiv.style.overflow = "auto";
variableDiv.style.cssFloat = "left";
variableDiv.style.fontSize = "13px";

//Program window <div>
var programWindowDiv = document.createElement('div');
programWindowDiv.id = "program_window" + figNum;
programWindowDiv.style.width = "330px"; //added 30
programWindowDiv.style.height = "300px";
programWindowDiv.style.cssFloat = "left";

//program Code window
var programDiv = document.createElement('div');
programDiv.id = "program_code" + figNum;
programDiv.style.width = "240px"; //added 30
programDiv.style.height = "260px";
programDiv.style.border = "ridge";
programDiv.style.overflow = "auto";
programDiv.style.cssFloat = "left";

//Table for Program Code
var codeTable = document.createElement('table');
codeTable.id = 'editor' + figNum;
codeTable.className = "codeTable";
codeTable.style.fontSize = "13px";

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
canvas.width = "300";
canvas.height = "300";
canvas.style.border = "1px solid";

//All <button> elements
var runButton = document.createElement('button');
runButton.id = "runButton" + figNum;
runButton.style.width = "70px";
runButton.onclick = function() {run()};
runButton.innerHTML = "Run";

var walkButton = document.createElement('button');
walkButton.id = "walkButton" + figNum;
walkButton.style.width = "70px";
walkButton.onclick = function() {walk()};
walkButton.innerHTML = "Walk";

var distanceButton = document.createElement('button');
distanceButton.id = "distanceButton" + figNum;
distanceButton.style.width = "70px";
distanceButton.onclick = function() {newDistance();};
distanceButton.innerHTML = "Distance";

var pointButton = document.createElement('button');
pointButton.id = "pointButton" + figNum;
pointButton.style.width = "70px";
pointButton.onclick = function() {drawPoint();};
pointButton.innerHTML = "Point";

var lineButton = document.createElement('button');
lineButton.id = "lineButton" + figNum;
lineButton.style.width = "70px";
lineButton.onclick = function() {drawLine();};
lineButton.innerHTML = "Line";

var polygonButton = document.createElement('button');
polygonButton.id = "polygonButton" + figNum;
polygonButton.style.width = "70px";
polygonButton.onclick = function() {drawPolygon();};
polygonButton.innerHTML = "Polygon";

var circleButton = document.createElement('button');
circleButton.id = "circleButton" + figNum;
circleButton.style.width = "70px";
circleButton.onclick = function() {drawCircle();};
circleButton.innerHTML = "Circle";

var assignButton = document.createElement('button');
assignButton.id = "assignButton" + figNum;
assignButton.style.width = "70px";
assignButton.onclick = function() {assign();};
assignButton.innerHTML = "Assign";
assignButton.style.cssFloat = "right";

var drawButton = document.createElement('button');
drawButton.id = "drawButton" + figNum;
drawButton.style.width = "70px";
drawButton.onclick = function() {drawShape();};
drawButton.innerHTML = "Draw";
drawButton.style.cssFloat = "right";

var eraseButton = document.createElement('button');
eraseButton.id = "eraseButton" + figNum;
eraseButton.style.width = "70px";
eraseButton.onclick = function() {erase();};
eraseButton.innerHTML = "Erase";
eraseButton.style.cssFloat = "right";

var colorButton = document.createElement('button');
colorButton.id = "colorButton" + figNum;
colorButton.style.width = "70px";
colorButton.onclick = function() {changeColor();};
colorButton.innerHTML = "Color";
colorButton.style.cssFloat = "right";

var loopButton = document.createElement('button');
loopButton.id = "loopButton" + figNum;
loopButton.style.width = "70px";
loopButton.onclick = function() {loop();};
loopButton.innerHTML = "Loop";
loopButton.style.cssFloat = "right";

//Define window label
var drawLabel = "Drawing Window";
var varLabel = "Variable Declarations";
var progLabel = "Program Code";

//Add everything to Drawing Window <div>
drawDiv.appendChild(canvas);
run_walkDiv.appendChild(runButton);
run_walkDiv.appendChild(walkButton);
drawDiv.appendChild(run_walkDiv);

//Add everything to the Variable Window <div>
variableWindowDiv.appendChild(variableDiv);
buttonDiv.appendChild(distanceButton);
buttonDiv.appendChild(pointButton);
buttonDiv.appendChild(lineButton);
buttonDiv.appendChild(polygonButton);
buttonDiv.appendChild(circleButton);
variableWindowDiv.appendChild(buttonDiv);

//Add everything to the Program Code <div>
progButtonDiv.appendChild(assignButton);
progButtonDiv.appendChild(drawButton);
progButtonDiv.appendChild(eraseButton);
progButtonDiv.appendChild(colorButton);
progButtonDiv.appendChild(loopButton);
programDiv.appendChild(codeTable);
programWindowDiv.appendChild(progButtonDiv);
programWindowDiv.appendChild(programDiv);

var container = document.getElementById("container");
container.appendChild(drawDiv);
container.appendChild(variableWindowDiv);
container.appendChild(programWindowDiv);











