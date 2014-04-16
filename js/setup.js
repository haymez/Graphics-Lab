/*
 * 
 * This sets up new Graphics objects
 * 
 */


function Setup(figNum) {
    
    var variables = new Variables();
    var shapes = new Shapes();
    var run_walk = new Run_walk();
    var interpreter = new Interpreter();
    var code = new Code();
    var canvas = new Canvas();
    var addElements = new AddElements(figNum); //Initialize addElements
    var editor = new Editor(addElements.programDiv.id, true, true, 1, -1, true); //Initialize editor
    
    
	editor.setCellClickListener(clickFunc); //Set click listener for editor
	editor.setInsertBarMouseEnterListener(insertClickFunc); //Listener for insertion area
}
