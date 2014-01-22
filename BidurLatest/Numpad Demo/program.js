/*
 *
 *  Contains code for Program Code window.
 * 
 */

//Declare all variables
var code = document.getElementById('program_code');
var codeSep = 0; //Used for naming div elements that separate code lines

//Point object
function makePoint(startX, startY) {
	this.startX = startX;
	this.startY = startY;
	this.type = 'point';
	this.varNum = pointVariables.length; //Index of this object in pointVariables
	this.drawNum = toDraw.length; //Index of this object in toDraw
	this.active = true; //Boolean to control if shape needs to be drawn or not
	this.assigned = true; //Boolean to control whether variable has been assigned or not
	this.varPoints = makeLink("delete1" + this.drawNum, "* ") +
		makeLink("pclick" + this.drawNum, "p" + this.varNum) + 
		" = (" + makeLink("aclick" + this.drawNum, this.startX) + "," + 
		makeLink("bclick" + this.drawNum, 300-this.startY) + ")" + codeSeparator(this.drawNum);
	this.drawLink = makeLink("delete2" + this.drawNum, "* ") +
		"draw(" + makeLink("draw" + this.drawNum, "p" + this.varNum) + ")" + codeSeparator(this.drawNum);
}
//Line object
function makeLine(startX, startY, endX, endY) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.type = 'line';
	this.varNum = lineVariables.length; //Index of this object in lineVariables
	this.drawNum = toDraw.length; //Index of this object in toDraw
	this.active = true; //Boolean to control if shape needs to be drawn or not
	this.assigned = true; //Boolean to control whether variable has been assigned or not
	this.varPoints = makeLink("deleteVar" + this.drawNum, "* ") +
		makeLink("lclick" + this.drawNum, "l" + this.varNum) +
		" = ((" + makeLink("startX" + this.drawNum, this.startX) + "," +
		makeLink("startY" + this.drawNum, 300-this.startY) + "),(" +
		makeLink("endX" + this.drawNum, this.endX) + "," +
		makeLink("endY" + this.drawNum, 300-this.endY) + "))" + codeSeparator(this.drawNum);
	this.drawLink = makeLink("deleteDraw" + this.drawNum, "* ") +
		"draw(" + makeLink("draw" + this.drawNum, "l" + this.varNum) + ")" + codeSeparator(this.drawNum); 
}
//Circle object
function makeCircle(startX, startY, diameter) {
	this.startX = startX;
	this.startY = startY;
	this.diameter = diameter;
	this.type = 'circle';
	this.varNum = circleVariables.length;
	this.drawNum = toDraw.length;
	this.active = true;
	this.assigned = true;
	this.varPoints = makeLink("deleteVar" + this.drawNum, "* ") +
		makeLink("cclick" + this.drawNum, "c" + this.varNum) +
		" = ((" + makeLink("startX" + this.drawNum, this.startX) + "," +
		makeLink("startY" + this.drawNum, 300-this.startY) + ")," +
		makeLink("radius" + this.drawNum, this.diameter) + ")" + codeSeparator(this.drawNum);
	this.drawLink = makeLink("deleteDraw" + this.drawNum, "* ") +
		"draw(" + makeLink("draw" + this.drawNum, "c" + this.varNum) + ")" + codeSeparator(this.drawNum);
}
//Polygon object
function makePolygon(angles) {
	this.angles = angles;
	this.type = 'polygon';
	this.varNum = polygonVariables.length;
	this.drawNum = toDraw.length;
	this.active = true;
	this.assigned = true;
	this.varPoints = makeLink("deleteVar" + this.drawNum, "* ") +
		makeLink("gclick" + this.drawNum, "g" + this.varNum) +
		" = (" + codeSeparator(this.drawNum);
		for (var i = 0; i < angles.length; i++) {
			this.varPoints += makeLink("deletePoint" + i, "*") + whiteSpace(10) + 
			"(" + makeLink("startgX" + i, angles[i].startX) + "," +
			makeLink("startgY" + i, 300-angles[i].startY) + ")," + codeSeparator(this.drawNum);
		}
		this.varPoints += whiteSpace(11) + ")" + codeSeparator(this.drawNum);
	this.drawLink = makeLink("deleteDraw" + this.drawNum, "* ") +
		"draw(" + makeLink("draw" + this.drawNum, "g" + this.varNum) + ")" + codeSeparator(this.drawNum);
}


