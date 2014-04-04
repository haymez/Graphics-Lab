/*
 * This code is for the Watson Graphics Lab editor.
 */

//The current selected row
var selRow = 0; 

//Blank template for unselected row
var blank = "&nbsp;&nbsp;&nbsp;&nbsp;";

//arrow template for selected row
var arrow = "&#8594;";

//Indentation used for inside brackets
var indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

//Template used for a newly added row in the codeTable
var innerTableTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'></td></tr></table>";

//Template used for a newly selected row
var innerTableArrowTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>&nbsp;&nbsp;</td></tr></table>";

//Make a blank row where the program starts
var row = codeTable.insertRow(0);
// make a new cell here
var cell = row.insertCell(0);
var innerTable;
//Set the cell with arrow template
cell.innerHTML = innerTableArrowTemplate;
selRow = 0;
selectRow(selRow);


//We must refresh the events upon each change within the tables... toggleEvents() is called each time something is altered
function toggleEvents() {
	refreshLineNumbers();
    //Turn off mouseover event
    $('.innerTable' + figNum).off('mouseover');
    //Turn mouseover event back on
    $('.innerTable' + figNum).on('mouseover', 'td', function() {
        // grab the hovered cell's value
        cellVal = $(this).text();
        // grab the hovered cell's index
        colNum = ($(this).index());
        // grab the row number from codeTable (this is a silly way of doing it, but it works)
        var rowNum = ($(this).parent().parent().parent().parent().parent().index());
        var rowString = rowToString(rowNum);
        
        // we pass rowNum and colNum to tell the function where start highlighting
        if (cellVal.indexOf('=') == -1 && cellVal.indexOf('draw') == -1 && cellVal.indexOf('erase') == -1 && cellVal.indexOf('color') == -1 && 
            cellVal.indexOf('repeat') == -1 && cellVal.indexOf('times') == -1 && cellVal.indexOf('loop') == -1 && 
            cellVal.indexOf('endloop') == -1) {
            //set cursor to pointer when hovering over clickable items
            $(this).css('cursor', 'pointer');
            if (cellVal.indexOf('(') >= 0 && rowString.indexOf("draw") == -1 && rowString.indexOf("erase") == -1 && 
                rowString.indexOf("color") == -1)
                highlightParenthesis('(', ')', rowNum, colNum);
            else if (cellVal.indexOf(')') >= 0 && rowString.indexOf("draw") == -1 && rowString.indexOf("erase") == -1 && 
                rowString.indexOf("color") == -1)
                highlightParenthesisBackwards('(', ')', rowNum, colNum);
            else if (cellVal.indexOf("(") == -1 && cellVal.indexOf(")") == -1) {
                if (colNum == 0) {
                	if(rowString.indexOf("repeat") >= 0)
                		highlightLoop("repeat", rowNum);
                	else if (rowString.indexOf("loop") >= 0 && rowString.indexOf("endloop") == -1)
                		highlightLoop("loop", rowNum);
                	else if (rowString.indexOf("endloop") >= 0)
                		highlightLoop("endloop", rowNum);
                    highlightLine(rowNum);
                    
                    //Highlight every line of polygon
                    if(rowToString(rowNum).charAt(0) == 'g') while(rowToString(++rowNum).charAt(0) == '(') highlightLine(rowNum);
                }
                else
                    highlightCell(rowNum, colNum);
            }
        }
    });
    
    $('.innerTable' + figNum).off('mouseout');
    // we must put the cells we highlight red back to their normal state after we mouseout of them
    $('.innerTable' + figNum).on('mouseout', 'td', function(){
        codeTable.style.cursor = 'default';
        $('td').removeClass("selected");
    });
    
    //Turn click listener off
    $(".innerTable" + figNum).off("vclick");
    //Turn click listener back on
    $(".innerTable" + figNum).on("vclick", "td", function() {
        var cellVal = $(this).text();
        var colNum = $(this).index();
        var rowNum = ($(this).parent().parent().parent().parent().parent().index());
        var innerTable = codeTable.rows[rowNum].cells[0].children[0];
        var rowString = rowToString(rowNum);
        
        //User clicked on line number. Prompt for delete.
        if (colNum == 0 && rowNum != selRow && cellVal.trim().length > 0) {		
			var alert = new Alert();
			alert.open("Warning", "Are you sure you want to delete the text?", false, function(evt) {
				if(evt){
					if(rowString.indexOf("repeat") >= 0) {
	        			deleteLoop("repeat", rowNum);
	        		}
	        		else if (rowString.indexOf("endloop") >= 0) {
	        			deleteLoop("endloop", rowNum);
	        		}
	        		else if (rowString.indexOf("loop") >= 0) {
	        			deleteLoop("loop", rowNum);
	        		}
	        		else if (rowString.charAt(0) == 'g') {
						deletePolygon(rowNum);
					}
					else {
						if (!(rowToString(rowNum).charAt(0) == '(' && rowToString(rowNum + 1).charAt(0) != '(')) {
							codeTable.deleteRow(rowNum);
							if (rowNum < selRow) selRow--;
	        			}
					}
					refreshLineNumbers();
				}
				else
					return;			
			});	
        }
        
        //User clicked on variable number. Generate keypad pop up
		else if (isEditableValue(cellVal, rowNum) && rowString.indexOf("VARIABLE") == -1) {
			var currentElement = $(this);
        	//updating a distance variable
        	if (isDistanceAssign(rowNum)) {
        		var distanceVar = rowToString(rowNum).substring(0, rowToString(rowNum).indexOf("=") - 1);
        		//find if another instance of this distance variable has occurred already
    			if(beenAssigned(distanceVar, rowNum)) {
					var arr = new Array();
					arr.push(distanceVar + " + distanceValue");
					arr.push(distanceVar + " - distanceValue");
					for (var i = 0; i < distanceVariables.length; i++) {
						if (beenAssigned(distanceVariables[i], rowNum))
							arr.push(distanceVariables[i]);
					}
					arr.push("constant");
					var selector = new Selector();
					selector.open("Choice Selection Panel", arr, function(evt) {
						if (evt.indexOf("+") >= 0) {
							var currRow = rowNum;
							codeTable.deleteRow(currRow);
							addNewRow(currRow, [getIndent(currRow) + distanceVar, "&nbsp;=&nbsp;", distanceVar, "&nbsp;+&nbsp;", "X"]);
							selRow--;
						}
						else if (evt.indexOf("-") >= 0) {
							var currRow = rowNum;
							codeTable.deleteRow(currRow);
							addNewRow(currRow, [getIndent(currRow) + distanceVar, "&nbsp;=&nbsp;", distanceVar, "&nbsp;-&nbsp;", "X"]);
							selRow--;
						}
						else if (evt.indexOf("constant") >= 0) {
							var numpad = new NumberPad();
							numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function(evt) {
								currentElement.html(evt);
							});
						}
					});
        		}
        		else {
					var arr = new Array();
					for (var i = 0; i < distanceVariables.length; i++) {
						if (beenAssigned(distanceVariables[i], rowNum))
							arr.push(distanceVariables[i]);
					}
					arr.push("constant");
					if (arr.length > 1) {
						var selector = new Selector();
						selector.open("Choice Selection Panel", arr, function(evt) {
							if (evt.indexOf("constant") >= 0) {
								var numpad = new NumberPad();
								numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function(evt) {
									currentElement.html(evt);
								});
							}
							else {
								if (evt.length > 0) {
									currentElement.html(evt);
								}
							}
						});
					}
					else {
						var numpad = new NumberPad();
						numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function(evt) {
							currentElement.html(evt);
						});
					}
				}
        		
        	}
        	else {
				var arr = new Array();
				for (var i = 0; i < distanceVariables.length; i++) {
					if (beenAssigned(distanceVariables[i], rowNum))
						arr.push(distanceVariables[i]);
				}
				arr.push("constant");
				if (arr.length > 1) {
					var selector = new Selector();
					selector.open("Choice Selection Panel", arr, function(evt) {
						if (evt.length > 0) {
							if (evt.indexOf("constant") >= 0) {
								var numpad = new NumberPad();
								numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function(evt) {
									currentElement.html(evt);
									fixPolygons();
								});
							}
							else {
								currentElement.html(evt);
								fixPolygons();
							}
						}
					});
				}
				else {
					var numpad = new NumberPad();
					numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function(evt) {
						currentElement.html(evt);
						fixPolygons();
					});
				}
			}
        }
        
        //User clicked on something within draw(). Generate list of drawable items
        else if (rowToString(rowNum).indexOf("draw") >= 0 && cellVal.indexOf("draw") == -1 && cellVal.indexOf("(") == -1 && 
        cellVal.indexOf(")") == -1) {
			var arr = new Array();
            //finds all drawable shapes above the current row
            for (var i = 0; i < rowNum; i++) {
				if (rowToString(i).indexOf("=") >= 0 && rowToString(i).indexOf("VARIABLE") == -1 && !isDistanceAssign(rowNum)) {
					var variable = rowToString(i).substring(0, rowToString(i).indexOf("="));
					if (variable.length > 0 && $.inArray(variable, arr) == -1)
						if(variable.charAt(0) != 'd')
							arr.push(variable);
				}
			}
			var currentElement = $(this);
			if (arr.length > 0) {
				var selector = new Selector();
				selector.open("test title", arr, function(evt) {
					if (evt.length > 0)
						currentElement.html(evt);
				});
			}
			else
				alert("No drawable objects..");
        }
        
        //User clicked on an an item within erase(). Generate list of erasable items
        else if (rowToString(rowNum).indexOf("erase") >= 0 && cellVal.indexOf("(") == -1 && cellVal.indexOf(")") == -1) {
			var arr = new Array();
        	for (var i = 0; i < rowNum; i++) {
				var rowString = rowToString(i);
        		if (rowString.indexOf("draw") >= 0 && rowString.indexOf("OBJECT") == -1) {
					arr.push(rowString.substring(rowString.indexOf("(") + 1, rowString.indexOf(")")));
        		}
        	}
        	var currentElement = $(this);
        	if (arr.length > 0) {
				var selector = new Selector();
				selector.open("test title", arr, function(evt) {
					if (evt.length > 0)
						currentElement.html(evt);
				});
			}
			else
				alert("No erasable objects...");
        }
        
        //User clicked on an item within color(). Generate list of supported colors.
        else if (rowToString(rowNum).indexOf("color") >= 0 && cellVal.indexOf("color") == -1 && cellVal.indexOf("(") == -1 && 
        cellVal.indexOf(")") == -1) {
        	var arr = new Array();
        	var currentElement = $(this);
        	arr.push("red", "blue", "green", "yellow", "orange", "black", "white");
        	var selector = new Selector();
        	selector.open("Choice Selection Panel", arr, function(evt) {
				if (evt.length > 0)
					currentElement.html(evt);
			});
        }
        
        //User clicked on the loop counter. (It could already be assigned in which case it wouldn't be labeled "COUNTER")
        //Make sure user isn't clicking 'repeat' or 'times'
        else if (rowToString(rowNum).indexOf("repeat") >= 0 && cellVal.indexOf("repeat") == -1 && cellVal.indexOf("times") == -1 && 
        (!isNaN(Number(cellVal)) || cellVal.indexOf("COUNTER") >= 0)) {
        	var currentElement = $(this);
        	var numpad = new NumberPad();
        	numpad.open(0, 99, "Numeric Entry Pad", "Enter Two Digits", false, 10, function(evt) {
				currentElement.html(evt);
			});
        }
        
        //User clicked on item 'EXPRESSION'. Generate appropriate alert message
        else if (cellVal.indexOf("EXPRESSION") >= 0) {
            alert("When editing assignment\nstatements, Choose the Left\nHand Side varibale before\nattempting to specity the\n" + 
                "Right Hand Side expression");
        }
        
        //User clicked a variable on the left side of an assignment operator
        else if (colNum < innerTable.rows[0].cells.length-1) {
            if (innerTable.rows[0].cells[colNum+1].textContent.indexOf("=") >= 0) {
				var currentElement = $(this);
            	var arr = new Array();
            	for (var i = 0; i < distanceVariables.length; i++) {
            		arr.push(distanceVariables[i]);
            	}
            	for (var i = 0; i < pointVariables.length; i++) {
            		arr.push(pointVariables[i]);
            	}
            	for (var i = 0; i < lineVariables.length; i++) {
            		arr.push(lineVariables[i]);
            	}
            	for (var i = 0; i < circleVariables.length; i++) {
            		arr.push(circleVariables[i]);
            	}
            	for (var i = 0; i < polygonVariables.length; i++) {
            		arr.push(polygonVariables[i]);
            	}
          		if (arr.length > 0) {
					var selector = new Selector();
					selector.open("Choice Selection Panel", arr, function(evt) {
						if (evt.length > 0) {
							// if old variable was polygon , delete all its lines
							if(rowToString(rowNum).charAt(0) == 'g') deletePolygon(rowNum + 1);
							var currRow = rowNum;
							if (evt.indexOf("d") >= 0 && evt.indexOf("+") == -1 && evt.indexOf("-") == -1) {
								codeTable.deleteRow(currRow);
								insertTable.deleteRow(-1);
								addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "distanceValue"]);
								selRow--;
							}
							else if (evt.indexOf("p") >= 0) {
								codeTable.deleteRow(currRow);
								insertTable.deleteRow(-1);
								addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "X", ",", "Y", ")"]);
								selRow--;
							}
							else if (evt.indexOf("l") >= 0) {
								codeTable.deleteRow(currRow);
								insertTable.deleteRow(-1);
								addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "(", "X", ",", "Y", ")", ",", "(", "X", ",", "Y", ")", ")"]);
								selRow--;
							}
							else if (evt.indexOf("g") >= 0) {
								codeTable.deleteRow(currRow);
								insertTable.deleteRow(-1);
								addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "(", "X",  ",", "Y", ")", ","]);
								selRow--;
								addNewRow(currRow+1, [getIndent(rowNum) + indent + "(", "X", ",",  "Y", ")", ","]);
								addNewRow(currRow+2, [getIndent(rowNum) + indent + "(", "X", ",",  "Y", ")", ","]);
								addNewRow(currRow+3, [getIndent(rowNum) + indent + "(", "X", ",",  "Y", ")", ","]);
								addNewRow(currRow+4, [getIndent(rowNum) + indent + "(", "X", ",",  "Y", ")", ")"]);
							}
							else if (evt.indexOf("c") >= 0) {
								codeTable.deleteRow(currRow);
								insertTable.deleteRow(-1);
								addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "X", ",", "Y", ",", "RADIUS", ")"]);
								selRow--;
							}
						}
					});
				}
            }
		}
    });

	$(".insert").off("mouseover");
	$(".insert").on("mouseover", function() {
		var insertRow = $(this).parent().index();
		if ((insertRow < codeTable.rows.length-2 || selRow != codeTable.rows.length-1) && 
		insertRow+1 < codeTable.rows.length && rowToString(insertRow+1) != "loop" && insertRow+1 != selRow && insertRow+1 != selRow+1) {
			$(this).css('cursor', 'pointer');
			$(this).html(">");
		}
	});
	$(".insert").off("mouseout");
	$(".insert").on("mouseout", function() {
		$(this).html(blank);
	});
	$(".insert").off("vclick");
	$(".insert").on("vclick", function() {
		var insertRow = $(this).parent().index();
		if ((insertRow < codeTable.rows.length-2 || selRow != codeTable.rows.length-1) && 
		insertRow+1 < codeTable.rows.length && rowToString(insertRow+1) != "loop") {
			if (insertRow+1 != selRow) {
				moveToLine(insertRow+1);
				$(this).html(blank);
			}
		}
	});
	$("#" + offsetDiv.id).off("mouseover");
	$("#" + offsetDiv.id).on("mouseover", function() {
		if (selRow >0) {
			$(this).css('cursor', 'pointer');
			$(this).html(">");
		}
	});
	$("#" + offsetDiv.id).off("mouseout");
	$("#" + offsetDiv.id).on("mouseout", function() {
		$(this).html(blank);
	});
	$("#" + offsetDiv.id).off("vclick");
	$("#" + offsetDiv.id).on("vclick", function() {
		toggleEvents();
		if(selRow != 0) {
			moveToLine(0);
			$(this).html(blank);
		}
	});
	
	//Remove bar when scrolling right in editor
	$("#" + programDiv.id).off("scroll");
	$("#" + programDiv.id).on("scroll", function() {
		if ($(this).scrollLeft() > 0) {
			$("#" + dividerDiv.id).hide(250);
		}
		else {
			$("#" + dividerDiv.id).show(250);
		}
	});
}

