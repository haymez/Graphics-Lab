/*
 * Controls the Run and Walk features of the Watson Graphcis Lab
 */
//Assign all global variables
var step = 0;
var programRunning = false;
var fresh = true;
//Allows users to run the program slowly
function run() {
    paintbrush++;
    walk();
    var delay = setInterval(function() {
        if (!programRunning) clearInterval(delay);
        else {
            walk();
        }
    }, 100);
    //Reset
    $("#" + walkButton.id).html("Reset").off("click").click(function() {
        clearInterval(delay);
        step = 0;
        returnToNormalColor()
        selectRow(codeTable.rows.length-1);
        $("#" + runButton.id).html("Run").off("click").click(function() { run(); });
        $(this).html("Walk").off("click").click(function() { walk(); });
        $(".button" + figNum).attr("disabled", false);
    });
    //Pause
    $("#" + runButton.id).html("Pause").off("click").click(function() {
        clearInterval(delay);
        $(this).html("Play").off("click").click(function() { run(); });
        $("#" + walkButton.id).html("Walk").off("click").click(function() { walk(); });
    });
}

//Allows users to walk through the program code one step at a time
function walk() {
    paintbrush++;
    var oldPos = -1;
    if (!programRunning) {
        //check if selected row is before end of code
        if (selRow < codeTable.rows.length-1)
            codeTable.deleteRow(selRow);
    }
    programRunning = true;
    //Set some buttons to false while walking or running
    $(".button" + figNum).attr("disabled", true);
    //Turn off toggle events for table cells
    $('.innerTable' + figNum).off('mouseover').off('mouseout').off('click');
    returnToNormalColor();
    //Don't allow step to go beyond program scope
    if (step == codeTable.rows.length-1) {
        selectRow(step);
        step = 0;
        toggleEvents();
        $("#" + runButton.id).html("Run").off("click").click(function() { run(); });
        $("#" + walkButton.id).html("Walk").off("click").click(function() { walk(); });
        $(".button" + figNum).attr("disabled", false);
        programRunning = false;
        fresh = true;
        return;
    }
    selectRow(step);
    highlightLine(step);
    clear();
    draw();
    $("#drawCanvas" + figNum).trigger("mousemove");
    interpret(rowToString(step));
    $("#drawCanvas" + figNum).trigger("mousemove");
    step++;
}