//writes the code in the code window using toDraw array
function writeCode() {
	var string = "";
	
	//Write HTML in program code window
	for (var i = 0; i < toDraw.length; i++) {
		if (toDraw[i].type == "point") { //Element is point object
			if (toDraw[i].assigned)
				string += toDraw[i].varPoints;
			if (toDraw[i].active)
				string += toDraw[i].drawLink;
		}
		else if (toDraw[i].type == "line") {
			if (toDraw[i].assigned)
				string += toDraw[i].varPoints;
			if (toDraw[i].active)
				string += toDraw[i].drawLink;
		}
		else if (toDraw[i].type == "circle") {
			if (toDraw[i].assigned)
				string += toDraw[i].varPoints;
			if (toDraw[i].active)
				string += toDraw[i].drawLink;
		}
		else if (toDraw[i].type == "polygon") {
			if (toDraw[i].assigned)
				string += toDraw[i].varPoints;
			if (toDraw[i].active)
				string += toDraw[i].drawLink;
		}
	}
	code.innerHTML = string;
	addListeners();
	
	//Make links turn red when cursor hovers over them
	$("a").hover(function() {
       $(this).css("color", "red"); 
    },function() {
        $(this).css("color", "black");
    });
    
    //Make all code separators perform something when hovered and clicked
    $(".sep").hover(function() {
        $(this).css("background", "#D1D1E0");
    }, function() {
        $(this).css("background", "white");
    }).click(function() {
        $(this).replaceWith("<br>><br>");
    });
}

