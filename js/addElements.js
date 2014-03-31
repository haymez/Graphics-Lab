/*
 * Adds elements such as buttons, canvas', and divs
 */
var figNum = 0; //This will be removed eventually when dealing with namespace issues

//Find container object and set width and height
var container = document.getElementById("container");
container.style.width = "635px";
container.style.height = "400px";

//Drawing window <div>
var drawDiv = document.createElement('div');
drawDiv.id = "draw_window" + figNum;
drawDiv.style.width = "300px";
drawDiv.style.height = "350px";
drawDiv.style.cssFloat = "right";

//Program window <div>
var programWindowDiv = document.createElement('div');
programWindowDiv.id = "program_window" + figNum;
programWindowDiv.style.width = "325px";
programWindowDiv.style.height = "300px";
programWindowDiv.style.cssFloat = "left";

//program Code window
var programDiv = document.createElement('div');
programDiv.id = "program_code" + figNum;
programDiv.style.width = "250px";
programDiv.style.height = programWindowDiv.style.height;
programDiv.style.border = "ridge";
programDiv.style.overflow = "auto";
programDiv.style.cssFloat = "left";

//Div for program code table
var programCodeDiv = document.createElement('div');
programCodeDiv.id = "programCodeDiv" + figNum;
programCodeDiv.style.width = "220px";
programCodeDiv.style.position = "relative";
programCodeDiv.style.left = "15px";

//Table for Program Code
var codeTable = document.createElement('table');
codeTable.id = 'editor' + figNum;
codeTable.className = "codeTable";
codeTable.style.fontSize = "14px";
codeTable.style.position = "absolute";

//div for insert table
var insertDiv = document.createElement('div');
insertDiv.id = "insertDiv" + figNum;
insertDiv.style.width = "18px";
insertDiv.style.cssFloat = "left";

//div to offset insert table
var offsetDiv = document.createElement('div');
offsetDiv.id = "offset_div" + figNum;
offsetDiv.style.width = "14px";
offsetDiv.style.height = "9px";

//insertion selection table
var insertTable = document.createElement('table');
insertTable.id = "insertTable" + figNum;
insertTable.style.fontSize = "14px";
insertTable.style.cssFloat = "left";

//Insertion bar divider div
var dividerDiv = document.createElement('div');
dividerDiv.id = "dividerDiv" + figNum;
dividerDiv.style.height = Number(programWindowDiv.style.height.substring(0, programWindowDiv.style.height.length-2))-4 + "px";
dividerDiv.style.border = "1px solid #000000";
dividerDiv.style.position = "absolute";
dividerDiv.style.left = "15px";
dividerDiv.style.zIndex = "-1";

//<div> for run and walk buttons
var run_walkDiv = document.createElement('div');
run_walkDiv.id = "run_walk" + figNum;
run_walkDiv.style.width = "220px";
run_walkDiv.style.cssFloat = "right";
run_walkDiv.className = "btn-group";

//<p> for variable value title
var varValueTitle = document.createElement('p');
varValueTitle.id = "varValOuterP" + figNum;
varValueTitle.innerHTML = '<b>&nbspInternal Variables</b>';
varValueTitle.style.position = "relative";
varValueTitle.style.top = "14px";

//<div> for variable value window
var varValueDiv = document.createElement('div');
varValueDiv.id = "varValDiv" + figNum;
varValueDiv.style.overflow = "auto";
//varValueDiv.style.width = "650px";
varValueDiv.style.width = container.style.width;
varValueDiv.style.height = "100px";
varValueDiv.style.resize = "none";
varValueDiv.style.border = "1px solid #000";

// <div> holder for varValueDiv <div> and varValueTitle <p>
var vvDivHolder = document.createElement('div');
vvDivHolder.id ="vvDivHolder" + figNum;
vvDivHolder.appendChild(varValueTitle);
vvDivHolder.appendChild(varValueDiv);
vvDivHolder.style.display = "none";
vvDivHolder.style.cssFloat = "left";

//<div> for buttons
var progButtonDiv = document.createElement('div');
progButtonDiv.id = "program_buttons" + figNum;
progButtonDiv.style.cssFloat = "right";
progButtonDiv.className = "btn-group-vertical";

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
runButton.innerHTML = "Run";
runButton.className = "btn btn-default btn-sm";

var walkButton = document.createElement('button');
walkButton.id = "walkButton" + figNum;
walkButton.style.width = "70px";
walkButton.innerHTML = "Walk";
walkButton.className = "btn btn-default btn-sm";

