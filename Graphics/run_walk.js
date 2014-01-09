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
    if(step < toDraw.length) {
        if (step > 0) {
            toDraw[step-1].varPoints = toDraw[step-1].varPoints.substring(1, toDraw[step-1].varPoints.length) 
        	toDraw[step].varPoints = ">" + toDraw[step].varPoints;
        	step++;
        	writeCode();
    	} else {
    	    toDraw[step].varPoints = ">" + toDraw[step].varPoints;
            step++;
            writeCode();
    	}
	} else if (step == toDraw.length) {
	    toDraw[step-1].varPoints = toDraw[step-1].varPoints.substring(1, toDraw[step-1].varPoints.length)
	    writeCode();
	    step=0;
	}
}