//Add listeners to links in program code window
function addListeners() {
	for (var i = 0; i < toDraw.length; i++) {
		if (toDraw[i].type == "point") { //Element is point object
			if (toDraw[i].assigned) {
				makeListener("pclick" + i, i);
				makeListener("aclick" + i, i);
				makeListener("bclick" + i, i);
				makeListener("delete1" + i, i);
			}
			if (toDraw[i].active) {
				makeListener("draw" + i, i);
				makeListener("delete2" + i, i);
			}
		}
		else if (toDraw[i].type == "line") { //Element is a line object
			if (toDraw[i].assigned) {
				makeListener("deleteVar" + i, i);
				makeListener("lclick" + i, i);
				makeListener("startX" + i, i);
				makeListener("startY" + i, i);
				makeListener("endX" + i, i);
				makeListener("endY" + i, i);
			}
			if (toDraw[i].active) {
				makeListener("deleteDraw" + i, i);
				makeListener("draw" + i, i);
			}
		}
		else if (toDraw[i].type == "circle") {
			if (toDraw[i].assigned) {
				makeListener("deleteVar" + i, i);
				makeListener("cclick" + i, i);
				makeListener("startX" + i, i);
				makeListener("startY" + i, i);
				makeListener("radius" + i, i);
			}
			if (toDraw[i].active) {
				makeListener("deleteDraw" + i, i);
				makeListener("draw" + i, i);
			}
		}
		else if (toDraw[i].type == "polygon") {
			if (toDraw[i].assigned) {
				makeListener("deleteVar" + i, i);
				makeListener("gclick" + i, i);
				for (var y = 0; y < toDraw[i].angles.length; y++) {
				    makeListener("deletePoint" + y, i);
					makeListener("startgX" + y, i);
					makeListener("startgY" + y, i);
				}
			}
			if (toDraw[i].active) {
				makeListener("deleteDraw" + i, i);
				makeListener("draw" + i, i);
			}
		}
	}
	
	//Makes new listener instances for specific link
	function makeListener(evt, index) {
		if (toDraw[index].type == "point") { //Make listeners for point object
			var link = document.getElementById(evt);
			if (evt.search("pclick") != -1) { //User clicked the variable on the left side of the assignment
				link.onclick = function() {
					console.log("Choose from declared variables");
					return false;
				}
			}
			else if (evt.search("aclick") != -1) { //User clicked the x coordinate of a point
				link.onclick = function() {
					console.log("Change value of X coordinate");
					return false;
				}
			}
			else if (evt.search("bclick") != -1) { //User clicked the y coordinate of a point
				link.onclick = function() {
					console.log("Change value of Y coordinate");
					return false;
				}
			}
			else if (evt.search("draw") != -1) { //User clicked the variable inside the draw code for a point
				link.onclick = function() {
					console.log("Change what is drawn");
					return false;
				}
			}
			else if (evt.search("delete1") != -1) { //User clicked the '*' in front of variable assignment for a point
				link.onclick = function() {
					var del = confirm("Are you sure you want to delete the highlighted text?");
					 if (del) {
					 	toDraw[index].assigned = false; //set assigned boolean to false;
					 	writeCode(); //Update Program Code window
					 }
					 else
					 	console.log("Don't delete point assignment");
					return false;
				}
			}
			else if (evt.search("delete2") != -1) { //User clicked the '*' in front of 'draw(p_)
				link.onclick = function() {
					var del = confirm("Are you sure you want to delete the highlighted text?");
						if (del) {
							toDraw[index].active = false; //Currently this deletes the point immediately. Need to implement Run/Walk
							writeCode(); //Update program code window
						}
						else
							console.log("Don't delete draw assignment");
						return false;
				}
			}
		}
		else if (toDraw[index].type == "line") { //Make listeners for line object
			var link = document.getElementById(evt);
			if (evt.search("deleteVar") != -1) { //User clicked the '*' in front of variable assignment for a line
				link.onclick = function() {
					var del = confirm("Are you sure you want to delete the highlighted text?");
					if (del) {
						toDraw[index].assigned = false; //Set assigned boolean to false
						writeCode(); //Update program Code window
					}
					else
						console.log("Don't delete it");
					return false;
				}
			}
			else if (evt.search("lclick") != -1) { //User clicked on variable on the left side of the assignment
				link.onclick = function() {
					console.log("Change what variable user is assigning");
					return false;
				}
			}
			else if (evt.search("startX") != -1) { //User clicked on the X coordinate for the starting position of a line
				link.onclick = function() {
					console.log("change value of startX");
					return false;
				}
			}
			else if (evt.search("startY") != -1) { //User clicked on the Y coordinate for the starting position of a line
				link.onclick = function() {
					console.log("change value of startY");
					return false;
				}
			}
			else if (evt.search("endX") != -1) { //User clicked on the X coordinate for the ending position of a line
				link.onclick = function() {
					console.log("change value of endX");
					return false;
				}
			}
			else if (evt.search("endY") != -1) { //User clicked on the Y coordinate for the ending position of a line
				link.onclick = function() {
					console.log("change value of endY");
					return false;
				}
			}
			else if (evt.search("deleteDraw") != -1) {
				link.onclick = function() {
					var del = confirm("Are you sure you want to delete the highlighted text?");
					if (del) {
						toDraw[index].active = false; //Set active to false
						writeCode(); //Update Program Code window
					}
					else
						console.log("Don't delete it");
					return false;
				}
			}
			else if (evt.search("draw") != -1) {
				link.onclick = function() {
					console.log("change variable that is drawn");
					return false;
				}
			}
		}
		else if (toDraw[index].type == "circle") { //Make listeners for circle object
			var link = document.getElementById(evt);
			if (evt.search("deleteVar") != -1) {
				link.onclick = function() {
					var del = confirm("Are you sure you want to delete the highlighted text?");
					if (del) {
						toDraw[index].assigned = false; //Set the assigned boolean of element to false
						writeCode(); //Update Program Code window
					}
					else
						console.log("don't delete variable assignment");
					return false;
				}
			}
			else if (evt.search("cclick") != -1) {
				link.onclick = function() {
					console.log("change variable to be assigned");
					return false;
				}
			}
			else if (evt.search("startX") != -1) {
				link.onclick = function() {
					console.log("change X variable of circle center");
					return false;
				}
			}
			else if (evt.search("startY") != -1) {
				link.onclick = function() {
					console.log("change Y variable of circle center");
					return false;
				}
			}
			else if (evt.search("radius") != -1) {
				link.onclick = function() {
					console.log("change size of radius");
					return false;
				}
			}
			else if (evt.search("deleteDraw") != -1) {
				link.onclick = function() {
					var del = confirm("Are you sure you want to delete the highlighted text?");
					if (del) {
						toDraw[index].active = false; //Set the active boolean of element to false
						writeCode(); //Update Program Code window
					}
					else
						console.log("Don't delete draw");
					return false;
				}
			}
			else if (evt.search("draw") != -1) {
				link.onclick = function() {
					console.log("change what is drawn");
					return false;
				}
			}
			
		}
		else if (toDraw[index].type == "polygon") { //Make listeners for polygon object
			var link = document.getElementById(evt);
			if (evt.search("deleteVar") != -1) {
				link.onclick = function() {
				    var del = confirm("Are you sure you want to delete the highlighted text?");
				    if (del) {
				        toDraw[index].assigned = false; //Set assigned boolean to false for polygon object
				        writeCode(); //Update Program Code window
				    }
					return false;
				}
			}
			else if (evt.search("gclick") != -1) {
			    link.onclick = function() {
			        console.log("Change variable to be assigned");
			        return false;
			    }
			}
			else if (evt.search("deletePoint") != -1) {
			    link.onclick = function () {
			        console.log("delete point");
			        return false;
			    }
			}
			else if (evt.search("startgX") != -1) {
			    link.onclick = function() {
			        console.log("Change value of startgX: ");
			        return false;
			    }
			}
			else if (evt.search("startgY") != -1) {
			    link.onclick = function() {
			        console.log("Change value of startgY");
			        return false;
			    }
			}
			else if (evt.search("deleteDraw") != -1) {
			    link.onclick = function() {
			        var del = confirm("Are you sure you want to delete the highlighted text?");
			        if (del) {
			            toDraw[index].active = false; //Set active boolean to false for polygon object
			            writeCode(); //Update Program Code window
			        }
			        return false;
			    }
			}
			else if (evt.search("draw") != -1) {
			    link.onclick = function() {
			        console.log("Change what is drawn");
			        return false;
			    }
			}
		}
	}
}

