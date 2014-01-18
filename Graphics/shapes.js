/*
 *
 *  Contains code for creating new shape objects
 * 
 */

//Declare all variables
var codeSep = 0; //Used for naming div elements that separate code lines
var codeText = new Array();

//Point object
function point(startX, startY) {
	this.startX = startX;
	this.startY = startY;
	this.type = 'point';
	this.varNum = pointVariables.length; //Index of this object in pointVariables
	this.drawNum = toDraw.length; //Index of this object in toDraw
	this.active = true; //Boolean to control if shape needs to be drawn or not
	this.assigned = true; //Boolean to control whether variable has been assigned or not
}
//Line object
function line(startX, startY, endX, endY, type) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.type = type;
	this.varNum = lineVariables.length; //Index of this object in lineVariables
	this.drawNum = toDraw.length; //Index of this object in toDraw
	this.active = true; //Boolean to control if shape needs to be drawn or not
	this.assigned = true; //Boolean to control whether variable has been assigned or not 
}
//Circle object
function circle(startX, startY, diameter) {
	this.startX = startX;
	this.startY = startY;
	this.diameter = diameter;
	this.type = 'circle';
	this.varNum = circleVariables.length;
	this.drawNum = toDraw.length;
	this.active = true;
	this.assigned = true;
}
//Polygon object
function polygon(angles) {
	this.angles = angles;
	this.type = 'polygon';
	this.varNum = polygonVariables.length;
	this.drawNum = toDraw.length;
	this.active = true;
	this.assigned = true;
}









