/*
 * This code is for the Watson Graphics Lab editor.
 * Author: James Miltenberger, Jonathan Teel
 * Co-Authors: Bidur Shrestha
 */
var indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

//Listen for click events on the table
function clickFunc(cell) {
    console.log(cell);
    var cellVal = cell.target.textContent; //Grab the hovered cell's value
    var colNum = cell.currentTarget.cellIndex; //Grab the hovered cell's index
    var rowNum = Number(cell.currentTarget.parentElement.textContent.replace(/\s/g, "").substring(0,1))-1; //Get the row number
    var rowString = rowToString(rowNum);

    // we pass rowNum and colNum to tell the function where start highlighting
    if (cellVal.indexOf('=') == -1 && cellVal.indexOf('draw') == -1 && cellVal.indexOf('erase') == -1 && cellVal.indexOf('color') == -1 &&
        cellVal.indexOf('repeat') == -1 && cellVal.indexOf('times') == -1 && cellVal.indexOf('loop') == -1 &&
        cellVal.indexOf('endloop') == -1) {
        
        //THIS SHOULD BE HANDLED BY API... MAYBE?
        
        //~ if (cellVal.indexOf("(") == -1 && cellVal.indexOf(")") == -1) {
            //~ if (colNum == 0) {
                //~ if (rowString.indexOf("repeat") >= 0)
                //~ highlightLoop("repeat", rowNum);
                //~ else if (rowString.indexOf("loop") >= 0 && rowString.indexOf("endloop") == -1)
                //~ highlightLoop("loop", rowNum);
                //~ else if (rowString.indexOf("endloop") >= 0)
                //~ highlightLoop("endloop", rowNum);
                //~ highlightLine(rowNum);
//~ 
                //~ //Highlight every line of polygon
                //~ if (rowToString(rowNum).charAt(0) == 'g')
                //~ while (rowToString(++rowNum).charAt(0) == '(') highlightLine(rowNum);
            //~ }
        //~ }
    }

    //User clicked on line number. Prompt for delete.
    if (colNum == 0 && rowNum != editor.getSelectedRowIndex() && cellVal.trim().length > 0) {
        var alert = new Alert();
        alert.open("Warning", "Are you sure you want to delete the text?", false, function (evt) {
            if (evt) {
                if (rowString.indexOf("repeat") >= 0) {
                    deleteLoop("repeat", rowNum);
                } else if (rowString.indexOf("endloop") >= 0) {
                    deleteLoop("endloop", rowNum);
                } else if (rowString.indexOf("loop") >= 0) {
                    deleteLoop("loop", rowNum);
                } else if (rowString.charAt(0) == 'g') {
                    deletePolygon(rowNum);
                } else {
                    if (!(rowToString(rowNum).charAt(0) == '(' && rowToString(rowNum + 1).charAt(0) != '(')) {
                        editor.deleteRow(rowNum);
                    }
                }
            } else
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
            if (beenAssigned(distanceVar, rowNum)) {
                var arr = new Array();
                arr.push(distanceVar + " + distanceValue");
                arr.push(distanceVar + " - distanceValue");
                for (var i = 0; i < distanceVariables.length; i++) {
                    if (beenAssigned(distanceVariables[i], rowNum))
                        arr.push(distanceVariables[i]);
                }
                arr.push("constant");
                var selector = new Selector();
                selector.open("Choice Selection Panel", arr, function (evt) {
                    if (evt.indexOf("+") >= 0) {
                        var currRow = rowNum;
                        editor.deleteRow(currRow);
                        addNewRow(currRow, [getIndent(currRow) + distanceVar, "&nbsp;=&nbsp;", distanceVar, "&nbsp;+&nbsp;", "X"]);
                    } else if (evt.indexOf("-") >= 0) {
                        var currRow = rowNum;
                        editor.deleteRow(currRow);
                        addNewRow(currRow, [getIndent(currRow) + distanceVar, "&nbsp;=&nbsp;", distanceVar, "&nbsp;-&nbsp;", "X"]);
                    } else if (evt.indexOf("constant") >= 0) {
                        var numpad = new NumberPad();
                        numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                            currentElement.html(evt);
                        });
                    }
                });
            } else {
                var arr = new Array();
                for (var i = 0; i < distanceVariables.length; i++) {
                    if (beenAssigned(distanceVariables[i], rowNum))
                        arr.push(distanceVariables[i]);
                }
                arr.push("constant");
                if (arr.length > 1) {
                    var selector = new Selector();
                    selector.open("Choice Selection Panel", arr, function (evt) {
                        if (evt.indexOf("constant") >= 0) {
                            var numpad = new NumberPad();
                            numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                                currentElement.html(evt);
                            });
                        } else {
                            if (evt.length > 0) {
                                currentElement.html(evt);
                            }
                        }
                    });
                } else {
                    var numpad = new NumberPad();
                    numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                        currentElement.html(evt);
                    });
                }
            }

        } else {
            var arr = new Array();
            for (var i = 0; i < distanceVariables.length; i++) {
                if (beenAssigned(distanceVariables[i], rowNum))
                    arr.push(distanceVariables[i]);
            }
            arr.push("constant");
            if (arr.length > 1) {
                var selector = new Selector();
                selector.open("Choice Selection Panel", arr, function (evt) {
                    if (evt.length > 0) {
                        if (evt.indexOf("constant") >= 0) {
                            var numpad = new NumberPad();
                            numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                                currentElement.html(evt);
                                fixPolygons();
                            });
                        } else {
                            currentElement.html(evt);
                            fixPolygons();
                        }
                    }
                });
            } else {
                var numpad = new NumberPad();
                numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
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
                    if (variable.charAt(0) != 'd')
                        arr.push(variable);
            }
        }
        var currentElement = $(this);
        if (arr.length > 0) {
            var selector = new Selector();
            selector.open("test title", arr, function (evt) {
                if (evt.length > 0)
                    currentElement.html(evt);
            });
        } else
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
            selector.open("test title", arr, function (evt) {
                if (evt.length > 0)
                    currentElement.html(evt);
            });
        } else
            alert("No erasable objects...");
    }

    //User clicked on an item within color(). Generate list of supported colors.
    else if (rowToString(rowNum).indexOf("color") >= 0 && cellVal.indexOf("color") == -1 && cellVal.indexOf("(") == -1 &&
        cellVal.indexOf(")") == -1) {
        var arr = new Array();
        var currentElement = $(this);
        arr.push("red", "blue", "green", "yellow", "orange", "black", "white");
        var selector = new Selector();
        selector.open("Choice Selection Panel", arr, function (evt) {
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
        numpad.open(0, 99, "Numeric Entry Pad", "Enter Two Digits", false, 10, function (evt) {
            currentElement.html(evt);
        });
    }

    //User clicked on item 'EXPRESSION'. Generate appropriate alert message
    else if (cellVal.indexOf("EXPRESSION") >= 0) {
        alert("When editing assignment\nstatements, Choose the Left\nHand Side varibale before\nattempting to specity the\n" +
            "Right Hand Side expression");
    }

    //User clicked a variable on the left side of an assignment operator
    else if (colNum < editor.rowToArray(rowNum).length - 1) {
        if (editor.rowToArray(rowNum)[colNum-1].indexOf("=") >= 0) {
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
                selector.open("Choice Selection Panel", arr, function (evt) {
                    if (evt.length > 0) {
                        // if old variable was polygon , delete all its lines
                        if (rowToString(rowNum).charAt(0) == 'g') deletePolygon(rowNum + 1);
                        var currRow = rowNum;
                        if (evt.indexOf("d") >= 0 && evt.indexOf("+") == -1 && evt.indexOf("-") == -1) {
                            editor.deleteRow(currRow);
                            addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "distanceValue"]);
                        } else if (evt.indexOf("p") >= 0) {
                            editor.deleteRow(currRow);
                            addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "X", ",", "Y", ")"]);
                        } else if (evt.indexOf("l") >= 0) {
                            editor.deleteRow(currRow);
                            addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "(", "X", ",", "Y", ")", ",", "(", "X", ",", "Y", ")", ")"]);
                        } else if (evt.indexOf("g") >= 0) {
                            editor.deleteRow(currRow);
                            addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "(", "X", ",", "Y", ")", ","]);
                            addNewRow(currRow + 1, [getIndent(rowNum) + indent + "(", "X", ",", "Y", ")", ","]);
                            addNewRow(currRow + 2, [getIndent(rowNum) + indent + "(", "X", ",", "Y", ")", ","]);
                            addNewRow(currRow + 3, [getIndent(rowNum) + indent + "(", "X", ",", "Y", ")", ","]);
                            addNewRow(currRow + 4, [getIndent(rowNum) + indent + "(", "X", ",", "Y", ")", ")"]);
                        } else if (evt.indexOf("c") >= 0) {
                            editor.deleteRow(currRow);
                            addNewRow(currRow, [getIndent(rowNum) + evt, "&nbsp;=&nbsp;", "(", "X", ",", "Y", ",", "RADIUS", ")"]);
                        }
                    }
                });
            }
        }
    }
}