// move to a specified row
function moveToLine(rowNum) {
    var innerTable = codeTable.rows[selRow].cells[0].children[0];
    var newRow;
    var cell;
    
    if (rowNum < selRow) {
        if (selRow != codeTable.rows.length-1) {
            codeTable.deleteRow(selRow);                                // delete the current selected row
            insertTable.deleteRow(-1);
        }
        else {
            innerTable.rows[0].cells[0].innerHTML = blank;
        }
        newRow = codeTable.insertRow(rowNum);                           // insert a new row at row number specified
        addNewInsertRow();
        cell = newRow.insertCell(0);                                    // insert a new cell in new row just created
        cell.innerHTML = innerTableArrowTemplate;                       // insert the innerTable template with arrow
        selectRow(rowNum);                                              // select newly inserted row
    }
    else {
    	if(insertTable.rows.length > 0) insertTable.deleteRow(-1);
    	addNewInsertRow();
        codeTable.deleteRow(selRow);                                    // delete the current selected row
        newRow = codeTable.insertRow(rowNum-1);                         // insert a new row at row number specified
        cell = newRow.insertCell(0);                                    // insert a new cell in new row just created
        cell.innerHTML = innerTableArrowTemplate;                       // insert the innerTable template with array
        selectRow(rowNum-1);                                            // select newly inserted row
    }
    refreshLineNumbers();
}

