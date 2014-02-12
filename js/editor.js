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
var innerTableTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>" + "*" + "&nbsp;&nbsp;</td></tr></table>";
//Template used for a newly selected row
var innerTableArrowTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>&nbsp;&nbsp;</td></tr></table>";
// This identifies the current clicked element for change later on from numpad and variable chooser
var CurrentElement; 
var currRow = 0;

init();

function init() { //Initializes variables
    var row;
    var cell;
    var innerTable;
    
    //Make a blank row where the program starts
    row = codeTable.insertRow(0);
    // make a new cell here
    cell = row.insertCell(0);
    //Set the cell with arrow template
    cell.innerHTML = innerTableArrowTemplate;
    //Selected row is line 2
    selRow = 0;
    selectRow(selRow);
}

//We must refresh the events upon each change within the tables... toggleEvents() is called each time something is altered
function toggleEvents() {
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
        
        // we pass rowNum and colNum to tell the function where start highlighting
        if (cellVal.indexOf('=') == -1 && cellVal.indexOf('draw') == -1 && cellVal.indexOf('erase') == -1 && cellVal.indexOf('color') == -1 && 
            cellVal.indexOf('repeat') == -1 && cellVal.indexOf('times') == -1 && cellVal.indexOf('loop') == -1 && 
            cellVal.indexOf('endloop') == -1) {
            //set cursor to pointer when hovering over clickable items
            $(this).css('cursor', 'pointer');
            if (cellVal.indexOf('(') >= 0 && rowToString(rowNum).indexOf("draw") == -1 && rowToString(rowNum).indexOf("erase") == -1 && 
                rowToString(rowNum).indexOf("color") == -1)
                highlightParenthesis('(', ')', rowNum, colNum);
            else if (cellVal.indexOf(')') >= 0 && rowToString(rowNum).indexOf("draw") == -1 && rowToString(rowNum).indexOf("erase") == -1 && 
                rowToString(rowNum).indexOf("color") == -1)
                highlightParenthesisBackwards('(', ')', rowNum, colNum);
            else if (cellVal.indexOf("(") == -1 && cellVal.indexOf(")") == -1) {
                if (cellVal.indexOf("*") >= 0) {
                    if (rowToString(rowNum).indexOf("repeat") >= 0) {
                        for (var i = 0; i < codeTable.rows.length; i++) {
                            if (rowToString(rowNum+i).indexOf("endloop") >= 0) {
                                highlightLine(rowNum+i);
                                break;
                            }
                            else {
                                highlightLine(rowNum+i);
                            }
                        }
                    }
                    highlightLine(rowNum);
                }
                else
                    highlightCell(rowNum, colNum);
            }
        }
    });
    
    $('.innerTable' + figNum).off('mouseout');
    // we must put the cells we highlight red back to their normal state after we mouseout of them
    $('.innerTable' + figNum).on('mouseout', 'td', function(){
        returnToNormalColor();
        codeTable.style.cursor = 'default';
    });
    
    //Turn click listener off
    $(".innerTable" + figNum).off("click");
    //Turn it back on
    $(".innerTable" + figNum).on("click", "td", function() {
        var cellVal = $(this).text();
        var colNum = $(this).index();
        var rowNum = ($(this).parent().parent().parent().parent().parent().index());
        var innerTable = codeTable.rows[rowNum].cells[0].children[0];
        //Delete this row if user confirms
        if (cellVal.indexOf("*") >= 0) {
        	if(confirm("Are you sure you want to delete the highlited\ntext?")) {
        		codeTable.deleteRow(rowNum);
            	if (rowNum < selRow) selRow--;
        	}
        	else {
        		return;
        	}
        }
        else if ($(this).html().indexOf(blank) >= 0) {
        	//TODO: remove old insertion area. It's not needed anymore
        }
        //User clicked on variable number. Generate keypad pop up
		else if (isEditableValue(cellVal, rowNum)) {        	
        	//updating a distance variable
        	if (rowToString(rowNum).indexOf("d") >= 0 && rowToString(rowNum).indexOf("draw") == -1 && rowToString(rowNum).indexOf("+") == -1 && 
        		rowToString(rowNum).indexOf("-") == -1) {
        			
        		var found = false;
        		list = "";
        		var distanceVar = rowToString(rowNum).substring(0, rowToString(rowNum).indexOf("=")-1);
        		
        		//find if another instance of this distance variable has occurred already
    			if(beenAssigned(distanceVar, rowNum)) {
    				found = true;
    				list += "<option>" + distanceVar + "=" + distanceVar + "+X";
    				list += "<option>" + distanceVar + "=" + distanceVar + "-X";
    				list += "<option>constant</option>";
					currRow = rowNum;
					CurrentElement = $(this);
					CreateDialogOptions(list);
					$( "#dialog-modal-Vars" ).dialog({
						height: 280,
						width: 350,
						modal: true
					});
        		}
        		
        		//if no previous distance variable has been found, just generate keypad pop up
        		if (!found) {
        			CurrentElement = $(this);
		            $("input.InputValue").val("");
					$( "#dialog-modal-num" ).dialog(
					{
						height: 280,
						width: 350,
						modal: true
					});
        		}
        		
        	}
        	else {
        		//check to see if any distance variables have appeared on the left side of an assignment before this point.
        		currRow = rowNum;
        		CurrentElement = $(this);
        		list = "";
        		for (var i = 0; i < currRow; i++) {
        			if (rowToString(i).indexOf("d") < rowToString(i).indexOf("=") && rowToString(i).match("d")) {
        				var rowString = rowToString(i);
        				list += "<option>" + rowString.substring(rowString.indexOf("d"), rowString.indexOf("=")-1) + "</option>";
        			}
        		}
        		//if distance vars were found assigned...
        		if (list.length > 1) {
        			list += "<option>constant</option>";
        			CreateDialogOptions(list);
					$( "#dialog-modal-Vars" ).dialog({
						height: 280,
						width: 350,
						modal: true
					});
        		}
        		else {
		            $("input.InputValue").val("");
					$( "#dialog-modal-num" ).dialog(
					{
						height: 280,
						width: 350,
						modal: true
					});
				}
        	}
        }
        //User clicked on something within draw(). Generate list of drawable items
        else if (rowToString(rowNum).indexOf("draw") >= 0 && cellVal.indexOf("draw") == -1 && cellVal.indexOf("(") == -1 && 
        cellVal.indexOf(")") == -1) {
        	//list variable stores list of items
            list = "";
            //finds all drawable shapes above the current row
            for (var i = 0; i < rowNum; i++) {
			if (rowToString(i).indexOf("=") >= 0 && rowToString(i).indexOf("VARIABLE") == -1)
				if (rowToString(i).substring(0, rowToString(i).indexOf("=")).length > 0)
					list += "<option>" + rowToString(i).substring(0, rowToString(i).indexOf("=")) + "</option>";
			}
			currRow = rowNum;
			CurrentElement = $(this);
			CreateDialogOptions(list);
			$( "#dialog-modal-Vars" ).dialog({
				height: 280,
				width: 350,
				modal: true
			});
        }
        else if (rowToString(rowNum).indexOf("erase") >= 0 && cellVal.indexOf("(") == -1 && cellVal.indexOf(")") == -1) {
        	list = "";
        	for (var i = 0; i < rowNum; i++) {
        		if (rowToString(i).indexOf("draw") >= 0 && rowToString(i).indexOf("OBJECT") == -1) {
        			list += "<option>" + rowToString(i).substring(rowToString(i).indexOf("(")+1, rowToString(i).indexOf(")")) + "</option>";
        		}
        	}
        	currRow = rowNum;
        	CurrentElement = $(this);
			CreateDialogOptions(list);
			$( "#dialog-modal-Vars" ).dialog(
			{
				height: 280,
				width: 350,
				modal: true
			});
        }
        else if (rowToString(rowNum).indexOf("color") >= 0 && cellVal.indexOf("color") == -1) {
        	list = "<option>red</option>" + "<option>blue</option>" + "<option>green</option>" + "<option>yellow</option>" + 
        		"<option>orange</option>" + "<option>black</option>" + "<option>white</option>";
            currRow = rowNum;
            CurrentElement = $(this);
			CreateDialogOptions(list);
			$( "#dialog-modal-Vars" ).dialog(
			{
				height: 280,
				width: 350,
				modal: true
			});	
        }
        //User clicked on the loop counter. (It could already be assigned in which case it wouldn't be labeled "COUNTER")
        //Make sure user isn't clicking 'repeat' or 'times'
        else if (rowToString(rowNum).indexOf("repeat") >= 0 && cellVal.indexOf("repeat") == -1 && cellVal.indexOf("times") == -1) {
        	CurrentElement = $(this);
            $("input.InputValue").val("");
			$( "#dialog-modal-num" ).dialog(
			{
				height: 280,
				width: 350,
				modal: true
			});
        }
        else if (cellVal.indexOf("EXPRESSION") >= 0) {
            alert("When editing assignment\nstatements, Choose the Left\nHand Side varibale before\nattempting to specity the\n" + 
                "Right Hand Side expression");
        }
        //User clicked a variable on the left side of an assignment operator
        else if (colNum < innerTable.rows[0].cells.length-1)
            if (innerTable.rows[0].cells[colNum+1].innerText.indexOf("=") >= 0) {
            	list = "";
            	for (var i = 0; i < distanceVariables.length; i++) {
            		list += "<option>" + distanceVariables[i] + "</option>";
            	}
            	for (var i = 0; i < pointVariables.length; i++) {
            		list += "<option>" + pointVariables[i] + "</option>";
            	}
            	for (var i = 0; i < lineVariables.length; i++) {
            		list += "<option>" + lineVariables[i] + "</option>";
            	}
            	for (var i = 0; i < circleVariables.length; i++) {
            		list += "<option>" + circleVariables[i] + "</option>";
            	}
            	for (var i = 0; i < polygonVariables.length; i++) {
            		list += "<option>" + polygonVariables[i] + "</option>";
            	}
          		CurrentElement = $(this);
          		currRow = rowNum;
				CreateDialogOptions(list);
				$( "#dialog-modal-Vars" ).dialog(
				{
					height: 280,
					width: 350,
					modal: true
				});
				
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
	$(".insert").off("click");
	$(".insert").on("click", function() {
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
	$("#" + offsetDiv.id).off("click");
	$("#" + offsetDiv.id).on("click", function() {
		if(selRow != 0) {
			moveToLine(0);
			$(this).html(blank);
		}
	});
}

//Return everything to normal color (black)
function returnToNormalColor() {
    for (var i = 0; i < codeTable.rows.length; i++) {
        var innerTable = codeTable.rows[i].cells[0].children[0];
        var numCells = innerTable.rows[0].cells.length;
        for (var j = 0; j < numCells; j++) {
            innerTable.rows[0].cells[j].style.color = "#000000";
            innerTable.rows[0].cells[j].style.fontWeight = "normal";
        }
    }
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
    	insertTable.deleteRow(-1);
    	addNewInsertRow();
        codeTable.deleteRow(selRow);                                    // delete the current selected row
        newRow = codeTable.insertRow(rowNum-1);                         // insert a new row at row number specified
        cell = newRow.insertCell(0);                                    // insert a new cell in new row just created
        cell.innerHTML = innerTableArrowTemplate;                       // insert the innerTable template with array
        selectRow(rowNum-1);                                            // select newly inserted row
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
    var innerTable = codeTable.rows[rowNum].cells[0].children[0];
    if (innerTable.rows[0].cells[0].innerHTML.indexOf("*") == -1)
		innerTable.rows[0].cells[0].innerHTML = arrow;
}

// highlight one cell red at a specific row and column
function highlightCell(rowInd, colInd) {
	// grab the inner table at the specified row
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    // color the cell red at specific column
    innerTable.rows[0].cells[colInd].style.color = "#FF0000";
    innerTable.rows[0].cells[colInd].style.fontWeight = "bold";
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
                    
                    if (innerTable.rows[0].cells[j].innerText.indexOf(openBracket) >= 0) {
                        if (!firstBrack) firstBrack = true;
                        else bracket++;
                    }
                    else if (innerTable.rows[0].cells[j].innerText.indexOf(closeBracket) >= 0) {
                        bracket--;
                    }
                    innerTable.rows[0].cells[j].style.color = "#FF0000";
                    innerTable.rows[0].cells[j].style.fontWeight = "bold";
                    
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
                
                if (innerTable.rows[0].cells[j].innerText.indexOf(openBracket) >= 0) {
                    bracket--;
                }
                else if (innerTable.rows[0].cells[j].innerText.indexOf(closeBracket) >= 0) {
                    if (!firstBrack) firstBrack = true;
                    else bracket++;
                }
                
                innerTable.rows[0].cells[j].style.color = "#FF0000";
                innerTable.rows[0].cells[j].style.fontWeight = "bold";
                
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
        innerTable.rows[0].cells[i].style.color = '#FF0000';
        innerTable.rows[0].cells[i].style.fontWeight = "bold";
    }
}

//Returns string representation of the row at specified row index
function rowToString(rowInd) {
    var string = "";
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    for (var i = 1; i < innerTable.rows[0].cells.length; i++) {
        string += innerTable.rows[0].cells[i].innerText;
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
    addNewRow(selRow, [thisIndent + "repeat", "COUNTER", "times"]);
    addNewRow(selRow, [thisIndent + "loop"]);
    addNewRow(selRow, [thisIndent + "endloop"]);
}

//editor text parsing functions

//This function detects if this line is a distance assignment
function isDistanceAssign(row) {
	var string = rowToString(row);
	if (string.indexOf("d") < string.indexOf("=") && string.indexOf("d") >= 0)
		return true;
	else
		return false;
}

//This function checks to see if the specified distance variable has been assignmed above the specified row
function beenAssigned(distanceVar, row) {
	for (var i = 0; i < row; i++) {
		if(isDistanceAssign(i)) {
			return true;
		}
	}
	return false;
}

//This function checks to see if the user clicked on a variable value (ie X/Y/RADIUS/any number between 0-300)
function isEditableValue(cellVal, row) {
	var rowString = rowToString(row);
	if ((!isNaN(Number(cellVal) && rowString.indexOf("repeat") == -1)) || (cellVal.indexOf('X') >= 0 && cellVal.indexOf("EXPRESSION") == -1 || 
	cellVal.indexOf("Y") >= 0 || cellVal.indexOf("RADIUS") >= 0))
		return true;
	else
		return false;
}















