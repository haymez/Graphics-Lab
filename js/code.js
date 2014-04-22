/*
 * This code is for the Watson Graphics Lab editor.
 * Author: James Miltenberger, Jonathan Teel
 * Co-Authors: Bidur Shrestha
 */

function Code(figNum) {
    //Local variables
    var indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    var editor;
    var variables;
    var container = document.getElementById("graphicsLab" + figNum);
    
    //Public functions
    this.drawShape = drawShape;
    this.changeColor = changeColor;
    this.assign = assign;
    this.addNewRow = addNewRow;
    this.erase = erase;
    this.loop = loop;
    this.rowToString = rowToString;
    this.getObjects = getObjects;
    this.getIndent = getIndent;
    this.clickFunc = clickFunc;
    this.insertClickFunc = insertClickFunc;
    

    //Listen for click events on the table
    function clickFunc(cell) {
        cell.stopImmediatePropagation(); //Stop multiple cascading events from being called from the same event.
        
        var cellVal = $(this).text(); //Grab the hovered cell's value
        var colNum = $(this).index(); //Grab the hovered cell's index
        var rowNum = $(this).parent().parent().parent().parent().parent().index(); //Get the row number
        var rowString = rowToString(rowNum);
        var currentElement = $(this);
        
        //~ // we pass rowNum and colNum to tell the function where start highlighting
        //~ if (cellVal.indexOf('=') == -1 && cellVal.indexOf('draw') == -1 && cellVal.indexOf('erase') == -1 && cellVal.indexOf('color') == -1 &&
            //~ cellVal.indexOf('repeat') == -1 && cellVal.indexOf('times') == -1 && cellVal.indexOf('loop') == -1 &&
            //~ cellVal.indexOf('endloop') == -1) {
            //~ //THIS SHOULD BE HANDLED BY API... MAYBE?
            //~ 
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
        //~ }

        //User clicked on line number. Prompt for delete.
        if (colNum == 0 && rowNum != editor.getSelectedRowIndex()) {
            var classes = $(this).parent().children().eq(2).attr("class");
            if(cellVal.trim().length > 0 && cellVal.indexOf(">") == -1
                && classes.indexOf("comment") == -1
                && classes.indexOf("datatype") == -1) {
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
                }, container);
            } else {
                var insertRow = $(this).parent().index();
                editor.selectRowByIndex(insertRow, true);
            }
        }

        //User clicked on variable number. Generate keypad pop up
        else if (isEditableValue(cellVal, rowNum) && rowString.indexOf("VARIABLE") == -1) {
            //updating a distance variable
            if (isDistanceAssign(rowNum)) {
                var distanceVar = rowToString(rowNum).substring(0, rowToString(rowNum).indexOf("=") - 1);
                //find if another instance of this distance variable has occurred already
                if (beenAssigned(distanceVar, rowNum)) {
                    var arr = new Array();
                    arr.push(distanceVar + " + distanceValue");
                    arr.push(distanceVar + " - distanceValue");
                    for (var i = 0; i < variables.getDistVars().length; i++) {
                        if (beenAssigned(variables.getDistVars()[i], rowNum))
                            arr.push(variables.getDistVars()[i]);
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
                                if(evt != null && evt.length > 0) currentElement.html(evt);
                            }, container);
                        }
                    }, container);
                } else {
                    var arr = new Array();
                    for (var i = 0; i < variables.getDistVars().length; i++) {
                        if (beenAssigned(variables.getDistVars()[i], rowNum))
                            arr.push(variables.getDistVars()[i]);
                    }
                    arr.push("constant");
                    if (arr.length > 1) {
                        var selector = new Selector();
                        selector.open("Choice Selection Panel", arr, function (evt) {
                            if (evt.indexOf("constant") >= 0) {
                                var numpad = new NumberPad();
                                numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                                    if(evt != null && evt.length > 0) currentElement.html(evt);
                                }, container);
                            } else {
                                if (evt.length > 0) {
                                    if(evt != null && evt.length > 0) currentElement.html(evt.trim());
                                }
                            }
                        }, container);
                    } else {
                        var numpad = new NumberPad();
                        numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                            if(evt != null && evt.length > 0) currentElement.html(evt);
                        }, container);
                    }
                }

            } else {
                var arr = new Array();
                for (var i = 0; i < variables.getDistVars().length; i++) {
                    if (beenAssigned(variables.getDistVars()[i], rowNum))
                        arr.push(variables.getDistVars()[i]);
                }
                arr.push("constant");
                if (arr.length > 1) {
                    var selector = new Selector();
                    selector.open("Choice Selection Panel", arr, function (evt) {
                        if (evt.length > 0) {
                            if (evt.indexOf("constant") >= 0) {
                                var numpad = new NumberPad();
                                numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                                    if(evt != null && evt.length > 0) currentElement.html(evt);
                                    fixPolygons();
                                }, container);
                            } else {
                                if(evt != null && evt.length > 0) currentElement.html(evt);
                                fixPolygons();
                            }
                        }
                    }, container);
                } else {
                    var numpad = new NumberPad();
                    numpad.open(0, 300, "Numeric Entry Pad", "Enter up to three Digits (0-300)", false, 10, function (evt) {
                        if(evt != null && evt.length > 0) currentElement.html(evt);
                        fixPolygons();
                    }, container);
                }
            }
        }

        //User clicked on something within draw(). Generate list of drawable items
        else if (rowToString(rowNum).indexOf("draw") >= 0 && cellVal.indexOf("draw") == -1 && cellVal.indexOf("(") == -1 &&
            cellVal.indexOf(")") == -1) {
            var arr = getAssignedVars(rowNum);

            if (arr.length > 0) {
                var selector = new Selector();
                selector.open("test title", arr, function (evt) {
                    if (evt != null && evt.length > 0)
                        if(evt != null && evt.length > 0) currentElement.html(evt.trim());
                }, container);
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
            if (arr.length > 0) {
                var selector = new Selector();
                selector.open("test title", arr, function (evt) {
                    if (evt != null && evt.length > 0)
                        if(evt != null && evt.length > 0) currentElement.html(evt.trim());
                }, container);
            } else
                alert("No erasable objects...");
        }

        //User clicked on an item within color(). Generate list of supported colors.
        else if (rowToString(rowNum).indexOf("color") >= 0 && cellVal.indexOf("color") == -1 && cellVal.indexOf("(") == -1 &&
            cellVal.indexOf(")") == -1) {
            var arr = new Array();
            arr.push("red", "blue", "green", "yellow", "orange", "black", "white");
            var selector = new Selector();
            selector.open("Choice Selection Panel", arr, function (evt) {
                if (evt != null && evt.length > 0)
                    if(evt != null && evt.length > 0) currentElement.html(evt.trim());
            }, container);
        }

        //User clicked on the loop counter. (It could already be assigned in which case it wouldn't be labeled "COUNTER")
        //Make sure user isn't clicking 'repeat' or 'times'
        else if (rowToString(rowNum).indexOf("repeat") >= 0 && cellVal.indexOf("repeat") == -1 && cellVal.indexOf("times") == -1 &&
            (!isNaN(Number(cellVal)) || cellVal.indexOf("COUNTER") >= 0)) {
            var numpad = new NumberPad();
            numpad.open(0, 99, "Numeric Entry Pad", "Enter Two Digits", false, 10, function (evt) {
                if(evt != null && evt.length > 0) currentElement.html(evt);
            }, container);
        }

        //User clicked on item 'EXPRESSION'. Generate appropriate alert message
        else if (cellVal.indexOf("EXPRESSION") >= 0) {
            var alert = new Alert();
            alert.open("Error", "When editing assignment\nstatements, Choose the Left\nHand Side varibale before\nattempting to specity the\n" +
                "Right Hand Side expression", true, function(){}, container);
        }

        //User clicked a variable on the left side of an assignment operator
        else if ((colNum == 2 || cellVal.indexOf("VARIABLE") >= 0) && cellVal.indexOf("//") == -1) {
            if (editor.rowToArray(rowNum)[colNum-1].indexOf("=") >= 0) {
                var arr = new Array();
                for (var i = 0; i < variables.getDistVars().length; i++) {
                    arr.push(variables.getDistVars()[i]);
                }
                for (var i = 0; i < variables.getPointVars().length; i++) {
                    arr.push(variables.getPointVars()[i]);
                }
                for (var i = 0; i < variables.getLineVars().length; i++) {
                    arr.push(variables.getLineVars()[i]);
                }
                for (var i = 0; i < variables.getCircleVars().length; i++) {
                    arr.push(variables.getCircleVars()[i]);
                }
                for (var i = 0; i < variables.getPolyVars().length; i++) {
                    arr.push(variables.getPolyVars()[i]);
                }
                if (arr.length > 0) {
                    var selector = new Selector();
                    selector.open("Choice Selection Panel", arr, function (evt) {
                        if (evt != null && evt.length > 0) {
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
                    }, container);
                }
            }
        }
        
        //User clicked on a variable on the right side of an assignment
        else if(colNum > 3 && (cellVal.charAt(0) == "p"
                            || cellVal.charAt(0) == "l"
                            || cellVal.charAt(0) == "c"
                            || cellVal.charAt(0) == "g")) {
            
            var arr = getAssignedVars(rowNum, cellVal.charAt(0));
            arr.push("(X,Y)");
            var selector = new Selector();
            selector.open("Choice Selection Panel", arr, function (evt) {
                if(evt != null && evt.length > 0) {
                    if(evt.charAt(0) == "(") {
                        currentElement.after("\
                                    <td class='cellprogram_code" + figNum + " code openParen'>(</td>\
                                    <td class='cellprogram_code" + figNum + " code'>X</td>\
                                    <td class='cellprogram_code" + figNum + " code'>,</td>\
                                    <td class='cellprogram_code" + figNum + " code'>Y</td>\
                                    <td class='cellprogram_code" + figNum + " code closeParen'>)</td>").remove();
                    }
                }
            }, container);
        }
        
        //User clicked on a comma
        else if(cellVal.indexOf(",") >= 0) {
            var rowArr = editor.rowToArray(rowNum);
            
            //Talk to Mike about how we're going to handle lines
            //~ //if comma has nothing on right: display list of lines
            //~ if($(this).next().text().length == 0) {
                //~ var vars = getAssignedVars(rowNum, "l");
                //~ if(vars.length > 0) {
                    //~ var selector = new Selector();
                    //~ selector.open("Choice Selection Panel", vars, function (evt) {
                        //~ if(evt != null && evt.length > 0) {
                            //~ //Remove td's that need to be removed
                            //~ 
                            //~ currentElement.html(evt.trim());
                        //~ }
                    //~ }, container);
                //~ }
            //~ }
            
            //if comma is between two numbers/distances or an X/Y: display list of points
            if((!isNaN($(this).prev().text())
                    || $(this).prev().text().charAt(0) == "d"
                    || $(this).prev().text().charAt(0) == "X")
                    && (!isNaN($(this).next().text())
                    || $(this).next().text().charAt(0) == "d"
                    || $(this).next().text().charAt(0) == "Y")) {
                var vars = getAssignedVars(rowNum, "p");
                if(vars.length > 0) {
                    var selector = new Selector();
                    selector.open("Choice Selection Panel", vars, function (evt) {
                        if(evt != null && evt.length > 0) {
                            //Remove td's that need to be removed
                            currentElement.next().remove();
                            currentElement.next().remove();
                            currentElement.prev().remove();
                            currentElement.prev().remove();
                            currentElement.html(evt.trim());
                        }
                    }, container);
                } else {
                    var alert = new Alert();
                    alert.open("Program Editor Dialog", "No point variables have\nappeared on the left hand side\nof assignment\
                        statements up to\nthis point in the program, so\nthere are no variables with which\nto replace \
                        this expression", true, function (evt) {}, container);
                }
            }
        }
        
        //User clicked on right paranthesis
        else if(cellVal.indexOf(")") >= 0) {
            //if the item to the left and the item three to the left are numbers/distance or an X/Y: show list of points
            if((!isNaN($(this).prev().text())
            || $(this).prev().text().charAt(0) == "d"
            || $(this).prev().text().charAt(0) == "Y")
            && (!isNaN($(this).prev().prev().prev().text())
            || $(this).prev().prev().prev().text().charAt(0) == "d"
            || $(this).prev().prev().prev().text().charAt(0) == "X")) {
                var vars = getAssignedVars(rowNum, "p");
                if(vars.length > 0) {
                    var selector = new Selector();
                    selector.open("Choice Selection Panel", vars, function (evt) {
                        if(evt != null && evt.length > 0) {
                            //Remove td's that need to be removed
                            currentElement.prev().remove()
                            currentElement.prev().remove()
                            currentElement.prev().remove()
                            currentElement.prev().remove();
                            currentElement.html(evt.trim());
                        }
                    }, container);
                } else {
                    var alert = new Alert();
                    alert.open("Program Editor Dialog", "No point variables have\nappeared on the left hand side\nof assignment\
                        statements up to\nthis point in the program, so\nthere are no variables with which\nto replace \
                        this expression", true, function (evt) {}, container);
                }
            }
            
            //if this is a line assignment and there is another right paren directly to the left: show list of lines
            //Talk to Mike about this
        }
        
        //User clicked on left paranthesis
        else if(cellVal.indexOf("(") >= 0) {
            //if the item to the right and the item three to the right are numbers/distance or an X/Y: show list of points
            if((!isNaN($(this).next().text())
            || $(this).next().text().charAt(0) == "d"
            || $(this).next().text().charAt(0) == "Y")
            && (!isNaN($(this).next().next().next().text())
            || $(this).next().next().next().text().charAt(0) == "d"
            || $(this).next().next().next().text().charAt(0) == "X")) {
                var vars = getAssignedVars(rowNum, "p");
                if(vars.length > 0) {
                    var selector = new Selector();
                    selector.open("Choice Selection Panel", vars, function (evt) {
                        if(evt != null && evt.length > 0) {
                            //Remove td's that need to be removed
                            currentElement.next().remove()
                            currentElement.next().remove()
                            currentElement.next().remove()
                            currentElement.next().remove();
                            currentElement.html(evt.trim());
                        }
                    }, container);
                } else {
                    var alert = new Alert();
                    alert.open("Program Editor Dialog", "No point variables have\nappeared on the left hand side\nof assignment\
                        statements up to\nthis point in the program, so\nthere are no variables with which\nto replace \
                        this expression", true, function (evt) {}, container);
                }
            }
            
            //if this is a line assignment and there is another left paren directly to the right: show list of lines
            //Talk to Mike about this
        }
    }

    //
    function insertClickFunc(cell) {
        cell.stopImmediatePropagation(); //Prevent multiple events being thrown from the same event
        var insertRow = $(this).parent().index()+1;
        var rowString = rowToString(insertRow-1);
        
        if((insertRow < editor.getSelectedRowIndex() || insertRow > editor.getSelectedRowIndex()+1)
            && rowString.indexOf("repeat") == -1
            && rowString.indexOf("//Variable") == -1
            && rowString.indexOf("Distance") == -1
            && rowString.indexOf("Point") == -1
            && rowString.indexOf("Line") == -1
            && rowString.indexOf("Circle") == -1
            && rowString.indexOf("Polygon") == -1) {
            editor.moveInsertionBarCursor(insertRow-1);
        }
        //~ editor.moveInsertionBarCursor(insertRow-1);
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
        if (((!isNaN(Number(cellVal) && rowString.indexOf("repeat") == -1)) 
            || (cellVal.indexOf('distanceValue') >= 0 
            && cellVal.indexOf("EXPRESSION") == -1 
            || cellVal.indexOf("Y") >= 0 
            || cellVal.indexOf("X") >= 0 
            || cellVal.indexOf("RADIUS") >= 0))
            && cellVal.trim().length > 0)
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
                editor.deleteRow(startDel);
                startDel--;
                deleteNum++;
            }
            if (selRow < rowNum && selRow > ((editor.getRowCount() - 1) - deleteNum)) {
                selRow = startDel;
                moveToLine(selRow + 1);
            } else if (selRow > rowNum) {
                editor.deleteRow(startDel);
                selRow -= deleteNum;
            } else
                editor.deleteRow(startDel);
        } else if (type.indexOf("loop") >= 0 || type.indexOf("repeat") >= 0) {
            var repeat = 1;
            var deleteNum = 1;
            var startDel = rowNum;
            if (type.indexOf("loop") >= 0) startDel--;
            while (repeat > 0) {
                var rowString = rowToString(startDel + 1);
                if (rowString.indexOf("repeat") >= 0) repeat++;
                else if (rowString.indexOf("endloop") >= 0) repeat--;
                editor.deleteRow(startDel);
                deleteNum++;
            }
            if (selRow > startDel && selRow < startDel + deleteNum) {
                selRow = startDel;
                moveToLine(selRow + 1);
            } else if (selRow > startDel) {
                editor.deleteRow(startDel);
                selRow -= deleteNum;
            } else {
                editor.deleteRow(startDel);
            }
        }
    }

    //Makes the last row in polygon equal to first row
    function fixPolygons() {
        var x = 0;
        var y = 0;
        for (var i = 0; i < editor.getRowCount() - 1; i++) {
            var rowString = rowToString(i);
            if (rowString.indexOf("g") < rowString.indexOf("=") && rowString.indexOf("g") >= 0) {
                x = rowString.substring(rowString.indexOf("(") + 2, rowString.indexOf(","));
                y = rowString.substring(rowString.indexOf(",") + 1, rowString.indexOf(")"));
            } else if (rowString.indexOf("))") >= 0 && rowString.indexOf("((") == -1) {
                editor.deleteRow(i);
                addNewRow(i, [getIndent(i) + indent + "(", x, ",", y, ")", ")"]);
            }
        }
    }

    //deletes all rows of a polygon
    function deletePolygon(rowNum) {
        editor.deleteRow(rowNum);
        while (rowToString(rowNum).charAt(0) == '(') {
            editor.deleteRow(rowNum);
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
    
    //Returns array of variables of a specific type that have been assigned.
    //If no type is given, it will give a list of all drawable items.
    function getAssignedVars(row, type) {
        var arr = new Array();
        for(var i = 0; i < row; i++) {
            if(rowToString(i).indexOf("=") >= 0 && rowToString(i).indexOf("VARIABLE") == -1 && !isDistanceAssign(row)) {
                var variable = rowToString(i).substring(0, rowToString(i).indexOf("="));
                if(variable.length > 0 && $.inArray(variable, arr) == -1) {
                    if(type != undefined) {
                        if(variable.charAt(0) == type) arr.push(variable);
                    }
                    
                    //This will yeild a list of all drawable items
                    else {
                        if(variable.charAt(0) != 'd') arr.push(variable);
                    }
                }
            }
        }
        return arr;
    }
    
    //get objects
    function getObjects(editorObj, variablesObj) {
        editor = editorObj;
        variables = variablesObj;
    }

    $(document).ready(function() {
        if(figNum >= 0) {
            $("#program_buttons"+figNum).hide();
            $("#var_buttons"+figNum).hide();
            $("#drawOffsetDiv"+figNum).width(80);
            
            switch(figNum) {
                //Figure 6.10
                case 0:
                    $("#circleButton"+figNum).trigger("click");
                    addNewRow(editor.getSelectedRowIndex(), ["c1", "&nbsp;=&nbsp;", "(", "(", "150", ",", "150", ")", ",", "50", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["draw", "(", "c1", ")"]);
                    break;
                //Figure 6.12
                case 1:
                    $("#distanceButton"+figNum).trigger("click");
                    $("#distanceButton"+figNum).trigger("click");
                    $("#pointButton"+figNum).trigger("click");
                    $("#pointButton"+figNum).trigger("click");
                    $("#pointButton"+figNum).trigger("click");
                    $("#pointButton"+figNum).trigger("click");
                    $("#lineButton"+figNum).trigger("click");
                    $("#lineButton"+figNum).trigger("click");
                    $("#polygonButton"+figNum).trigger("click");
                    addNewRow(editor.getSelectedRowIndex(), ["d1", "&nbsp;=&nbsp;", "100"]);
                    addNewRow(editor.getSelectedRowIndex(), ["d2", "&nbsp;=&nbsp;", "200"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p1", "&nbsp;=&nbsp;", "(", "d1", ",", "d1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p2", "&nbsp;=&nbsp;", "(", "d2", ",", "d1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p3", "&nbsp;=&nbsp;", "(", "d2", ",", "d2", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p3", "&nbsp;=&nbsp;", "(", "d2", ",", "d2", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p4", "&nbsp;=&nbsp;", "(", "d1", ",", "d2", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["l1", "&nbsp;=&nbsp;", "(", "p1", ",", "p3", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["l2", "&nbsp;=&nbsp;", "(", "p2", ",", "p4", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["g1", "&nbsp;=&nbsp;", "(", "p1", ")", ","]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"(", "(", "p2", ")", ","]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"(", "(", "p3", ")", ","]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"(", "(", "p4", ")", ","]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"(", "(", "p1", ")", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["draw", "(", "l1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["draw", "(", "l2", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["draw", "(", "g1", ")"]);
                    break;
                //Figure 6.14
                case 2:
                    $("#distanceButton"+figNum).trigger("click");
                    $("#pointButton"+figNum).trigger("click");
                    $("#circleButton"+figNum).trigger("click");
                    addNewRow(editor.getSelectedRowIndex(), ["color", "(", "blue", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["d1", "&nbsp;=&nbsp;", "50"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p1", "&nbsp;=&nbsp;", "(", "150", ",", "150", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["repeat&nbsp;", "10", "&nbsp;times"]);
                    addNewRow(editor.getSelectedRowIndex(), ["loop"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"c1", "&nbsp;=&nbsp;", "(", "p1", ",", "d1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"draw", "(", "c1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"d1", "&nbsp;=&nbsp;", "d1", "&nbsp;+&nbsp;", "10"]);
                    addNewRow(editor.getSelectedRowIndex(), ["endloop"]);
                    break;
                //Figure 6.15
                case 3:
                    $("#distanceButton"+figNum).trigger("click");
                    $("#circleButton"+figNum).trigger("click");
                    addNewRow(editor.getSelectedRowIndex(), ["color", "(", "blue", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["d1", "&nbsp;=&nbsp;", "50"]);
                    addNewRow(editor.getSelectedRowIndex(), ["repeat&nbsp;", "10", "&nbsp;times"]);
                    addNewRow(editor.getSelectedRowIndex(), ["loop"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"c1", "&nbsp;=&nbsp;", "(", "150", ",", "150", ")", ",", "d1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"draw", "(", "c1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"d1", "&nbsp;=&nbsp;", "d1", "&nbsp;+&nbsp;", "10"]);
                    addNewRow(editor.getSelectedRowIndex(), ["endloop"]);
                    break;
                //Figure 6.16
                case 4:
                    $("#distanceButton"+figNum).trigger("click");
                    $("#pointButton"+figNum).trigger("click");
                    $("#circleButton"+figNum).trigger("click");
                    addNewRow(editor.getSelectedRowIndex(), ["color", "(", "blue", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["d1", "&nbsp;=&nbsp;", "50"]);
                    addNewRow(editor.getSelectedRowIndex(), ["p1", "&nbsp;=&nbsp;", "(", "150", ",", "150", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["repeat&nbsp;", "10", "&nbsp;times"]);
                    addNewRow(editor.getSelectedRowIndex(), ["loop"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"c1", "&nbsp;=&nbsp;", "(", "p1", ",", "d1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"draw", "(", "c1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"d1", "&nbsp;=&nbsp;", "d1", "&nbsp;+&nbsp;", "10"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"erase", "(", "c1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["endloop"]);
                    break;
                //Figure 6.17
                case 5:
                    $("#distanceButton"+figNum).trigger("click");
                    $("#lineButton"+figNum).trigger("click");
                    addNewRow(editor.getSelectedRowIndex(), ["color", "(", "blue", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["d1", "&nbsp;=&nbsp;", "250"]);
                    addNewRow(editor.getSelectedRowIndex(), ["repeat&nbsp;", "20", "&nbsp;times"]);
                    addNewRow(editor.getSelectedRowIndex(), ["loop"]);
                    addNewRow(editor.getSelectedRowIndex(), ["l1", "&nbsp;=&nbsp;", "(", "(", "50", ",", "d1", ")", ",", "(", "250", ",", "d1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"draw", "(", "l1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"d1", "&nbsp;=&nbsp;", "d1", "&nbsp;-&nbsp;", "10"]);
                    addNewRow(editor.getSelectedRowIndex(), [indent+"erase", "(", "l1", ")"]);
                    addNewRow(editor.getSelectedRowIndex(), ["endloop"]);
                    break;
            }
        } else {
            //This is Sandbox mode, set up listeners for editor
            editor.setCellClickListener(clickFunc); //Set click listener for editor
            editor.setInsertBarMouseEnterListener(insertClickFunc); //Listener for insertion area
            
        }
    });
}