//refreshes line numbers
function refreshLineNumbers() {
	var innerTable;
	for (var i = 0; i < codeTable.rows.length-1; i++) {
		innerTable = codeTable.rows[i].cells[0].children[0];
		if (!isNaN(innerTable.rows[0].cells[0].textContent) || innerTable.rows[0].cells[0].textContent.length == 0) {
			if (i < 9) innerTable.rows[0].cells[0].innerHTML = (i+1) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			else innerTable.rows[0].cells[0].innerHTML = (i+1) + "&nbsp;&nbsp;&nbsp;";
		}
	}
}

//Adds new row on line <line> and creates cells bases on <params> array
function addNewRow(line, params) {
    var row = codeTable.insertRow(line);
    var cell = row.insertCell(0);
    cell.innerHTML = innerTableTemplate;
    var innerTable = codeTable.rows[line].cells[0].children[0];
    addRow(innerTable, params, 1);
    toggleEvents();
    selRow++;
    addNewInsertRow();
}

// addRow() takes an innerTable, a string of cell values, and a start index and populates the innerTable with these values
function addRow(table, values, startInd) {
    var cell;
    // for all cells in the table
    for (var i = 0; i < values.length; i++) {
        // insert a cell at startInd
        cell = table.rows[0].insertCell(startInd++);
        // make the innerHTML of the cell cells[i]
        cell.innerHTML = values[i];
    }
}

