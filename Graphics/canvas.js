/*
 * This file contains all code for the functions which control what
 * is drawn on the interactive drawing window. It also handles adding
 * the variables that are created to the appropriate arrays.
 */

//Declare all variables
var toDraw = new Array();
var canvas = document.getElementById('drawingCanvas'); //Drawing window canvas
var paintbrush = 0; //Keeps track of which function was called last. (prevents multiple shapes from being drawn at once)
var color = "red";

//Event listener for cursor position on canvas
canvas.addEventListener('mousemove', function(evt) {
    var cursorPos = getCursorPos(canvas, evt);
    var message = cursorPos.x + " x " + cursorPos.y;
    writeMessage(canvas, message);
}, false);

//Event listener for when cursor leaves drawing window
canvas.addEventListener('mouseout', function(evt) {
	clear();
	draw();
}, false);

//Clears the canvas of all drawings
function clear() {
	var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Draws all saved objects onto the canvas
function draw() {
	for (var i = 0; i < toDraw.length; i++) {
		if (toDraw[i].type == 'point') {
			//This is a point
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = color;
			ctx.fillRect(toDraw[i].startX-2, toDraw[i].startY-2, 2, 2);
		}
		else if (toDraw[i].type == 'line' || toDraw[i].type == 'temp') {
			//This is a line
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.moveTo(toDraw[i].startX, toDraw[i].startY);
			ctx.lineTo(toDraw[i].endX, toDraw[i].endY);
			ctx.strokeStyle = color;
			ctx.stroke();
		}
		else if (toDraw[i].type == 'circle') {
			//This is a circle
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.arc(toDraw[i].startX, toDraw[i].startY, toDraw[i].diameter, 0, 2*Math.PI);
			ctx.strokeStyle = color;
			ctx.stroke();
		}
		else if (toDraw[i].type == 'polygon') {
			//This is a polygon
			for (var n = 0; n < toDraw[i].angles.length; n++) {
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.moveTo(toDraw[i].angles[n].startX, toDraw[i].angles[n].startY);
				ctx.lineTo(toDraw[i].angles[n].endX, toDraw[i].angles[n].endY);
				ctx.strokeStyle = color;
				ctx.stroke();
			}
		}
	}
}

//Finds distance between two points on canvas
function findDistance(startX, startY, endX, endY) {
	var distance = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
	return distance;
}

//Writes cursor position on canvas
function writeMessage(canvas, message) {
	clear();
	draw();
	var ctx = canvas.getContext('2d');
	ctx.textAlign = 'right';
    ctx.font = '8pt Calibri';
    ctx.fillStyle = 'black';
    ctx.fillText(message, 298, 10);
}

//Returns the cursor position on canvas
function getCursorPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: 300 - (evt.clientY - rect.top)
    };
}

//Allows user to draw a point on canvas. Saves point in toDraw array
function drawPoint() {
	paintbrush++;
	var curr = paintbrush;
	var click = 0;
	var startX;
	var startY;
	var rect = canvas.getBoundingClientRect();
	pointVariables[pointVariables.length] = 'p' + (pointVariables.length+1);
	printVars();
	
	
	canvas.addEventListener('click', function(evt) {
		if (curr < paintbrush) { //Checks to see if another button has been pushed
			this.removeEventListener('click',arguments.callee,false);
			return;
		}
		click++;
		if (click == 1) {
			startX = evt.clientX - rect.left;
			startY = evt.clientY - rect.top;
			toDraw[toDraw.length] = new makePoint(startX, startY);
		}
		
		//remove listener after the line has been drawn
		if (click > 0) {
			this.removeEventListener('click',arguments.callee,false);
		}
	}, false);
}

//Allows user to draw a line on canvas. Saves line in toDraw array
function drawLine() {
	paintbrush++;
	var curr = paintbrush;
	var click = 0;
	var startX;
	var startY;
	var endX;
	var endY;
	var rect = canvas.getBoundingClientRect();
	lineVariables[lineVariables.length] = 'l' + (lineVariables.length+1);
	printVars();
	
	canvas.addEventListener('click', function(evt) {
		if (curr < paintbrush) { //Checks to see if another button has been pushed
			this.removeEventListener('click',arguments.callee,false);
			return;
		}
		click++;
		if (click == 1) {
			startX = evt.clientX - rect.left;
			startY = evt.clientY - rect.top;
			
			//visualize what the line will look like as the user moves the cursor around
			canvas.addEventListener('mousemove', function(evt) {
				if (curr < paintbrush) { //Checks to see if another button has been pushed
					this.removeEventListener('mousemove',arguments.callee,false);
					return;
				}
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.moveTo(startX, startY);
				ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
				ctx.strokeStyle = color;
				ctx.stroke();
				if (click > 1)
					this.removeEventListener('mousemove',arguments.callee,false);
			}, false);
		}
		else if (click == 2) {
			endX = evt.clientX - rect.left;
			endY = evt.clientY - rect.top;
			toDraw[toDraw.length] = new makeLine(startX, startY, endX, endY, "line");
		}
		
		//remove listener after the line has been drawn
		if (click > 1) {
			this.removeEventListener('click',arguments.callee,false);
		}
	}, false);
}

