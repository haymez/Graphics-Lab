/*
 * Adds elements such as buttons, canvas', and divs
 */

function AddElements(figNum) {
    //local variables
    var variables;
    var canvas;
    var code;
    var run_walk;
    
    //public functions
    this.getObjects = getObjects;
    
    //Find the container element
    var container = document.getElementById("graphicsLab" + figNum);
    container.style.width = "650px";

    //Drawing window <div>
    var drawDiv = document.createElement('div');
    drawDiv.id = "draw_window" + figNum;
    drawDiv.style.width = "300px";
    drawDiv.style.height = "350px";
    drawDiv.style.cssFloat = "left";

    //Center drawing canvas
    var drawOffsetDiv = document.createElement('div');
    drawOffsetDiv.id = "drawOffsetDiv" + figNum;
    drawOffsetDiv.style.width = "160px";
    drawOffsetDiv.style.height = "20px";
    drawOffsetDiv.style.cssFloat = "left";

    //Program window <div>
    var programWindowDiv = document.createElement('div');
    programWindowDiv.id = "program_window" + figNum;
    programWindowDiv.style.width = "600px";
    programWindowDiv.style.height = "200px";
    programWindowDiv.style.cssFloat = "left";

    //program Code window
    var programDiv = document.createElement('div');
    programDiv.id = "program_code" + figNum;
    programDiv.style.width = "460px";
    programDiv.style.height = programWindowDiv.style.height;
    //programDiv.style.border = "1px solid";
    //programDiv.style.overflow = "auto";
    programDiv.style.cssFloat = "left";


    //<div> for run and walk buttons
    var run_walkDiv = document.createElement('div');
    run_walkDiv.id = "run_walk" + figNum;
    run_walkDiv.style.width = "220px";
    run_walkDiv.style.cssFloat = "right";
    run_walkDiv.className = "btn-group";

    //<p> for variable value title
    var varValueTitle = document.createElement('p');
    varValueTitle.id = "varValOuterP" + figNum;
    varValueTitle.innerHTML = '<b>&nbspInternal Variables</b>';
    varValueTitle.style.position = "relative";
    varValueTitle.style.top = "15px";

    //<div> for variable value window
    var varValueDiv = document.createElement('div');
    varValueDiv.id = "varValDiv" + figNum;
    varValueDiv.style.overflow = "auto";
    varValueDiv.style.width = container.style.width;
    varValueDiv.style.height = "100px";
    varValueDiv.style.resize = "none";
    varValueDiv.style.border = "1px solid #000";

    // <div> holder for varValueDiv <div> and varValueTitle <p>
    var vvDivHolder = document.createElement('div');
    vvDivHolder.id ="vvDivHolder" + figNum;
    vvDivHolder.appendChild(varValueTitle);
    vvDivHolder.appendChild(varValueDiv);
    vvDivHolder.style.display = "none";
    vvDivHolder.style.cssFloat = "left";
    //vvDivHolder.style.position = "absolute";
    //vvDivHolder.style.top = "410px";

    //<div> for buttons on right
    var progButtonDiv = document.createElement('div');
    progButtonDiv.id = "program_buttons" + figNum;
    progButtonDiv.style.cssFloat = "right";
    progButtonDiv.className = "btn-group-vertical";

    //<div> for buttons on left
    var varButtonDiv = document.createElement('div');
    varButtonDiv.id = "var_buttons" + figNum;
    varButtonDiv.style.cssFloat = "left";
    varButtonDiv.className = "btn-group-vertical";

    //<canvas> element for drawing window
    var canvas = document.createElement('canvas');
    canvas.id = "drawcanvas" + figNum;
    canvas.width = "300";
    canvas.height = "300";
    canvas.style.border = "1px solid";

    //All <button> elements
    var runButton = document.createElement('button');
    runButton.id = "runButton" + figNum;
    runButton.style.width = "70px";
    runButton.innerHTML = "Run";
    runButton.className = "btn btn-default btn-sm";

    var walkButton = document.createElement('button');
    walkButton.id = "walkButton" + figNum;
    walkButton.style.width = "70px";
    walkButton.innerHTML = "Walk";
    walkButton.className = "btn btn-default btn-sm";
    
    var distanceButton = document.createElement('button');
    distanceButton.id = "distanceButton" + figNum;
    distanceButton.style.width = "70px";
    distanceButton.onclick = function() {variables.newDistance();};
    distanceButton.innerHTML = "Distance";
    distanceButton.className = "btn btn-primary btn-sm";

    var pointButton = document.createElement('button');
    pointButton.id = "pointButton" + figNum;
    pointButton.style.width = "70px";
    pointButton.onclick = function() {canvas.drawPoint();};
    pointButton.innerHTML = "Point";
    pointButton.className = "btn btn-primary btn-sm";

    var lineButton = document.createElement('button');
    lineButton.id = "lineButton" + figNum;
    lineButton.style.width = "70px";
    lineButton.onclick = function() {canvas.drawLine();};
    lineButton.innerHTML = "Line";
    lineButton.className = "btn btn-primary btn-sm";

    var polygonButton = document.createElement('button');
    polygonButton.id = "polygonButton" + figNum;
    polygonButton.style.width = "70px";
    polygonButton.onclick = function() {canvas.drawPolygon();};
    polygonButton.innerHTML = "Polygon";
    polygonButton.className = "btn btn-primary btn-sm";

    var circleButton = document.createElement('button');
    circleButton.id = "circleButton" + figNum;
    circleButton.style.width = "70px";
    circleButton.onclick = function() {canvas.drawCircle();};
    circleButton.innerHTML = "Circle";
    circleButton.className = "btn btn-primary btn-sm";

    var assignButton = document.createElement('button');
    assignButton.id = "assignButton" + figNum;
    assignButton.style.width = "70px";
    assignButton.onclick = function() {code.assign();};
    assignButton.innerHTML = "Assign";
    assignButton.className = "btn btn-success btn-sm";

    var drawButton = document.createElement('button');
    drawButton.id = "drawButton" + figNum;
    drawButton.style.width = "70px";
    drawButton.onclick = function() {code.drawShape();};
    drawButton.innerHTML = "Draw";
    drawButton.className = "btn btn-success btn-sm";

    var eraseButton = document.createElement('button');
    eraseButton.id = "eraseButton" + figNum;
    eraseButton.style.width = "70px";
    eraseButton.onclick = function() {code.erase();};
    eraseButton.innerHTML = "Erase";
    eraseButton.className = "btn btn-success btn-sm";

    var colorButton = document.createElement('button');
    colorButton.id = "colorButton" + figNum;
    colorButton.style.width = "70px";
    colorButton.onclick = function() {code.changeColor();};
    colorButton.innerHTML = "Color";
    colorButton.className = "btn btn-success btn-sm";

    var loopButton = document.createElement('button');
    loopButton.id = "loopButton" + figNum;
    loopButton.style.width = "70px";
    loopButton.onclick = function() {code.loop();};
    loopButton.innerHTML = "Loop";
    loopButton.className = "btn btn-success btn-sm";

    //Define window label
    var drawLabel = "Drawing Window";
    var varLabel = "Variable Declarations";
    var progLabel = "Program Code";

    //Add everything to Drawing Window <div>
    run_walkDiv.appendChild(runButton);
    run_walkDiv.appendChild(walkButton);
    drawDiv.appendChild(run_walkDiv);
    drawDiv.appendChild(canvas);

    //Add everything to the Program Code <div>
    varButtonDiv.appendChild(distanceButton);
    varButtonDiv.appendChild(pointButton);
    varButtonDiv.appendChild(lineButton);
    varButtonDiv.appendChild(polygonButton);
    varButtonDiv.appendChild(circleButton);
    progButtonDiv.appendChild(assignButton);
    progButtonDiv.appendChild(drawButton);
    progButtonDiv.appendChild(eraseButton);
    progButtonDiv.appendChild(colorButton);
    progButtonDiv.appendChild(loopButton);
    programWindowDiv.appendChild(varButtonDiv);
    programWindowDiv.appendChild(progButtonDiv);
    programWindowDiv.appendChild(programDiv);

    //Append to container
    container.appendChild(programWindowDiv);
    container.appendChild(vvDivHolder);
    container.appendChild(drawOffsetDiv);
    container.appendChild(drawDiv);
    container.style.position = "relative"; 
    container.style.height = $("#"+programDiv.id).height() + $("#"+drawDiv.id).height() + "px";

    //Add listeners for walk and run
    $("#" + runButton.id).click(function() { run_walk.run(); });
    $("#" + walkButton.id).click(function() { run_walk.walk(); });
    
    function getObjects(variablesObj, canvasObj, codeObj, run_walkObj) {
        variables = variablesObj;
        canvas = canvasObj;
        code = codeObj;
        run_walk = run_walkObj;
    }
}