//adds a row to the insert area
function addNewInsertRow() {
	if(insertTable.rows.length > codeTable.rows.length) return;
	var row = insertTable.insertRow(-1);
	var cell = row.insertCell(0);
	cell.className = "insert";
	cell.innerHTML = blank;
	if (insertTable.rows.length == 1) {
		for (var i = 0; i < 3; i++) addNewInsertRow();
	}
}

// selectRow() selects a row with the specified rowNum
function selectRow(rowNum) {
    if (selRow != -1) {
        var innerTable = codeTable.rows[selRow].cells[0].children[0];
    }
    
    selRow = rowNum;
    if(codeTable.rows[rowNum] != undefined) {
		var innerTable = codeTable.rows[rowNum].cells[0].children[0];
		if (rowToString(selRow).trim().length == 0)
			innerTable.rows[0].cells[0].innerHTML = arrow;
	}
}

// highlight one cell red at a specific row and column
function highlightCell(rowInd, colInd) {
	// grab the inner table at the specified row
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    // color the cell red at specific column
    //innerTable.rows[0].cells[colInd].style.color = "#FF0000";
    //innerTable.rows[0].cells[colInd].style.fontWeight = "bold";
    if(innerTable.rows[0].cells[colInd].className.indexOf("comment") == -1)
		innerTable.rows[0].cells[colInd].className += " selected";
}

