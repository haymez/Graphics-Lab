/*
 *
 *  Contains code for creating new shape objects
 * 
 */

function Shapes() {
    //Declare all variables
    var codeSep = 0; //Used for naming div elements that separate code lines
    var codeText = new Array();
    var variables;
    var canvas;
    
    //public functions
    this.point = point;
    this.line = line;
    this.circle = circle;
    this.polygon = polygon;
    this.getObjects = getObjects;
    
    //Point object
    function point(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.type = 'point';
        this.color = "#FF0000";
        this.varNum = variables.getPointVars().length; //Index of this object in pointVariables
        this.drawNum = canvas.getToDraw().length; //Index of this object in toDraw
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
        this.color = "#FF0000";
        this.varNum = variables.getLineVars().length; //Index of this object in lineVariables
        this.drawNum = canvas.getToDraw().length; //Index of this object in toDraw
        this.active = true; //Boolean to control if shape needs to be drawn or not
        this.assigned = true; //Boolean to control whether variable has been assigned or not 
    }
    //Circle object
    function circle(startX, startY, diameter) {
        this.startX = startX;
        this.startY = startY;
        this.diameter = diameter;
        this.type = 'circle';
        this.color = "#FF0000";
        this.varNum = variables.getCircleVars().length;
        this.drawNum = canvas.getToDraw().length;
        this.active = true;
        this.assigned = true;
    }
    //Polygon object
    function polygon(angles) {
        this.angles = angles;
        this.type = 'polygon';
        this.color = "#FF0000";
        this.varNum = variables.getPolyVars().length;
        this.drawNum = canvas.getToDraw().length;
        this.active = true;
        this.assigned = true;
    }
    
    //get needed objects
    function getObjects(variablesObj, canvasObj) {
        variables = variablesObj;
        canvas = canvasObj;
    }
}