//
function insertClickFunc(cell) {
    
    //~ var insertRow = $(this).parent().index();
    //~ if ((insertRow < editor.getRowCount() - 2 || editor.getSelectedRowIndex() != editor.getRowCount() - 1) &&
        //~ insertRow + 1 < editor.getRowCount() && rowToString(insertRow + 1) != "loop") {
        //~ if (insertRow + 1 != editor.getSelectedRowIndex()) {
            //~ editor.selectRowByIndex(insertRow + 1);
        //~ }
    //~ }
}

function addNewRow(index, arr) {
    var objects = new Array();
    for (var i = 0; i < arr.length; i++) {
        var text = arr[i];
        objects[objects.length] = {
            text: arr[i],
            type: []
        };
        if (isNaN(text)) {
            if (isKeyWord(text)) objects[objects.length - 1].type.push("keyword");
            if (text.indexOf("(") >= 0) objects[objects.length - 1].type.push("openParen");
            if (text.indexOf(")") >= 0) objects[objects.length - 1].type.push("closeParen");
        }
    }
    editor.addRow(index, objects);
}

//Finds if text is a keyword in the watson graphics language
function isKeyWord(text) {
    if (text.indexOf("draw") >= 0) return true;
    if (text.indexOf("erase") >= 0) return true;
    if (text.indexOf("color") >= 0) return true;
    if (text.indexOf("repeat") >= 0) return true;
    if (text.indexOf("times") >= 0) return true;
    if (text.indexOf("loop") >= 0) return true;
    if (text.indexOf("endloop") >= 0) return true;
    return false;
}

