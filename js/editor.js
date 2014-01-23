/*
 * This code is for the Watson Graphics Lab editor.
 */

var selRow = 0; // the current selected row
var blank = "&nbsp;&nbsp;&nbsp;&nbsp;"; // blank template for unselected row
var arrow = "&#8594;"; // arrow template for selected row
var indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" // indention used for inside brackets
var variableCount = 0; // keeps count of the amount of variables
var programStart = 0; // the line the main program starts
var firstMove = false; // keeps track if the user has added something to the main program
var innerTableTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>" + blank + "</td><td class='codeTd'>&#8226;&nbsp;&nbsp;</td></tr></table>"; // template used for a newly added row in the codeTable
var innerTableArrowTemplate = "<table class='innerTable" + figNum + "'" + "><tr><td class='codeTd'>" + arrow +  "</td><td class='codeTd'>&nbsp;&nbsp;</td></tr></table>"; // template used for a newly selected row

init();

function init() { //Initializes variables
    var row;
    var cell;
    var innerTable;
    
    // make a blank row where the program starts (this could have been in the for loops above)
    row = codeTable.insertRow(0);        // make a new row
    cell = row.insertCell(0);                // make a new cell here
    cell.innerHTML = innerTableArrowTemplate;        // set the cell with arrow template
    programStart = 0;                                // increate the program start to 2
    selRow = 0;                                                // selected row is line 2
}

// we must refresh the events upon each change within the tables... toggleEvents() is called each time something is altered
function toggleEvents() {
    $('.innerTable' + figNum).off('mouseover');                                                // turn off mouseover event
    
    $('.innerTable' + figNum).on('mouseover', 'td', function(){                // turn it back on
        cellVal = $(this).text();                                                        // grab the hovered cell's value
        colNum = ($(this).index());                                                        // grab the hovered cell's index
        var rowNum = ($(this).parent().parent().parent().parent().parent().index());        // grab the row number from codeTable (this is a silly way of doing it, but it works)
        
        // depending on what cell the mouse if over, highlight accordingly
        // go look at the functions getting called here to understand what is going on
        // we pass rowNum and colNum to tell the function where start highlighting
        if (cellVal.indexOf('(') >= 0) highlightParenthesis('(', ')', rowNum, colNum);        // must highlight backwards if we land on a '}'
        else if (cellVal.indexOf(')') >= 0)        highlightParenthesisBackwards('(', ')', rowNum, colNum);
        else highlightCell(rowNum, colNum);
    });
    
    $('.innerTable' + figNum).off('mouseout');                                        // toggle mouseout event
    
    // we must put the cells we highlight red back to their normal state after we mouseout of them
    $('.innerTable' + figNum).on('mouseout', 'td', function(){
        returnToNormalColor();
        codeTable.style.cursor = 'default';
    });
}

function returnToNormalColor() {
    for (var i = 0; i < codeTable.rows.length; i++) {
        var innerTable = codeTable.rows[i].cells[0].children[0];                                                                                // grab the inner table for this table data object
        var numCells = innerTable.rows[0].cells.length;                                                                                                       // grab the number of cells in this inner table
        
        for (var j = 0; j < numCells; j++) {                                                                                                                // the rest is black
            innerTable.rows[0].cells[j].style.color = "#000000";
        }
    }
}

// move to a specified row
function moveToLine(rowNum) {
    var newRow;
    var cell;

    codeTable.deleteRow(selRow);                                    // delete the current selected row
    newRow = codeTable.insertRow(rowNum);                           // insert a new row at row number specified
    cell = newRow.insertCell(0);                                    // insert a new cell in new row just created
    cell.innerHTML = innerTableArrowTemplate;                       // insert the innerTable template with array
    selectRow(rowNum);                                              // make this the new selected row
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
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];        // grab the inner table at this index
    var numCells = innerTable.rows[0].cells.length;                                        // grab the number of cells for this row
    for (var i = 0; i < numCells; i++) {                                                        // iterate throughout the cells
        innerTable.rows[0].cells[i].style.color = '#FF0000';                // highlight all cells red
    }
}

function addBlankLine() {
    var row = codeTable.insertRow(selRow);
    var cell = row.insertCell(0);
    cell.innerHTML = innerTableTemplate;
    selRow++;
    toggleEvents();
}

//loop() adds a loop to the current selected line
function loop(params) {
        if (!firstMove) {
            addMainProgramComment();
            firstMove = true;
        }
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
        
        if (selRow < programStart) programStart += 3;
        toggleEvents();
}

//TEST CODE
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
    for (var i = 0; i < values.length; i++) {                        // for all cells in the table
        cell = table.rows[0].insertCell(startInd++);        // insert a cell at startInd
        cell.innerHTML = values[i];                                                // make the innerHTML of the cell cells[i]
    }
}

// addRowStyle() takes an innerTable, a string of colors, and a start index and styles the innerTable cells with these colors
function addRowStyle(table, colors, startInd) {
    var cell;
    for (var i = 0; i < colors.length; i++) {                        // for all cells in the table
        cell = table.rows[0].cells[startInd++];                        // get the cell at the current index
        cell.style.color = colors[i];                                        // change its style to cells[i]
    }
}

// deleteFunction() checks to see what the element is that is requested to be deleted, and deletes that element
function deleteFunction(rowNum, colNum) {
    var innerTable = codeTable.rows[rowNum].cells[0].children[0];                        // grab the inner table that needs to be deleted
    
    if (isOneLineElement(innerTable.rows[0])) deleteOneLineElement(rowNum);        // if its a one line element, delete it
}

// deleteOneLineElement() is responsible for appropriately deleting an element that takes up one line
function deleteOneLineElement(rowNum) {
    if (selRow > rowNum) selRow--;
    if (programStart > rowNum) programStart--;
    
    codeTable.deleteRow(rowNum);
}

