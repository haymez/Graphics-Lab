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
		if(distanceVariables[i-1].indexOf(",") == -1) distanceVariables[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < pointVariables.length; i++) {
		if(pointVariables[i-1].indexOf(",") == -1) pointVariables[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < lineVariables.length; i++) {
		if(lineVariables[i-1].indexOf(",") == -1) lineVariables[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < polygonVariables.length; i++) {
		if(polygonVariables[i-1].indexOf(",") == -1) polygonVariables[i-1] += ",&nbsp;";
	}
	for(var i = 1; i < circleVariables.length; i++) {
		if(circleVariables[i-1].indexOf(",") == -1) circleVariables[i-1] += ",&nbsp;";
	}
	
	addNewRow(0, ["//Program Code"]);
	if(circleVariables.length > 0) addNewRow(0, circleVariables);
	if(polygonVariables.length > 0) addNewRow(0, polygonVariables);
	if(lineVariables.length > 0) addNewRow(0, lineVariables);
	if(pointVariables.length > 0) addNewRow(0, pointVariables);
	if(distanceVariables.length > 0) addNewRow(0, distanceVariables);
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



