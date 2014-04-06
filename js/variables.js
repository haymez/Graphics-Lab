/*
* Contains code for the variable window.
* All variable arrays are declared and 
* the variable window is populated with
* the declared variables
*/

//Declare all variables
var pointVariables = new Array();
var lineVariables = new Array();
var circleVariables = new Array();
var polygonVariables = new Array();
var distanceVariables = new Array();


//Print all declared variables into the variables window
function printVars() {
	
	
	/**************************************************/
	return; //DELETE THIS AFTER SPEAKING WITH ANDREW
	/**************************************************/
	
	
	
	
	var d = "";
	var p = "";
	var l = "";
	var c = "";
	var g = "";
	var total = "";
	var lineNum = 0;
	var oldLine = getSelectedRowIndex();
	
	var point = new Array();
	var line = new Array();
	var circle = new Array();
	var polygon = new Array();
	var distance = new Array();
	
	if(rowToString(0).indexOf("//Variable") >= 0) {
		while(rowToString(0).indexOf("//Program") == -1) {
			deleteRow(0);
		}
		deleteRow(0);
	}
	for(var i = 0; i < distanceVariables.length; i++) {
		if(i != 0) distance[distance.length] = {text:",&nbsp;d" + Number(i+1), type:["comment"]};
		else distance[distance.length] = {text:"d" + Number(i+1), type:["comment"]};
	}
	for(var i = 0; i < pointVariables.length; i++) {
		if(i != 0) point[point.length] = {text:",&nbsp;p" + Number(i+1), type:["comment"]};
		else point[point.length] = {text:"p" + Number(i+1), type:["comment"]};
	}
	for(var i = 0; i < lineVariables.length; i++) {
		if(i != 0) line[line.length] = {text:",&nbsp;l" + Number(i+1), type:["comment"]};
		else line[line.length] = {text:"l" + Number(i+1), type:["comment"]};
	}
	for(var i = 0; i < polygonVariables.length; i++) {
		if(i != 0) polygon[polygon.length] = {text:",&nbsp;p" + Number(i+1), type:["comment"]};
		else polygon[polygon.length] = {text:"p" + Number(i+1), type:["comment"]};
	}
	for(var i = 0; i < circleVariables.length; i++) {
		if(i != 0) circle[circle.length] = {text:",&nbsp;c" + Number(i+1), type:["comment"]};
		else circle[circle.length] = {text:"c" + Number(i+1), type:["comment"]};
	}
	
	//moveInsertionBarCursor(0);
	addRow(-1, [{text:"//Variable Declarations", type:["comment"]}]); 
	lineNum++;
	if(circleVariables.length > 0) {
		addRow(-1, [{text:"//Circle&nbsp;", type:"comment"}].concat(circle));
		lineNum++;
	}
	if(polygonVariables.length > 0) {
		addRow(-1, [{text:"//Polygon&nbsp;", type:"comment"}].concat(polygon));
		lineNum++;
	}
	if(lineVariables.length > 0) {
		addRow(-1, [{text:"//Line&nbsp;", type:"comment"}].concat(line));
		lineNum++;
	}
	if(pointVariables.length > 0) {
		addRow(-1, [{text:"//Point&nbsp;", type:"comment"}].concat(point));
		lineNum++;
	}
	if(distanceVariables.length > 0) {
		addRow(-1, [{text:"//Distance&nbsp;", type:["comment"]}].concat(distance));
		lineNum++;
	}
	addRow(-1, [{text:"//Program Code", type:["comment"]}]);
}

//New Distance variable
function newDistance() {
	distanceVariables[distanceVariables.length] = 'd' + (distanceVariables.length+1);
	printVars();
}



