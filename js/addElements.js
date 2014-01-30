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
variableWindowDiv.style.width = "335px"; //added 35
variableWindowDiv.style.height = "150px";
variableWindowDiv.style.cssFloat = "left";

//<div> for variable window
var variableDiv = document.createElement('div');
variableDiv.id = "var_win" + figNum;
variableDiv.style.width = "245px"; //added 35
variableDiv.style.height = "128px";
variableDiv.style.border = "ridge";
variableDiv.style.overflow = "auto";
variableDiv.style.cssFloat = "left";
variableDiv.style.fontSize = "13px";

//Program window <div>
var programWindowDiv = document.createElement('div');
programWindowDiv.id = "program_window" + figNum;
programWindowDiv.style.width = "335px"; //added 35
programWindowDiv.style.height = "300px";
programWindowDiv.style.cssFloat = "left";

//program Code window
var programDiv = document.createElement('div');
programDiv.id = "program_code" + figNum;
programDiv.style.width = "245px"; //added 35
programDiv.style.height = "260px";
programDiv.style.border = "ridge";
programDiv.style.overflow = "auto";
programDiv.style.cssFloat = "left";

//Table for Program Code
var codeTable = document.createElement('table');
codeTable.id = 'editor' + figNum;
codeTable.className = "codeTable";
codeTable.style.fontSize = "13px";
codeTable.style.borderSpacing = "0px"; //Need to get this working..

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


/************************************************************/




//<div> for whole numpad
var numpadDiv = document.createElement('div');
numpadDiv.id = "keypad_dialog" + figNum;
numpadDiv.title = "Numeric Entry Pad";
numpadDiv.style.border = "ridge";
numpadDiv.style.display = "none";

//<input> for keys pressed
var keypadInput = document.createElement('input');
keypadInput.id = "keypadInput" + figNum;
keypadInput.type = "text";
keypadInput.className = "InputValue";

//<div> for number pad buttons
var numpadKeysDiv = document.createElement('div');
numpadKeysDiv.id = "numpad_div" + figNum;
numpadKeysDiv.style.border = "ridge";

//Unordered list for keypad buttons
var unorderedList = document.createElement('ul');

//<li> items for keypad buttons
var li1 = document.createElement('li');
var numpad1 = document.createElement('input');
numpad1.id = "numpad1" + figNum;
numpad1.type = "button";
numpad1.className = "numpad";
numpad1.value = "1";
li1.appendChild(numpad1);

var li2 = document.createElement('li');
var numpad2 = document.createElement('input');
numpad2.id = "numpad2" + figNum;
numpad2.type = "button";
numpad2.className = "numpad";
numpad2.value = "2";
li2.appendChild(numpad2);

var li3 = document.createElement('li');
var numpad3 = document.createElement('input');
numpad3.id = "numpad3" + figNum;
numpad3.type = "button";
numpad3.className = "numpad";
numpad3.value = "3";
li3.appendChild(numpad3);

var li4 = document.createElement('li');
var numpad4 = document.createElement('input');
numpad4.id = "numpad4" + figNum;
numpad4.type = "button";
numpad4.className = "numpad";
numpad4.value = "4";
li4.appendChild(numpad4);

var li5 = document.createElement('li');
var numpad5 = document.createElement('input');
numpad5.id = "numpad5" + figNum;
numpad5.type = "button";
numpad5.className = "numpad";
numpad5.value = "5";
li5.appendChild(numpad5);

var li6 = document.createElement('li');
var numpad6 = document.createElement('input');
numpad1.id = "numpad6" + figNum;
numpad6.type = "button";
numpad6.className = "numpad";
numpad6.value = "6";
li6.appendChild(numpad6);

var li7 = document.createElement('li');
var numpad7 = document.createElement('input');
numpad7.id = "numpad7" + figNum;
numpad7.type = "button";
numpad7.className = "numpad";
numpad7.value = "7";
li7.appendChild(numpad7);

var li8 = document.createElement('li');
var numpad8 = document.createElement('input');
numpad1.id = "numpad8" + figNum;
numpad8.type = "button";
numpad8.className = "numpad";
numpad8.value = "8";
li8.appendChild(numpad8);

var li9 = document.createElement('li');
var numpad9 = document.createElement('input');
numpad9.id = "numpad9" + figNum;
numpad9.type = "button";
numpad9.className = "numpad";
numpad9.value = "9";
li9.appendChild(numpad9);

var li0 = document.createElement('li');
var numpad0 = document.createElement('input');
numpad0.id = "numpad0" + figNum;
numpad0.type = "button";
numpad0.className = "numpad0";
numpad0.value = "0";
li0.appendChild(numpad0);
//Add all to unordered list
unorderedList.appendChild(numpad7);
unorderedList.appendChild(numpad8);
unorderedList.appendChild(numpad9);
unorderedList.appendChild(numpad4);
unorderedList.appendChild(numpad5);
unorderedList.appendChild(numpad6);
unorderedList.appendChild(numpad1);
unorderedList.appendChild(numpad2);
unorderedList.appendChild(numpad3);
unorderedList.appendChild(numpad0);
//add to keypad div
numpadKeysDiv.appendChild(unorderedList);

