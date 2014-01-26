var fresh = true;
/*
 * Controls the Run and Walk features of the Watson Graphcis Lab
 */
//Assign all global variables
var step = 0;
//Allows users to run the program slowly
function run() {
	console.log("run");
}

//Allows users to walk through the program code one step at a time
function walk() {
    returnToNormalColor();
    console.log(codeTable.rows.length);
	console.log(step);
    if (step >= codeTable.rows.length-1) //Don't allow step to go beyond program
	{
        step = 0;
        return;
    }
	if(step==0)
	{
		fresh=true;
		toDraw = new Array();
	}
    selectRow(step);
    highlightLine(step);
    interpret(rowToString(step));
	clear();
	draw();
    step++;
}