var distanceButton = document.createElement('button');
distanceButton.id = "distanceButton" + figNum;
distanceButton.style.width = "70px";
distanceButton.onclick = function() {newDistance();};
distanceButton.innerHTML = "Distance";
distanceButton.className = "btn btn-primary btn-sm";

var pointButton = document.createElement('button');
pointButton.id = "pointButton" + figNum;
pointButton.style.width = "70px";
pointButton.onclick = function() {drawPoint();};
pointButton.innerHTML = "Point";
pointButton.className = "btn btn-primary btn-sm";

var lineButton = document.createElement('button');
lineButton.id = "lineButton" + figNum;
lineButton.style.width = "70px";
lineButton.onclick = function() {drawLine();};
lineButton.innerHTML = "Line";
lineButton.className = "btn btn-primary btn-sm";

var polygonButton = document.createElement('button');
polygonButton.id = "polygonButton" + figNum;
polygonButton.style.width = "70px";
polygonButton.onclick = function() {drawPolygon();};
polygonButton.innerHTML = "Polygon";
polygonButton.className = "btn btn-primary btn-sm";

var circleButton = document.createElement('button');
circleButton.id = "circleButton" + figNum;
circleButton.style.width = "70px";
circleButton.onclick = function() {drawCircle();};
circleButton.innerHTML = "Circle";
circleButton.className = "btn btn-primary btn-sm";

var assignButton = document.createElement('button');
assignButton.id = "assignButton" + figNum;
assignButton.style.width = "70px";
assignButton.onclick = function() {assign();};
assignButton.innerHTML = "Assign";
assignButton.className = "btn btn-success btn-sm";

var drawButton = document.createElement('button');
drawButton.id = "drawButton" + figNum;
drawButton.style.width = "70px";
drawButton.onclick = function() {drawShape();};
drawButton.innerHTML = "Draw";
drawButton.className = "btn btn-success btn-sm";

var eraseButton = document.createElement('button');
eraseButton.id = "eraseButton" + figNum;
eraseButton.style.width = "70px";
eraseButton.onclick = function() {erase();};
eraseButton.innerHTML = "Erase";
eraseButton.className = "btn btn-success btn-sm";

var colorButton = document.createElement('button');
colorButton.id = "colorButton" + figNum;
colorButton.style.width = "70px";
colorButton.onclick = function() {changeColor();};
colorButton.innerHTML = "Color";
colorButton.className = "btn btn-success btn-sm";

var loopButton = document.createElement('button');
loopButton.id = "loopButton" + figNum;
loopButton.style.width = "70px";
loopButton.onclick = function() {loop();};
loopButton.innerHTML = "Loop";
loopButton.className = "btn btn-success btn-sm";

//Define window label
var drawLabel = "Drawing Window";
var varLabel = "Variable Declarations";
var progLabel = "Program Code";

//Add everything to Drawing Window <div>
run_walkDiv.appendChild(runButton);
run_walkDiv.appendChild(walkButton);
drawDiv.appendChild(canvas);
drawDiv.appendChild(run_walkDiv);

//Add everything to the Program Code <div>
progButtonDiv.appendChild(distanceButton);
progButtonDiv.appendChild(pointButton);
progButtonDiv.appendChild(lineButton);
progButtonDiv.appendChild(polygonButton);
progButtonDiv.appendChild(circleButton);
progButtonDiv.appendChild(assignButton);
progButtonDiv.appendChild(drawButton);
progButtonDiv.appendChild(eraseButton);
progButtonDiv.appendChild(colorButton);
progButtonDiv.appendChild(loopButton);
insertDiv.appendChild(offsetDiv);
insertDiv.appendChild(insertTable);
programCodeDiv.appendChild(codeTable);
programDiv.appendChild(insertDiv);
programDiv.appendChild(dividerDiv);
programDiv.appendChild(programCodeDiv);
programWindowDiv.appendChild(progButtonDiv);
programWindowDiv.appendChild(programDiv);

//Append to container
container.appendChild(programWindowDiv);
container.appendChild(drawDiv);
container.style.position = "relative"; 
container.appendChild(vvDivHolder);

//Add listeners for walk and run
$("#" + runButton.id).click(function() { run(); });
$("#" + walkButton.id).click(function() { walk(); });


$(document).ready(function() {
	toggleEvents();
})