//Returns string representation of the row at specified row index
function rowToString(rowInd) {
    var string = "";
    var arr = editor.rowToArray(rowInd);
    for (var i = 0; i < arr.length; i++) {
        string += arr[i];
    }
    return string.trim();
}

//Allows user to assign values to a declared variable
function assign() {
    addNewRow(editor.getSelectedRowIndex(), [getIndent(editor.getSelectedRowIndex()) + "VARIABLE", "&nbsp;=&nbsp;", "EXPRESSION"]);
}

//Allows user to choose a shape to draw
function drawShape() {
    addNewRow(editor.getSelectedRowIndex(), [getIndent(editor.getSelectedRowIndex()) + "draw", "(", "OBJECT", ")"]);
}

//Erases a shape
function erase() {
    addNewRow(editor.getSelectedRowIndex(), [getIndent(editor.getSelectedRowIndex()) + "erase", "(", "OBJECT", ")"]);
}

//Allow users to change the color of shapes
function changeColor() {
    addNewRow(editor.getSelectedRowIndex(), [getIndent(editor.getSelectedRowIndex()) + "color", "(", "COLOR_NAME", ")"]);
}

//Creates a loop in program window
function loop() {
    var thisIndent = getIndent(editor.getSelectedRowIndex());
    addNewRow(editor.getSelectedRowIndex(), [thisIndent + "repeat&nbsp;", "COUNTER", "&nbsp;times"]);
    addNewRow(editor.getSelectedRowIndex(), [thisIndent + "loop"]);
    addNewRow(editor.getSelectedRowIndex(), [thisIndent + "endloop"]);
}