function highlightParenthesis(openBracket, closeBracket, rowInd, colInd) {
        var bracket = 1;
        var numCells;
        var firstBrack = false;
        var firstLoop = true;
        var innerTable;
        
        while (bracket != 0) {
            for (var i = 0; i < codeTable.rows.length; i++) {
                if (firstLoop == true) i = rowInd;
                innerTable = codeTable.rows[i].cells[0].children[0];
                numCells = innerTable.rows[0].cells.length
                for (var j = 0; j < numCells; j++) {
                    if (firstLoop == true) { j = colInd; firstLoop = false; }
                    
                    if (innerTable.rows[0].cells[j].textContent.indexOf(openBracket) >= 0) {
                        if (!firstBrack) firstBrack = true;
                        else bracket++;
                    }
                    else if (innerTable.rows[0].cells[j].textContent.indexOf(closeBracket) >= 0) {
                        bracket--;
                    }
                    if(innerTable.rows[0].cells[j].className.indexOf("comment") == -1)
						innerTable.rows[0].cells[j].className += " selected";
                    
                    if (bracket == 0) break;
                }
                
                if (bracket == 0) break;
            }
    }
}

function highlightParenthesisBackwards(openBracket, closeBracket, rowInd, colInd) {
    var bracket = 1;
    var numCells;
    var firstBrack = false;
    var firstLoop = true;
    var innerTable;
    
    while (bracket != 0) {
        for (var i = codeTable.rows.length - 1; i >= 0; i--) {
            if (firstLoop == true) i = rowInd;
            innerTable = codeTable.rows[i].cells[0].children[0];
            numCells = innerTable.rows[0].cells.length
            for (var j = numCells - 1; j >= 0; j--) {
                if (firstLoop == true) { j = colInd; firstLoop = false; }
                
                if (innerTable.rows[0].cells[j].textContent.indexOf(openBracket) >= 0) {
                    bracket--;
                }
                else if (innerTable.rows[0].cells[j].textContent.indexOf(closeBracket) >= 0) {
                    if (!firstBrack) firstBrack = true;
                    else bracket++;
                }
                if(innerTable.rows[0].cells[j].className.indexOf("comment") == -1)
					innerTable.rows[0].cells[j].className += " selected";
                
                if (bracket == 0) break;
            }
            
            if (bracket == 0) break;
        }
    }
}

