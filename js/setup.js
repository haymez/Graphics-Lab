/*
 * 
 * This sets up new Graphics objects
 * 
 */


function Setup(figNum) {
    
    //Initialize all variables
    var code = new Code(figNum);
    var variables = new Variables(figNum);
    var addElements = new AddElements(figNum); //Initialize addElements
    var shapes = new Shapes(figNum);
    var run_walk = new Run_walk(figNum);
    var interpreter = new Interpreter(figNum);
    var canvas = new Canvas(figNum);

    //Figure mode
    if(figNum >= 0) {
        var editor = new Editor("program_code"+figNum, "DevelopingAlgorithms", figNum, true, true, 1, true, false, true); //Initialize editor
    }
    //Sandbox mode
    else {
        var editor = new Editor("program_code"+figNum, "DevelopingAlgorithms", figNum, true, true, 1, true, true, true); //Initialize editor
    }
    
    
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
    interpreter.getObjects(run_walk, variables, shapes, canvas);
    
}