//Allows user to draw a circle on canvas. Saves circle in toDraw array
function drawCircle() {
	paintbrush++;
	var curr = paintbrush;
	var click = 0;
	var startX;
	var startY;
	var endX;
	var endY;
	var rect = canvas.getBoundingClientRect();
	circleVariables[circleVariables.length] = 'c' + (circleVariables.length+1);
	printVars();
	
	canvas.addEventListener('click', function(evt) {
		if (curr < paintbrush) { //Checks to see if another button has been pushed
			this.removeEventListener('click',arguments.callee,false);
			return;
		}
		click++;
		if (click == 1) {
			startX = evt.clientX - rect.left;
			startY = evt.clientY - rect.top;
			
			//visualize what the circle will look like as the user moves the cursor around
			canvas.addEventListener('mousemove', function(evt) {
				if (curr < paintbrush) { //Checks to see if another button has been pushed
					this.removeEventListener('mousmove',arguments.callee,false);
					return;
				}
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.arc(startX, startY, findDistance(startX, startY, evt.clientX-rect.left, evt.clientY - rect.top), 0, 2*Math.PI);
				ctx.strokeStyle = color;
				ctx.stroke();
				if (click > 1)
					this.removeEventListener('mousemove',arguments.callee,false);
			}, false);
		}
		else if (click == 2) {
			endX = evt.clientX - rect.left;
			endY = evt.clientY - rect.top;
			toDraw[toDraw.length] = new makeCircle(startX, startY, Math.round(findDistance(startX, startY, endX, endY)));
		}
		
		//remove listener after the circle has been drawn
		if (click > 1) {
			this.removeEventListener('click',arguments.callee,false);
		}
	}, false);
}

//Allows user to draw a polygon on canvas. Saves polygon in toDraw array
function drawPolygon() {
	paintbrush++; 
	var curr = paintbrush;
	var click = 0;
	var startX;
	var startY;
	var endX;
	var endY;
	var coor = new Array();
	var rect = canvas.getBoundingClientRect();
	polygonVariables[polygonVariables.length] = 'g' + (polygonVariables.length+1);
	printVars();
	
	//defines a point (or angle) on the polygon
	function point(startX, startY, endX, endY) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}
	
	canvas.addEventListener('click', function(evt) { //Listens for click on canvas
		if (curr < paintbrush) { //Checks to see if another button has been pushed
			this.removeEventListener('click',arguments.callee,false);
			return;
		}
		click++;
		if (click % 2 == 1) {
			if (click > 1) {
				startX = endX;
				startY = endY;
			}
			else {
				startX = evt.clientX - rect.left;
				startY = evt.clientY - rect.top;
			}
			
			//visualize what the line will look like as the user moves the cursor around
			canvas.addEventListener('mousemove', function(evt) {
				if (curr < paintbrush) { //Checks to see if another button has been pushed
					this.removeEventListener('mousemove',arguments.callee,false);
					
					var x = 0;
					for (var i = 0; i < toDraw.length; i++) {
						if (toDraw[i].type == 'temp')
							x++;
					}
					toDraw = toDraw.slice(0, toDraw.length-x);
					
					return;
				}
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.moveTo(startX, startY);
				//Snap into place if preview line is within 8 pixels of starting point
				if (click > 2) {
					if (findDistance(evt.clientX - rect.left, evt.clientY - rect.top, coor[0].startX, coor[0].startY) < 8)
						ctx.lineTo(coor[0].startX, coor[0].startY);
					else
						ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
				}
				else
					ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
				ctx.strokeStyle = color;
				ctx.stroke();
				if (click % 2 == 0) //if click is finishing a preview line then we need to remove the listener
					this.removeEventListener('mousemove',arguments.callee,false);
			}, false);
		}
		else {
			endX = evt.clientX - rect.left;
			endY = evt.clientY - rect.top;
			if (click > 2) {
				if (findDistance(endX, endY, coor[0].startX, coor[0].startY) < 8) {
					this.removeEventListener('click',arguments.callee,false);
					toDraw[toDraw.length] = new makeLine(startX, startY, coor[0].startX, coor[0].startY, "temp"); //Set this line to temporary because it's merely a preview
					coor[coor.length] = new point(startX, startY, coor[0].startX, coor[0].startY);
					
					//Erase all line elements in toDraw that were used for polygon. Save polygon.
					toDraw = toDraw.slice(0, toDraw.length-coor.length);
					toDraw[toDraw.length] = new makePolygon(coor);
				}
				else {
					toDraw[toDraw.length] = new makeLine(startX, startY, endX, endY, "temp"); //Set this line to temporary because it's merely a preview
					coor[coor.length] = new point(startX, startY, endX, endY);
					canvas.click();
				}
			}
			else {
				toDraw[toDraw.length] = new makeLine(startX, startY, endX, endY, "temp"); //Set this line to temporary because it's merely a preview
				coor[coor.length] = new point(startX, startY, endX, endY);
				canvas.click();
			}
		}
	}, false);
}