// highlightLine() simply highlights the row with the row index passed to it
function highlightLine(rowInd) {
    // grab the inner table at this index
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    // grab the number of cells for this row
    var numCells = innerTable.rows[0].cells.length;
    // iterate throughout the cells
    for (var i = 0; i < numCells; i++) {
        //Highlight all cells red
        if(innerTable.rows[0].cells[i].className.indexOf("comment") == -1)
			innerTable.rows[0].cells[i].className += " selected";
    }
}

//Returns string representation of the row at specified row index
function rowToString(rowInd) {
    var string = "";
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    for (var i = 1; i < innerTable.rows[0].cells.length; i++) {
        string += innerTable.rows[0].cells[i].textContent;
    }
    return string.trim();
}

//Allows user to assign values to a declared variable
function assign() {
    addNewRow(selRow, [getIndent(selRow) + "VARIABLE", "&nbsp;=&nbsp;", "EXPRESSION"]);
}

//Allows user to choose a shape to draw
function drawShape() {
    addNewRow(selRow, [getIndent(selRow) + "draw", "(", "OBJECT", ")"]);
}

//Erases a shape
function erase() {
    addNewRow(selRow, [getIndent(selRow) + "erase", "(", "OBJECT", ")"]);
}

//Allow users to change the color of shapes
function changeColor() {
    addNewRow(selRow, [getIndent(selRow) + "color", "(", "COLOR_NAME", ")"]);
}

