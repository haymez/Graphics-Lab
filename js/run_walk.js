/*
 * Controls the Run and Walk features of the Watson Graphcis Lab
 */
//Assign all global variables
var step = 0;
var programRunning = false;
//Allows users to run the program slowly
function run() {
    paintbrush++;
    programRunning = true;
    /*if (step > 0) {
        step = 0;
        returnToNormalColor();
    }*/
    walk();
    var delay = setInterval(function() {
        if (!programRunning) clearInterval(delay);
        else {
            walk();
        }
    }, 100);
}

//Allows users to walk through the program code one step at a time
function walk() {
    paintbrush++;
    programRunning = true;
    //Set some buttons to false while walking or running
    $(".button" + figNum).attr("disabled", true);
    //Turn off toggle events for table cells
    $('.innerTable' + figNum).off('mouseover').off('mouseout').off('click');
    returnToNormalColor();
    if (step == codeTable.rows.length-1) { //Don't allow step to go beyond program
        selectRow(step);
        step = 0;
        toggleEvents();
        $(".button" + figNum).attr("disabled", false);
        programRunning = false;
        return;
    }
    selectRow(step);
    highlightLine(step);
    console.log(rowToString(step));
    step++;
}
