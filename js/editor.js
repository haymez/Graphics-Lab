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
var innerTableTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>" + blank + "</td><td class='codeTd'>" + "*" + "&nbsp;&nbsp;</td></tr></table>";
//Template used for a newly selected row
var innerTableArrowTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>" + arrow +  "</td><td class='codeTd'>&nbsp;&nbsp;</td></tr></table>";
// This identifies the current clicked element for change later on from numpad and variable chooser
var CurrentElement; 

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
        //Delete this row
        if (cellVal.indexOf("*") >= 0) {
            alert("delete this row");
            codeTable.deleteRow(rowNum);
            if (rowNum < selRow) selRow--;
        }
        else if ($(this).html().indexOf(blank) >= 0) {
            moveToLine(rowNum);
        }
        //User clicked on variable number. Generate keypad pop up
        else if (!isNaN(Number(cellVal)) && rowToString(rowNum).indexOf("repeat") == -1) {
					/************************************************************************************************************************/
            CurrentElement = $(this);
            $("input.InputValue").val("");
			$( "#dialog-modal-num" ).dialog(
			{
				height: 280,
				width: 350,
				modal: true
			});
					/************************************************************************************************************************/
        }
        //User clicked on something within draw(). Generate list of drawable items
        else if (rowToString(rowNum).indexOf("draw") >= 0 && cellVal.indexOf("draw") == -1 && cellVal.indexOf("(") == -1 && 
        cellVal.indexOf(")") == -1) {
        	//list variable stores list of items
            list = "";
            //finds all drawable shapes above the current row
            for (var i = 0; i < rowNum; i++) {
			if (rowToString(i).indexOf("=") && rowToString(i).indexOf("VARIABLE") == -1)
				if (rowToString(i).substring(0, rowToString(i).indexOf("=")).length > 0)
					list += "<option>" + rowToString(i).substring(0, rowToString(i).indexOf("=")) + "</option>";
			}
			CurrentElement = $(this);
			console.log(list);
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
            alert("Generate keypad with 2 digit limit")
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
				CreateDialogOptions(list);
				$( "#dialog-modal-Vars" ).dialog(
				{
					height: 280,
					width: 350,
					modal: true
				});	
					/************************************************************************************************************************/
//                alert("Generate pop up with list of declared variables");
            }
    });
}

/*//Moves pointer to specific location
function movePointer(rowNum) {
    var oldRow = selRow;
    console.log(rowToString(selRow));
    addNewRow(rowNum, []);
}*/

//Return everything to normal color (black)
function returnToNormalColor() {
    for (var i = 0; i < codeTable.rows.length; i++) {
        var innerTable = codeTable.rows[i].cells[0].children[0];
        var numCells = innerTable.rows[0].cells.length;
        for (var j = 0; j < numCells; j++) {
            innerTable.rows[0].cells[j].style.color = "#000000";
        }
    }
}

// move to a specified row
function moveToLine(rowNum) {
    var innerTable = codeTable.rows[selRow].cells[0].children[0];
    var newRow;
    var cell;
    
    if (rowNum < selRow) {
        if (selRow != codeTable.rows.length-1)
            codeTable.deleteRow(selRow);                                // delete the current selected row
        else {
            innerTable.rows[0].cells[0].innerHTML = blank;
        }
        newRow = codeTable.insertRow(rowNum);                           // insert a new row at row number specified
        cell = newRow.insertCell(0);                                    // insert a new cell in new row just created
        cell.innerHTML = innerTableArrowTemplate;                       // insert the innerTable template with array
        selectRow(rowNum);                                              // select newly inserted row
    }
    else {
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
    addRow(innerTable, params, 2);
    toggleEvents();
    selRow++;
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

// selectRow() selects a row with the specified rowNum
function selectRow(rowNum) {
    if (selRow != -1) {                                                                                                                // if there is a selected row
        var innerTable = codeTable.rows[selRow].cells[0].children[0]; // grab the innerTable for the currently selected row
        innerTable.rows[0].cells[0].innerHTML = blank; // make its arrow go away (it is no longer selected)
    }
    
    selRow = rowNum;
    var innerTable = codeTable.rows[rowNum].cells[0].children[0];
    innerTable.rows[0].cells[0].innerHTML = arrow;
}

// highlight one cell red at a specific row and column
function highlightCell(rowInd, colInd) {
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];               // grab the inner table at the specified row
    innerTable.rows[0].cells[colInd].style.color = "#FF0000";                   // color the cell red at specific column
}

// highlightControlStructure() looks for matching braces '{' and '}'. Once the braces match up. it stops highlighting
function highlightLoop(rowInd, colInd) {
    var bracket = 1;                        // bracket found initialized to 1 so the while loops executes
    var numCells;                                // number of cells in the current row
    var firstBrack = false;                // first bracket found flag; since bracket is initialized to one, the first bracket doesn't count
    
    for (var i = rowInd; i < codeTable.rows.length; i++) {                                                                // iterate throughout rows starting at the specified index
        var innerTable = codeTable.rows[i].cells[0].children[0];                                                // grab the inner table of this row
        var numCells = innerTable.rows[0].cells.length                                                                        // grab the number of cells in this row
        for (var j = 0; j < numCells; j++) {                                                                                        // iterate throughout these cells
            if (innerTable.rows[0].cells[j].innerText.indexOf("{") >= 0) {                                // if we found a '{'
                if (!firstBrack) firstBrack = true;                                                                                // if this is the first bracket, skip it
                else bracket++;                                                                                                                        // otherwise, count it
            }
            else if (innerTable.rows[0].cells[j].innerText.indexOf("}") >= 0) {                        // if we found a '}'
                bracket--;                                                                                                                                // subtract from bracket
            }
            
            innerTable.rows[0].cells[j].style.color = "#FF0000";                                                // color the current cell red as we go
        }
        if (bracket == 0) break;                                                                                                                // if we found matching brackets, brackets will be 0, break
    }
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
    }
}