//Creates a loop in program window
function loop() {
	var thisIndent = getIndent(selRow);
    addNewRow(selRow, [thisIndent + "repeat&nbsp;", "COUNTER", "&nbsp;times"]);
    addNewRow(selRow, [thisIndent + "loop"]);
    addNewRow(selRow, [thisIndent + "endloop"]);
}

//editor text parsing functions

//This function detects if this line is a distance assignment
function isDistanceAssign(row) {
	var string = rowToString(row);
	if (string.indexOf("d") < string.indexOf("=") && string.indexOf("d") >= 0 && string.indexOf("+") == -1 && 
	string.indexOf("-") == -1)
		return true;
	else
		return false;
}

//This function checks to see if the specified variable has been assigned above the specified row
function beenAssigned(variable, row) {
	for (var i = 0; i < row; i++) {
		var string = rowToString(i);
		if(string.indexOf(variable) < string.indexOf("=") && string.indexOf(variable) >= 0)
			return true;
	}
	return false;
}

//This function checks to see if the user clicked on a variable value (X/Y/RADIUS/any number between 0-300). Can't be a line number.
function isEditableValue(cellVal, row) {
	var rowString = rowToString(row);
	if ((!isNaN(Number(cellVal) && rowString.indexOf("repeat") == -1)) && colNum > 0 || (cellVal.indexOf('distanceValue') >= 0 && 
	cellVal.indexOf("EXPRESSION") == -1 || cellVal.indexOf("Y") >= 0 || cellVal.indexOf("X") >= 0 || cellVal.indexOf("RADIUS") >= 0))
		return true;
	else
		return false;
}

function highlightLoop(type, rowNum) {
	var rowString = rowToString(rowNum);
	//highlight all lines until correct 'endloop'
	if (type.indexOf("repeat") >= 0 || type.indexOf("loop") >= 0 && type.indexOf("endloop") == -1) {
		if (type.indexOf("loop") >= 0 && type.indexOf("endloop") == -1) highlightLine(rowNum - 1);
		var loop = 1;
		var endloop = 0;
		for (var i = rowNum+1; i < codeTable.rows.length - 1; i++) {
			rowString = rowToString(i);
			if (loop == endloop) break;
			if (rowString.indexOf("repeat") >= 0) {
				loop++;
				highlightLine(i);
			}
			else if (rowString.indexOf("endloop") >= 0) {
				endloop++;
				highlightLine(i);
			}
			else
				highlightLine(i);
		}
	}
	else {
		var loop = 0;
		var endloop = 1;
		for (var i = rowNum-1; i >= 0; i--) {
			rowString = rowToString(i);
			if (loop == endloop) break;
			if (rowString.indexOf("endloop") >= 0) {
				endloop++;
				highlightLine(i);
			}
			else if (rowString.indexOf("repeat") >= 0) {
				loop++;
				highlightLine(i);
			}
			else
				highlightLine(i);
		}
	}
	
}