//Div for 'Okay' 'Cancel', and 'clear'
var numpadOkayCancelDiv = document.createElement('div');
numpadOkayCancelDiv.id = "numpadFunctionButtons" + figNum;
numpadOkayCancelDiv.style.border = 'ridge';

var unorderedList2 = document.createElement('ul');
var liOkay = document.createElement('li');
var okay = document.createElement('input');
okay.type = "button";
okay.value = "OK";
okay.className = "okayButton";
liOkay.appendChild(okay);

var liCancel = document.createElement('li');
var cancel = document.createElement('input');
cancel.type = "button";
cancel.value = "Cancel";
cancel.className = "cancelButton";
liCancel.appendChild(cancel);

var liClear = document.createElement('li');
var clear = document.createElement('input');
clear.type = "button";
clear.value = "Clear";
clear.className = "clearButton";
liClear.appendChild(clear);
unorderedList2.appendChild(liOkay);
unorderedList2.appendChild(liClear);
unorderedList2.appendChild(liCancel);
numpadOkayCancelDiv.appendChild(unorderedList2);

var label = document.createElement("label");
label.id = "label1" + figNum;
label.innerText = "Enter up to 3 digits";

numpadDiv.appendChild(keypadInput);
numpadDiv.appendChild(numpadKeysDiv);
numpadDiv.appendChild(numpadOkayCancelDiv);
numpadDiv.appendChild(label);






/*****************************************************/



//All <button> elements
var runButton = document.createElement('button');
runButton.id = "runButton" + figNum;
runButton.style.width = "70px";
runButton.innerHTML = "Run";

var walkButton = document.createElement('button');
walkButton.id = "walkButton" + figNum;
walkButton.style.width = "70px";
walkButton.innerHTML = "Walk";

var distanceButton = document.createElement('button');
distanceButton.id = "distanceButton" + figNum;
distanceButton.style.width = "70px";
distanceButton.onclick = function() {newDistance();};
distanceButton.innerHTML = "Distance";
distanceButton.className = "button" + figNum;

var pointButton = document.createElement('button');
pointButton.id = "pointButton" + figNum;
pointButton.style.width = "70px";
pointButton.onclick = function() {drawPoint();};
pointButton.innerHTML = "Point";
pointButton.className = "button" + figNum;

var lineButton = document.createElement('button');
lineButton.id = "lineButton" + figNum;
lineButton.style.width = "70px";
lineButton.onclick = function() {drawLine();};
lineButton.innerHTML = "Line";
lineButton.className = "button" + figNum;

var polygonButton = document.createElement('button');
polygonButton.id = "polygonButton" + figNum;
polygonButton.style.width = "70px";
polygonButton.onclick = function() {drawPolygon();};
polygonButton.innerHTML = "Polygon";
polygonButton.className = "button" + figNum;

var circleButton = document.createElement('button');
circleButton.id = "circleButton" + figNum;
circleButton.style.width = "70px";
circleButton.onclick = function() {drawCircle();};
circleButton.innerHTML = "Circle";
circleButton.className = "button" + figNum;

var assignButton = document.createElement('button');
assignButton.id = "assignButton" + figNum;
assignButton.style.width = "70px";
assignButton.onclick = function() {assign();};
assignButton.innerHTML = "Assign";
assignButton.style.cssFloat = "right";
assignButton.className = "button" + figNum;

var drawButton = document.createElement('button');
drawButton.id = "drawButton" + figNum;
drawButton.style.width = "70px";
drawButton.onclick = function() {drawShape();};
drawButton.innerHTML = "Draw";
drawButton.style.cssFloat = "right";
drawButton.className = "button" + figNum;

var eraseButton = document.createElement('button');
eraseButton.id = "eraseButton" + figNum;
eraseButton.style.width = "70px";
eraseButton.onclick = function() {erase();};
eraseButton.innerHTML = "Erase";
eraseButton.style.cssFloat = "right";
eraseButton.className = "button" + figNum;

var colorButton = document.createElement('button');
colorButton.id = "colorButton" + figNum;
colorButton.style.width = "70px";
colorButton.onclick = function() {changeColor();};
colorButton.innerHTML = "Color";
colorButton.style.cssFloat = "right";
colorButton.className = "button" + figNum;

var loopButton = document.createElement('button');
loopButton.id = "loopButton" + figNum;
loopButton.style.width = "70px";
loopButton.onclick = function() {loop();};
loopButton.innerHTML = "Loop";
loopButton.style.cssFloat = "right";
loopButton.className = "button" + figNum;

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

//document.body.appendChild(numpadDiv);

//Add listeners for walk and run
$("#" + runButton.id).click(function() { run(); });
$("#" + walkButton.id).click(function() { walk(); });