/*function addBlankLine() {
    var row = codeTable.insertRow(selRow);
    var cell = row.insertCell(0);
    cell.innerHTML = innerTableTemplate;
    selRow++;
    toggleEvents();
}*/

/*//loop() adds a loop to the current selected line
function loop(params) {
        var indentStr = findIndentation(selRow);
        var row;
        var cell;
        var innerTable;
        
        for (var i = 0; i < 3; i++) {
            row = codeTable.insertRow(selRow + i);
            cell = row.insertCell(0);
            cell.innerHTML = innerTableTemplate;
            innerTable = codeTable.rows[selRow + i].cells[0].children[0];
            
            if (i == 0) {
                    addRow(innerTable, [ indentStr + "<b>for</b>&nbsp;", "(", params[0] + "&nbsp;", "=&nbsp;", params[1], ";&nbsp;", params[2] + "&nbsp;", params[3] + "&nbsp;", params[4], ";&nbsp;", params[5], params[6], ")" ], 2);
                    addRowStyle(innerTable, [ "blue", "black", "black", "black", "black", "black", "black", "black", "black", "black", "black", "black", "black" ], 2);
            }
            else if (i == 1) { addRow(innerTable, [ indentStr + "{" ], 2); }
            else if (i == 2) { addRow(innerTable, [ indentStr + "}" ], 2); }
        }
        
        selectRow(selRow + 3);
        toggleEvents();
}*/

/*// findIndentation() returns a string with the appropriate spacing depending on the row number passed to it
// Starting from the top of the code, it finds how many mismatching brackets '{' '}' there are when the row
// is reached. The number of opened brackets without a matching close parenthesis is how many tabs this row
// will need
function findIndentation(row) {
    var bracket = 0;        // number of brackets opened
    for (var i = 0; i < codeTable.rows.length; i++) {                                                                // iterate throughout the code table
        if (i == row) break;                                                                                                                // when the iteration equals the row, stop
        var innerTable = codeTable.rows[i].cells[0].children[0];                                        // grab the inner table for this row in the code table
        var numCells = innerTable.rows[0].cells.length;                                                                // grab the number of cells in this inner table
        for (var j = 0; j < numCells; j++) {                                                                                // iterate throughout the cells
            if (innerTable.rows[0].cells[j].innerText.indexOf('{') >= 0) {                        // if an open bracket, add one to bracket
                bracket++;
            }
            else if (innerTable.rows[0].cells[j].innerText.indexOf('}') >= 0) {                // if a close bracket, subtract one from bracket
                bracket--;
            }
        }
    }
    
    // the bracket variable is how many indents we need
    var indents = "";
    for (var i = 0; i < bracket; i++) indents += indent;
    
    return indents;
}*/

/*function selectNextLine(line) {
    var numRows = codeTable.rows.length;
    var innerTable;
    var numCells;
    var found = false;
    
    for (var i = 0; i < numRows; i++) {
        innerTable = codeTable.rows[i].cells[0].children[0];
    }
    
    if (found == false) {
        var oldInnerTable = codeTable.rows[selRow].cells[0].children[0];
        oldInnerTable.rows[0].cells[1].innerHTML = blank;
        innerTable = codeTable.rows[numRows - 1].cells[0].children[0];
        innerTable.rows[0].cells[1].innerHTML = arrow;
        selRow = numRows - 1;
    }
}*/

//Returns string representation of the row at specified row index
function rowToString(rowInd) {
    var string = "";
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    for (var i = 2; i < innerTable.rows[0].cells.length; i++) {
        string += innerTable.rows[0].cells[i].innerText;
    }
    return string;
}

//Allows user to assign values to a declared variable
function assign() {
    addNewRow(selRow, ["VARIABLE", "&nbsp;=&nbsp;", "EXPRESSION"]);
}

//Allows user to choose a shape to draw
function drawShape() {
    addNewRow(selRow, ["draw", "(", "OBJECT", ")"]);
}

//Erases a shape
function erase() {
    addNewRow(selRow, ["erase", "(", "OBJECT", ")"]);
}

//Allow users to change the color of shapes
function changeColor() {
    addNewRow(selRow, ["color", "(", "COLOR_NAME", ")"]);
}

//Creates a loop in program window
function loop() {
    addNewRow(selRow, ["repeat", "COUNTER", "times"]);
    addNewRow(selRow, ["loop"]);
    addNewRow(selRow, ["endloop"]);
}









