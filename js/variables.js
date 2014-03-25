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
	var d = "";
	var p = "";
	var l = "";
	var c = "";
	var g = "";
	var total = "";
	
	var point = pointVariables.slice();
	var line = lineVariables.slice();
	var circle = circleVariables.slice();
	var polygon = polygonVariables.slice();
	var distance = distanceVariables.slice();
	
	if(rowToString(0).indexOf("//Variable") >= 0) {
		//for(var i = 0; i < 3; i++) {
		while(rowToString(0).indexOf("//Program") == -1) {
			codeTable.deleteRow(0);
			if (selRow > 0) selRow--;
		}
		codeTable.deleteRow(0);
		if (selRow > 0) selRow--;
	}
	for(var i = 1; i < distanceVariables.length; i++) {
		if(distance[i-1].indexOf(",") == -1) distance[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < pointVariables.length; i++) {
		if(point[i-1].indexOf(",") == -1) point[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < lineVariables.length; i++) {
		if(line[i-1].indexOf(",") == -1) line[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < polygonVariables.length; i++) {
		if(polygon[i-1].indexOf(",") == -1) polygon[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < circleVariables.length; i++) {
		if(circle[i-1].indexOf(",") == -1) circle[i-1] += ",&nbsp;";
	}
	
	addNewRow(0, ["//Program Code"]);
	if(circleVariables.length > 0) addNewRow(0, circle);
	if(polygonVariables.length > 0) addNewRow(0, polygon);
	if(lineVariables.length > 0) addNewRow(0, line);
	if(pointVariables.length > 0) addNewRow(0, point);
	if(distanceVariables.length > 0) addNewRow(0, distance);
	addNewRow(0,["//Variable Declarations"]); 
	
	//Change font color
	if(rowToString(0).indexOf("//Variable") >= 0) {
		var i = 0;
		while(1) {
			var innerTable = codeTable.rows[i].cells[0].children[0];
			for(var j = 1; j < innerTable.rows[0].cells.length; j++)
				innerTable.rows[0].cells[j].className += " comment";
				//innerTable.rows[0].cells[j].style.color = '#007500';
			if(rowToString(i).indexOf("//Program") >= 0) break;
			i++;
		}
	}
}

//New Distance variable
function newDistance() {
	paintbrush++;
	distanceVariables[distanceVariables.length] = 'd' + (distanceVariables.length+1);
	printVars();
}