//Makes text click-able. 'id' defines the name of the tag, 'text' is the text that needs to be click-able
function makeLink(id, text) {
	var string = "";
	string += "<a id='" + id + "' class='Clickable' href='#' style='color:black;text-decoration:none;'>" + text + "</a>"; //This has been eddited by bidur. Added class to all links that are clickable.
	return string;
}

//Adds whitespace to HTML
function whiteSpace(spaces) {
	var string = "";
	for (var i = 0; i < spaces; i++)
		string += "&nbsp";
	return string;
}

//Creates separation between code lines with div element
function codeSeparator(index) {
    var string = "<div class='sep' id='separator" + codeSep + "-" + index + 
    "' style='height:5px;width:210px;background-color:white'></div>";
    codeSep++;
    return string;
}

//Allows user to assign values to a declared variable
function assign() {
	console.log("Assign");
}

//Allows user to choose a shape to draw
function drawShape() {
	console.log("Draw declared and assigned shape");
}

//Erases a shape
function erase() {
    console.log("Erase object");
}

//Allow users to change the color of shapes
function changeColor() {
    console.log("change color");
}

//Creates a loop in program window
function loop() {
    console.log("create a loop");
}

//Increments a variable by specified amount
function increment() {
    console.log("increment");
}

//Decrements a variable by specified amount
function decrement() {
    console.log("decrement");
}









