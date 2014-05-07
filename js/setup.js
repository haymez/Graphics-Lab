/*
 * 
 * This sets up new Graphics objects
 * 
 */

//Sets up new lab.
//figNum refers to the unique figure number.
function Setup(figNum, isEx, editorHeight) {
    //Initialize all variables
    var code = new Code(figNum); //Initialize code
    var variables = new Variables(figNum); //Initialize variables
    var addElements = new AddElements(figNum, editorHeight); //Initialize addElements
    var shapes = new Shapes(figNum); //Initialize shapes
    var run_walk = new Run_walk(figNum); //Initialize run_walk
    var interpreter = new Interpreter(figNum); //Initialize interpreter
    var canvas = new Canvas(figNum); //Initialize canvas

    //Sandbox version
    if(figNum < 0) var editor = new Editor("program_code"+figNum, "graphics", Math.abs(figNum), true, true, 1, true, true, true); //Initialize editor
    //Figure mode
    else var editor = new Editor("program_code"+figNum, "graphics", Math.abs(figNum), false, true, 1, true, false, false); //Initialize editor
    
    //If this is an exercise, attempt to load saved data
    if(isEx) editor.loadEditor(true);
    
    /* ************Pass Objects to other classes*************** */
    
    //Pass needed objects to addElements
    addElements.getObjects(variables, canvas, code, run_walk);
    
    //Pass objects to variables
    variables.getObjects(code, editor);
    
    //Pass objects to code
    code.getObjects(editor, variables);
    
    //Pass objects to canvas
    canvas.getObjects(variables, shapes, code, editor);
    
    //Pass objects to shapes
    shapes.getObjects(variables, canvas);
    
    //Pass objects to run_walk
    run_walk.getObjects(editor, code, canvas, interpreter, variables);
    
    //Pass objects to interpreter
    interpreter.getObjects(run_walk, variables, shapes, canvas, editor, code);

    //To be called when document loads
    $(document).ready(function() {
        interpreter.getVariables();
    });
    
}