/* ************Code parsing functions************ */

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
        if (string.indexOf(variable) < string.indexOf("=") && string.indexOf(variable) >= 0)
            return true;
    }
    return false;
}

//This function checks to see if the user clicked on a variable value (X/Y/RADIUS/any number between 0-300). Can't be a line number.
function isEditableValue(cellVal, row) {
    var rowString = rowToString(row);
    if ((!isNaN(Number(cellVal) && rowString.indexOf("repeat") == -1)) || (cellVal.indexOf('distanceValue') >= 0 &&
        cellVal.indexOf("EXPRESSION") == -1 || cellVal.indexOf("Y") >= 0 || cellVal.indexOf("X") >= 0 || cellVal.indexOf("RADIUS") >= 0))
        return true;
    else
        return false;
}


//delete loop
function deleteLoop(type, rowNum) {
    if (type.indexOf("endloop") >= 0) {
        var endloop = 1;
        var deleteNum = 1;
        var startDel = rowNum;

        while (endloop > 0) {
            var rowString = rowToString(startDel - 1);
            if (rowString.indexOf("endloop") >= 0) endloop++;
            else if (rowString.indexOf("repeat") >= 0) endloop--;
            codeTable.deleteRow(startDel);
            startDel--;
            deleteNum++;
        }
        if (selRow < rowNum && selRow > ((codeTable.rows.length - 1) - deleteNum)) {
            selRow = startDel;
            moveToLine(selRow + 1);
        } else if (selRow > rowNum) {
            codeTable.deleteRow(startDel);
            selRow -= deleteNum;
        } else
            codeTable.deleteRow(startDel);
    } else if (type.indexOf("loop") >= 0 || type.indexOf("repeat") >= 0) {
        var repeat = 1;
        var deleteNum = 1;
        var startDel = rowNum;
        if (type.indexOf("loop") >= 0) startDel--;
        while (repeat > 0) {
            var rowString = rowToString(startDel + 1);
            if (rowString.indexOf("repeat") >= 0) repeat++;
            else if (rowString.indexOf("endloop") >= 0) repeat--;
            codeTable.deleteRow(startDel);
            deleteNum++;
        }
        if (selRow > startDel && selRow < startDel + deleteNum) {
            selRow = startDel;
            moveToLine(selRow + 1);
        } else if (selRow > startDel) {
            codeTable.deleteRow(startDel);
            selRow -= deleteNum;
        } else {
            codeTable.deleteRow(startDel);
        }
    }
}

//Makes the last row in polygon equal to first row
function fixPolygons() {
    var x = 0;
    var y = 0;
    for (var i = 0; i < codeTable.rows.length - 1; i++) {
        var rowString = rowToString(i);
        if (rowString.indexOf("g") < rowString.indexOf("=") && rowString.indexOf("g") >= 0) {
            x = rowString.substring(rowString.indexOf("(") + 2, rowString.indexOf(","));
            y = rowString.substring(rowString.indexOf(",") + 1, rowString.indexOf(")"));
        } else if (rowString.indexOf("))") >= 0 && rowString.indexOf("((") == -1) {
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
    while (rowToString(rowNum).charAt(0) == '(') {
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
