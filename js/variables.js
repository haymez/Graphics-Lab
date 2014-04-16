/*
* Contains code for the variable window.
* All variable arrays are declared and 
* the variable window is populated with
* the declared variables
*/

function Variables() {
    //Declare all variables
    var pointVariables = new Array();
    var lineVariables = new Array();
    var circleVariables = new Array();
    var polygonVariables = new Array();
    var distanceVariables = new Array();


    //Print all declared variables into the variables window
    function printVars() {
        var d = "";
        var p = "";
        var l = "";
        var c = "";
        var g = "";
        var total = "";
        
        var point = new Array();
        var line = new Array();
        var circle = new Array();
        var polygon = new Array();
        var distance = new Array();
        
        if(rowToString(0).indexOf("//Variable") >= 0) {
            while(rowToString(0).indexOf("//Program") == -1) {
                editor.deleteRow(0);
            }
            editor.deleteRow(0);
        }
        for(var i = 0; i < distanceVariables.length; i++) {
            if(i != 0) distance[distance.length] = {text:",&nbsp;d" + Number(i+1), type:[]};
            else distance[distance.length] = {text:"d" + Number(i+1), type:[]};
        }
        for(var i = 0; i < pointVariables.length; i++) {
            if(i != 0) point[point.length] = {text:",&nbsp;p" + Number(i+1), type:[]};
            else point[point.length] = {text:"p" + Number(i+1), type:[]};
        }
        for(var i = 0; i < lineVariables.length; i++) {
            if(i != 0) line[line.length] = {text:",&nbsp;l" + Number(i+1), type:[]};
            else line[line.length] = {text:"l" + Number(i+1), type:[]};
        }
        for(var i = 0; i < polygonVariables.length; i++) {
            if(i != 0) polygon[polygon.length] = {text:",&nbsp;p" + Number(i+1), type:[]};
            else polygon[polygon.length] = {text:"p" + Number(i+1), type:[]};
        }
        for(var i = 0; i < circleVariables.length; i++) {
            if(i != 0) circle[circle.length] = {text:",&nbsp;c" + Number(i+1), type:[]};
            else circle[circle.length] = {text:"c" + Number(i+1), type:[]};
        }
        
        editor.addRow(0, [{text:"//Program Code", type:["comment"]}]);
        if(distanceVariables.length > 0) {
            editor.addRow(0, [{text:"Distance&nbsp;", type:["literal"]}].concat(distance));
        }
        if(pointVariables.length > 0) {
            editor.addRow(0, [{text:"Point&nbsp;", type:"literal"}].concat(point));
        }
        if(lineVariables.length > 0) {
            editor.addRow(0, [{text:"Line&nbsp;", type:"literal"}].concat(line));
        }
        if(polygonVariables.length > 0) {
            editor.addRow(0, [{text:"Polygon&nbsp;", type:"literal"}].concat(polygon));
        }
        if(circleVariables.length > 0) {
            editor.addRow(0, [{text:"Circle&nbsp;", type:"literal"}].concat(circle));
        }
        editor.addRow(0, [{text:"//Variable Declarations", type:["comment"]}]); 
    }

    //New Distance variable
    function newDistance() {
        distanceVariables[distanceVariables.length] = 'd' + (distanceVariables.length+1);
        printVars();
    }
}