// isOneLineElement() checks to see if the row passed is a one line element such as an assignment
function isOneLineElement(row) {
    var rowLength = row.cells.length;
    
    if (rowLength == 6) {
            for (var i = 0; i < rowLength; i++) {
                if (row.cells[i].innerText.indexOf("=") >= 0) { return true; }                // check for assignment
                if (row.cells[i].innerText.indexOf("write") >= 9) { return true; }        // check for a write/writeln
            }
    }
    else if (rowLength == 10) {
            for (var i = 0; i < rowLength; i++) {
                if (row.cells[i].innerText.indexOf("prompt") >= 0) { return true; }        // check for a prompt
            }
    }
    else if (rowLength == 12) {
            for (var i = 0; i < rowLength; i++) {
                if (row.cells[i].innerText.indexOf("prompt") >= 0) { return true; }        // check for a prompt again (numeric prompt)
            }
    }
    else {
        if (row.cells[2].innerText.indexOf("return") >= 0) return true;                        // check for a return
        if (row.cells[2].innerText.indexOf("FUNCTION") >= 0) return true;                // check for a function that hasn't been renamed
        if (functionExists(row.cells[2].innerText)) return true;                                // check to see if the function exists that has been named
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

// findIndentation() returns a string with the appropriate spacing depending on the row number passed to it
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
}

// checkValidRow() makes sure the program doesn't move somewhere that it shouldn't
// For example, we don't want the user moving into the variable sections
function checkValidRow(row, rowNum) {
    if (row.cells[2].innerText.indexOf("//") >= 0) return false;                                                                // don't let the user edit a comment
    if (row.cells[2].innerText == '\xA0') return false;                                                                                        // don't let the user edit a blank line
    if (row.cells[2].innerText.indexOf("{") >= 0 && rowNum >= programStart) return false;                // don't let the user edit before a '{'
    if (rowNum < variableCount + 3) return false;                                                                                                // don't let the user edit in the variable space
    
    // the following if statements ensure that a user doesn't edit before the program start (in the variable or function space.. unless its inside a function)
    if ((selRow < programStart && rowNum < programStart + 1) || (rowNum < programStart)) {
        if (row.cells[2].innerText.indexOf("{") >= 0 && selRow > rowNum) return false;
        if (row.cells[2].innerText.indexOf("}") >= 0 && selRow < rowNum) return false;
        if (row.cells[2].innerText.indexOf("function") >= 0) return false;
    }
    return true;
}

function selectNextLine(line) {
    var numRows = codeTable.rows.length;
    var innerTable;
    var numCells;
    var execLines = 0;
    var found = false;
    
    for (var i = 0; i < numRows; i++) {
        innerTable = codeTable.rows[i].cells[0].children[0];
        if (innerTable.rows[0].cells.length > 3 && innerTable.rows[0].cells[2].innerHTML.indexOf("//") < 0) {
                execLines++;
        }
            
        if (execLines == line) {
            var oldInnerTable = codeTable.rows[selRow].cells[0].children[0];
            oldInnerTable.rows[0].cells[1].innerHTML = blank;
            innerTable.rows[0].cells[1].innerHTML = arrow;
            selRow = i;
            found = true;
            break;
        }
    }
    
    if (found == false) {
        var oldInnerTable = codeTable.rows[selRow].cells[0].children[0];
        oldInnerTable.rows[0].cells[1].innerHTML = blank;
        innerTable = codeTable.rows[numRows - 1].cells[0].children[0];
        innerTable.rows[0].cells[1].innerHTML = arrow;
        selRow = numRows - 1;
    }
}

//Returns string representing row at specified row index
function rowToString(rowInd) {
    var string = "";
    var innerTable = codeTable.rows[rowInd].cells[0].children[0];
    for (var i = 2; i < innerTable.rows[0].cells.length; i++) {
        string += innerTable.rows[0].cells[i].innerText;
    }
    return string;
}

function incSelRow() {
    selRow++;
}

function decSelRow() {
    selRow--;
}

var lineNums = [];
var charCountStart = [ ];
var charCountEnd = [ ];
var codeStrLen;

function selectLine(start, end, varCount) {
    if (start == -1 && end == -1) {
        returnToNormalColor();
        highlightLine(codeTable.rows.length - 1);

        var innerTable;
        innerTable = codeTable.rows[selRow].cells[0].children[0];
        innerTable.rows[0].cells[1].innerHTML = blank;
        
        innerTable = codeTable.rows[codeTable.rows.length - 1].cells[0].children[0];
        innerTable.rows[0].cells[1].innerHTML = arrow;
        selRow = codeTable.rows.length - 1;
    }
    if (start == 0 && end == codeStrLen) return false;
    
    var rowNum = -1;
    var fallBack = -1;
    var flag = false;
    for (var i = 0; i < charCountStart.length; i++) {
        if (start >= charCountStart[i] && end <= charCountEnd[i]) { rowNum = lineNums[i]; flag = true; break; }
        if (start == charCountStart[i]) fallBack = lineNums[i];
    }
    if (flag == false) return false;
    
    if (start != -1) {
        if (rowNum == -1) rowNum = fallBack;
        if (rowNum == -1) return false;
    }
    else rowNum = codeTable.rows.length - 1;
    
    if (rowNum == selRow) {
        return false;
    }
    
    returnToNormalColor();
    highlightLine(rowNum);
    
    var innerTable;
    innerTable = codeTable.rows[selRow].cells[0].children[0];
    innerTable.rows[0].cells[1].innerHTML = blank;
    
    innerTable = codeTable.rows[rowNum].cells[0].children[0];
    innerTable.rows[0].cells[1].innerHTML = arrow;
    selRow = rowNum;
    
    return true;
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