//delete loop
function deleteLoop(type, rowNum) {
	if (type.indexOf("endloop") >= 0) {
		var endloop = 1;
		var deleteNum = 1;
		var startDel = rowNum;

		while (endloop > 0) {
			var rowString = rowToString(startDel-1);
			if (rowString.indexOf("endloop") >= 0) endloop++;
			else if (rowString.indexOf("repeat") >= 0) endloop--;
			codeTable.deleteRow(startDel);
			startDel--;
			deleteNum++;
		}
		if (selRow < rowNum && selRow > ((codeTable.rows.length-1)-deleteNum)) {
			selRow = startDel;
			moveToLine(selRow+1);
		}
		else if (selRow > rowNum) {
			codeTable.deleteRow(startDel);
			selRow -= deleteNum;
		}
		else
			codeTable.deleteRow(startDel);
	}
	else if(type.indexOf("loop") >= 0 || type.indexOf("repeat") >= 0) {
		var repeat = 1;
		var deleteNum = 1;
		var startDel = rowNum;
		if (type.indexOf("loop") >= 0) startDel--;
		while (repeat > 0) {
			var rowString = rowToString(startDel+1);
			if (rowString.indexOf("repeat") >= 0) repeat++;
			else if (rowString.indexOf("endloop") >= 0) repeat--;
			codeTable.deleteRow(startDel);
			deleteNum++;
		}
		if (selRow > startDel && selRow < startDel+deleteNum) {
			selRow = startDel;
			moveToLine(selRow+1);
		}
		else if (selRow > startDel) {
			codeTable.deleteRow(startDel);
			selRow -= deleteNum;
		}
		else {
			codeTable.deleteRow(startDel);
		}
	}
}

//Makes the last row in polygon equal to first row
function fixPolygons() {
	var x = 0;
	var y = 0;
	for (var i = 0; i < codeTable.rows.length-1; i++) {
		var rowString = rowToString(i);
		if (rowString.indexOf("g") < rowString.indexOf("=") && rowString.indexOf("g") >= 0) {
			x = rowString.substring(rowString.indexOf("(") + 2, rowString.indexOf(","));
			y = rowString.substring(rowString.indexOf(",") + 1, rowString.indexOf(")"));
		}
		else if (rowString.indexOf("))") >= 0 && rowString.indexOf("((") == -1) {
			codeTable.deleteRow(i);
			insertTable.deleteRow(-1);
			addNewRow(i, [getIndent(i) + indent + "(", x, ",", y, ")", ")"]);
			selRow--;
		}
	}
}

//deletes all rows of a polygon
function deletePolygon(rowNum) {	
	codeTable.deleteRow(rowNum);
	if (rowNum < selRow) selRow--;
	while(rowToString(rowNum).charAt(0) == '('){
		codeTable.deleteRow(rowNum);
		if (rowNum < selRow) selRow--;
	}
}

//return string with correct number of indents.
function getIndent(row) {
	var loop = 0;
	for (var i = 0; i < row; i++) {
		if (rowToString(i).indexOf("loop") >= 0 && rowToString(i).indexOf("endloop") == -1) loop++;
		if (rowToString(i).indexOf("endloop") >= 0) loop--;
	}
	var string = "";
	for (var i = 0; i < loop; i++) {
		string += indent;
	}
	return string;
}











