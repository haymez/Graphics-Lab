/*
 * This file contains all code for the functions which control what
 * is drawn on the interactive drawing window. It also handles adding
 * the variables that are created to the appropriate arrays.
 */

//Declare all variables
var toDraw = new Array();

//Event listener for cursor position on canvas
$('#' + canvas.id).on('mousemove scrollstart', function(evt) {
    $(this).css('cursor', 'crosshair');
    var cursorPos = getCursorPos(canvas, evt);
    var message = Math.floor(cursorPos.x) + " x " + Math.floor(cursorPos.y);
    if (isNaN(cursorPos.x) || cursorPos.x > 300 || cursorPos.x < 0 || cursorPos.y > 300 || cursorPos.y < 0)
        message = "";
    writeMessage(canvas, message);
    return false;
});

//Clears the canvas of all drawings
function clear() {
        var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Draws all saved objects onto the canvas
function draw() {
	clear();
	for (var i = 0; i < toDraw.length; i++) {
		if (toDraw[i].type == 'point') {
			//This is a point
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = toDraw[i].color;
			ctx.fillRect(toDraw[i].startX-2, toDraw[i].startY-2, 2, 2);
		}
		else if (toDraw[i].type == 'line' || toDraw[i].type == 'temp') {
			//This is a line
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.moveTo(toDraw[i].startX, toDraw[i].startY);
			ctx.lineTo(toDraw[i].endX, toDraw[i].endY);
			ctx.strokeStyle = toDraw[i].color;
			ctx.stroke();
		}
		else if (toDraw[i].type == 'circle') {
			//This is a circle
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.arc(toDraw[i].startX, toDraw[i].startY, toDraw[i].diameter, 0, 2*Math.PI);
			ctx.strokeStyle = toDraw[i].color;
			ctx.stroke();
		}
		else if (toDraw[i].type == 'polygon') {
			//This is a polygon
			for (var n = 0; n < toDraw[i].angles.length; n++) {
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.moveTo(toDraw[i].angles[n].startX, toDraw[i].angles[n].startY);
				ctx.lineTo(toDraw[i].angles[n].endX, toDraw[i].angles[n].endY);
				ctx.strokeStyle = toDraw[i].color;
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
    var click = 0;
    var startX;
    var startY;
    var rect = canvas.getBoundingClientRect();
    pointVariables[pointVariables.length] = 'p' + (pointVariables.length+1);
    printVars();
    $('#' + canvas.id).off('.draw');
    $('#' + canvas.id).on('click.draw', function(evt) {
		startX = evt.clientX - rect.left;
		startY = evt.clientY - rect.top;
		toDraw[toDraw.length] = new point(startX, startY);
		draw();
		
		addNewRow(selRow, [getIndent(selRow) + pointVariables[pointVariables.length-1], "&nbsp;=&nbsp;", 
            "(", startX,",", 300-startY, ")"]);
        addNewRow(selRow, [getIndent(selRow) + "draw", "(", pointVariables[pointVariables.length-1], ")"]);
        
        //remove listener
        $('#' + canvas.id).off('.draw');
	});
}

//Allows user to draw a line on canvas. Saves line in toDraw array
function drawLine() {
    var startX;
    var startY;
    var endX;
    var endY;
    var rect = canvas.getBoundingClientRect();
    lineVariables[lineVariables.length] = 'l' + (lineVariables.length+1);
    printVars();
    $('#' + canvas.id).off('.draw');
    $('#' + canvas.id).on('mousedown.draw', function(evt) {
		
		startX = evt.clientX - rect.left;
		startY = evt.clientY - rect.top;
		
		//visualize what the line will look like as the user moves the cursor around
		$('#' + canvas.id).on('mousemove.draw', function(evt) {
			var ctx = canvas.getContext('2d');
			draw();
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();
			
			$('#' + canvas.id).on('mouseout.draw', function() {
				$('#' + canvas.id).off('.draw');
				draw();
				return;
			});
		});
		
		$('#' + canvas.id).on('mouseup.draw', function(evt) {
			//Turn mouse move listener off
			$('#' + canvas.id).off('mousemove.draw');
			endX = evt.clientX - rect.left;
			endY = evt.clientY - rect.top;
			toDraw[toDraw.length] = new line(startX, startY, endX, endY, "line");
			
			addNewRow(selRow, [getIndent(selRow) + lineVariables[lineVariables.length-1], "&nbsp;=&nbsp;", 
				"(", "(", startX, ",", 300-startY, ")", "(", endX, ",", 300-endY, ")", ")"]);
			addNewRow(selRow, [getIndent(selRow) + "draw", "(", lineVariables[lineVariables.length-1], ")"]);
			
			//Turn mouse up listener off
			$('#' + canvas.id).off('.draw');
		});
	});
}

//Allows user to draw a circle on canvas. Saves circle in toDraw array
function drawCircle() {
	var click = 0;
	var startX;
	var startY;
	var endX;
	var endY;
	var rect = canvas.getBoundingClientRect();
	circleVariables[circleVariables.length] = 'c' + (circleVariables.length+1);
	printVars();
	
	$('#' + canvas.id).off('.draw');
	$('#' + canvas.id).on('mousedown.draw', function(evt) {
		
		startX = evt.clientX - rect.left;
		startY = evt.clientY - rect.top;
		
		//visualize what the circle will look like as the user moves the cursor around
		$('#' + canvas.id).on('mousemove.draw', function(evt) {
			draw();
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.arc(startX, startY, findDistance(startX, startY, evt.clientX-rect.left, evt.clientY - rect.top), 0, 2*Math.PI);
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();
			
			$('#' + canvas.id).on('mouseout.draw', function() {
				$('#' + canvas.id).off('.draw');
				draw();
				return;
			});
		});
		
		$('#' + canvas.id).on('mouseup', function(evt) {
			endX = evt.clientX - rect.left;
			endY = evt.clientY - rect.top;
			toDraw[toDraw.length] = new circle(startX, startY, Math.round(findDistance(startX, startY, endX, endY)));
			
			addNewRow(selRow, [getIndent(selRow) + circleVariables[circleVariables.length-1], "&nbsp;=&nbsp;", "(", "(",  
			startX, ",", 300-startY, ")", Math.round(findDistance(startX, startY, endX, endY)), ")"]);
			addNewRow(selRow, [getIndent(selRow) + "draw", "(", circleVariables[circleVariables.length-1], ")"]);
			
			$('#' + canvas.id).off('.click');
		});
	});
    
    /*canvas.addEventListener('click', function(evt) {
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
                    ctx.strokeStyle = "#FF0000";
                    ctx.stroke();
                    if (click > 1)
                        this.removeEventListener('mousemove',arguments.callee,false);
            }, false);
        }
        else if (click == 2) {
            endX = evt.clientX - rect.left;
            endY = evt.clientY - rect.top;
            toDraw[toDraw.length] = new circle(startX, startY, Math.round(findDistance(startX, startY, endX, endY)));
            
            addNewRow(selRow, [getIndent(selRow) + circleVariables[circleVariables.length-1], "&nbsp;=&nbsp;", "(", "(",  
                startX, ",", 300-startY, ")", Math.round(findDistance(startX, startY, endX, endY)), ")"]);
            addNewRow(selRow, [getIndent(selRow) + "draw", "(", circleVariables[circleVariables.length-1], ")"]);
        }
        
        //remove listener after the circle has been drawn
        if (click > 1) {
            this.removeEventListener('click',arguments.callee,false);
        }
    }, false);*/
}

//Allows user to draw a polygon on canvas. Saves polygon in toDraw array
function drawPolygon() {
	var paintbrush = 0;
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
                ctx.strokeStyle = "#FF0000";
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
                    toDraw[toDraw.length] = new line(startX, startY, coor[0].startX, coor[0].startY, "temp"); //Set this line to temporary because it's merely a preview
                    coor[coor.length] = new point(startX, startY, coor[0].startX, coor[0].startY);
                    
                    //Erase all line elements in toDraw that were used for polygon. Save polygon.
                    toDraw = toDraw.slice(0, toDraw.length-coor.length);
                    toDraw[toDraw.length] = new polygon(coor);
                    
                    addNewRow(selRow, [getIndent(selRow) + polygonVariables[polygonVariables.length-1], "&nbsp;=&nbsp;", 
                        "(", "(", coor[0].startX, ",", 300-coor[0].startY, ")", ","]);
                    for(var i = 1; i < coor.length; i++) {
                        if (i == coor.length-1) {
                            addNewRow(selRow, [getIndent(selRow) + indent, "(", coor[i].startX, ",", 300-coor[i].startY, ")", ","]);
                            addNewRow(selRow, [getIndent(selRow) + indent, "(", coor[0].startX, ",", 300-coor[0].startY, ")", ")"]);
                        }
                        else
                            addNewRow(selRow, [getIndent(selRow) + indent, "(", coor[i].startX, ",", 300-coor[i].startY, ")", ","]);
                    }
                    addNewRow(selRow, [getIndent(selRow) + "draw", "(", polygonVariables[polygonVariables.length-1], ")"]);
                }
                else {
                    toDraw[toDraw.length] = new line(startX, startY, endX, endY, "temp"); //Set this line to temporary because it's merely a preview
                    coor[coor.length] = new point(startX, startY, endX, endY);
                    canvas.click();
                }
            }
            else {
                toDraw[toDraw.length] = new line(startX, startY, endX, endY, "temp"); //Set this line to temporary because it's merely a preview
                coor[coor.length] = new point(startX, startY, endX, endY);
                canvas.click();
            }
        }
    }, false);
}
