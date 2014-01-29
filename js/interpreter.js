//Note: how to tokenize in javascript:
//input.split(/[(,)\s]+/);
//Author: Mitchell James Martin
//Note: this is an adapted method from a previous Watson Graphics Lab rewritten
//for javascript.
var d = new Array();
var p = new Array();
var l = new Array();
var g = new Array();
var c = new Array();
var variableNumber;
var variableType;


//these next two functions are for testing purposes. Ignore. Erase if you want.
function assignP1()
{
	interpret("p1 = (200,200)");
	//interpret("p2 = (100,100)");
	interpret("color(blue)");
	interpret("l1 = (p1,100,100)");
}


function drawP1()
{
	interpret("draw(l1)");
	interpret("color(black)");
}

function interpret(input)
{
	if (fresh)
	{
		toDraw = [];
		fresh = false;
		for (var i = 0; i < distanceVariables.length; i++)
		{
			d[i] = 0;
		}
		for (var i = 0; i < pointVariables.length; i++)
		{
			p[i] = new point(0, 0);
		}
		for (var i = 0; i < lineVariables.length; i++)
		{
			l[i] = new line(0, 0, 0, 0);
		}
		for (var i = 0; i < polygonVariables.length; i++)
		{
			g[i] = new Array();
		}
		for (var i = 0; i < circleVariables.length; i++)
		{
			c[i] = new circle(0, 0, 0);
		}
	}
	//input is assumed to be some string variable with the instructions
	//to be used
	//Split input into tokens
	// Note: /s includes several different types of whitespace
	//characters.
	tokens = input.split(/[(,)\s]+/);

	// Check for valid tokens that can delimit the start of
	// statement or loop structure -- 'repeat' 'endloop'
	if (tokens[0].localeCompare("draw") == 0)
	{
		// get the next token
		if (tokens.length < 3)
		{
			//TODO: handle errors
		}
		if (isValid(tokens[1]) && (!(tokens[1].charAt(0) == 'd')))
		{
			if (tokens[1].charAt(0) == 'p')
			{
				toDraw.push(p[parseInt(tokens[1].substr(1)) - 1]);

			}
			else if (tokens[1].charAt(0) == 'l')
			{
				toDraw.push(l[parseInt(tokens[1].substr(1)) - 1]);
			}
			else if (tokens[1].charAt(0) == 'g')
			{
				var polygon = g[parseInt(tokens[1].substr(1)) - 1];
			}
			//assume circle
			else
			{
				toDraw.push(c[parseInt(tokens[1].substr(1)) - 1]);
			}
		}
		else if (tokens[0].localeCompare("OBJECT") == 0)
		{
			//TODO: handle incomplete
			//handleIncompleteProgram(currentToken);
			return;
		}
		else
		{
			console.log("Syntax error");
			return;
		}
	}
	else if (tokens[0].localeCompare("erase") == 0)
	{
		// get the next token
		if (tokens.length < 3)
		//TODO: handle errors
		{
			return;
		}

		if (validVariable(tokens[1]) && (!(tokens[1].charAt(0) == 'd')))
		{
			if (tokens[1].charAt(0) == 'p')
			{

			}
			else if (tokens[1].charAt(0) == 'l')
			{

			}
			else if (tokens[1].charAt(0) == 'g')
			{

			}
			//assume circle
			else
			{

			}
		}
		else if (tokens[0].localeCompare("OBJECT") == 0)
		{
			//TODO: incomplete
			//handleIncompleteProgram(currentToken);
			return;
		}
		else
		{
			console.log("Syntax error");
			return;
		}
	}
	else if (tokens[0].localeCompare("color") == 0)
	{
		// process the color command

		// get the next token
		if (tokens.length < 3)
		{
			//TODO: handle errors
		}

		if (tokens[1].localeCompare("red") == 0)
		{
			color = "red";
		}
		else if (tokens[1].localeCompare("blue") == 0)
		{
			color = "blue";
		}
		else if (tokens[1].localeCompare("green") == 0)
		{
			color = "green";
		}
		else if (tokens[1].localeCompare("yellow") == 0)
		{
			color = "yellow";
		}
		else if (tokens[1].localeCompare("orange") == 0)
		{
			color = "orange";
		}
		else if (tokens[1].localeCompare("black") == 0)
		{
			color = "black";
		}
		else if (tokens[1].localeCompare("white") == 0)
		{
			color = "white";
		}
		//else if (tokens[1].localeCompare("white")==0)
		//{
		//TODO: incomplete program
		//handleIncompleteProgram(currentToken);
		//    return;
		//}
		else
		{
			console.log("Syntax error");
			return;
		}
	}
	else if (tokens[0].localeCompare("increment") == 0 ||
		tokens[0].localeCompare("decrement") == 0)
	{
		// process the increment and decrement commands

		//string 
		var StatementType = tokens[0];

		// get the next token -- distance variable expected
		if (tokens.length < 3)
		{
			//TODO: handle errors
			return;
		}

		if (validVariable(tokens[1]) && (tokens[1].charAt(0) == 'd'))
		{
			// remember the variable number
			//int
			var IDVariableNumber = parseInt(tokens[1].substr(1));

			// get the next token -- distance constant (AMOUNT) expected
			//TODO: seems redundant to check length twice. Also unexpected end of program
			if ((tokens.length < 3))
			{
				return;
			}

			var valid = validDistanceConstanct(tokens[2])
			if (valid[0])
			{
				if (StatementType.localeCompare("increment") == 0)
				{
					d[IDVariableNumber - 1] = d[IDVariableNumber - 1] +
						valid[1];
				}
				else // decrement
				{
					d[IDVariableNumber - 1] = d[IDVariableNumber - 1] -
						valid[1];
				}
				if (rangeError(d[IDVariableNumber - 1]))
				{
					//TODO: range error
					//handleRangeError( IDVariableNumber,
					//                    d[IDVariableNumber-1] );
					return;
				}
			}
			else if (tokens[2].localeCompare("AMOUNT") == 0)
			{
				//TODO: incomplete
				//handleIncompleteProgram(currentToken);
				return;
			}
			else
			{
				//TODO: syntax
				//handleSyntaxError(currentToken);
				return;
			}
		}
		else if (currentToken.equals("DISTANCE"))
		{
			//TODO: incomplete
			//handleIncompleteProgram(currentToken);
			return;
		}
		else
		{
			//TODO: syntax
			//handleSyntaxError(currentToken);
			return;
		}
	}
	else if (tokens[2].localeCompare("repeat") == 0)
	{
		/*
         // get the next token
         if (!getNextToken()) {handleUnexpectedEndOfProgram(); return;}

         // a valid counter is expected here.
         if ( currentToken.equals("COUNTER") )
         {
             handleIncompleteProgram(currentToken);
             return;
         }

         if ( ! validCounter(currentToken) )
         {
            handleSyntaxError(currentToken);
            return;
         }

         // place the current counter on a stack of counters
         loopIterationStack.addElement(new Integer(counterValue));
         loopIterationsRemaining = counterValue;

         // get the next token
         if (!getNextToken()) {handleUnexpectedEndOfProgram(); return;}

         // The keyword 'times' is expected
         if ( ! currentToken.equals("times"))
         {
            handleSyntaxError(currentToken);
            return;
         }

         // get the next token
         if (!getNextToken()) {handleUnexpectedEndOfProgram(); return;}

         // The keyword 'loop' is expected
         if ( ! currentToken.equals("loop"))
         {
            handleSyntaxError(currentToken);
            return;
         }

         // bump up the current line number, since loop is on a separate line
         currentLineIndexZeroBased++;

         // place a copy of the unexamined portion of the programCode
         // onto a stack.
         restOfProgram = codeParser.nextToken("");
         programCodeStack.addElement(restOfProgram);
         codeParser = new StringTokenizer(restOfProgram, "(,) \t\n\r");

         // record the current line number
         currentLineStack.addElement(new Integer(currentLineIndexZeroBased));
	*/
	}
	else if (tokens[0].localeCompare("endloop") == 0)
	{
		/*
         // end of loop structure
         loopIterationsRemaining--;
         if (loopIterationsRemaining > 0)
         {
            codeParser = new StringTokenizer(restOfProgram, "(,) \t\n\r");
            loopIterationStack.setElementAt(
                                  new Integer(loopIterationsRemaining),
                                  loopIterationStack.size()-1           );
            currentLineIndexZeroBased =
                     ((Integer)currentLineStack.lastElement()).intValue();
         }
         else
         {
            //Current loop is complete so pop the loop stacks.
            programCodeStack.removeElementAt(programCodeStack.size()-1);
            loopIterationStack.removeElementAt(loopIterationStack.size()-1);
            currentLineStack.removeElementAt(currentLineStack.size()-1);

            // If the loop stack is not empty, restore loop variables
            // to those of the next outermost loop
            if ( ! programCodeStack.isEmpty() )
            {
               restOfProgram =
                  (String) programCodeStack.lastElement();
               loopIterationsRemaining =
                  ((Integer)loopIterationStack.lastElement()).intValue();
            }
         }*/
	}
	// Check to make sure we have not encountered a placeholder
	// indicating an incomplete assignment statement.  If so,
	// display a message informing the user that the program must
	// be complete before it can be successfully run and then exit
	// the interpreter.
	else if (tokens[2].localeCompare("VARIABLE") == 0)
	{
		//TODO: incomplete
		//handleIncompleteProgram(currentToken);
		return;
	}
	// The only other syntactically valid token that can appear at
	// this point is a variable denoting the left hand side of an
	// assignment statement
	else if (isValid(tokens[0]))
	{
		//int
		var assignmentVariableNumber = variableNumber;
		//string
		var assignmentVariableType = variableType;
		// get the next token
		if (tokens.length < 3)
		{
			console.log("hit");
			//TODO: unexpected input
			//handleUnexpectedEndOfProgram();
			return;
		}

		// The assignment operator = is expected
		if (tokens[1].localeCompare("=") != 0)
		{
			console.log("Hi");
			//TODO: syntax error
			//handleSyntaxError(currentToken);
			return;
		}

		// get the next token
		if (tokens.length < 4)
		{
			//TODO: unexpected input
			//handleUnexpectedEndOfProgram();
			return;
		}

		// Handle RIGHT HAND SIDE EXPRESSIONS for each type of variable

		if (assignmentVariableType.localeCompare("distance") == 0)
		{
			var valid;
			valid = validDistance(tokens[2]);
			if (valid[0])
			{
				d[assignmentVariableNumber - 1] = valid[1];
			}
			else
			{
				handleSyntaxError(currentToken);
				return;
			}
		}
		else if (assignmentVariableType.localeCompare("point") == 0)
		{
			valid = validPoint(tokens.slice(2, 4));
			if (valid[0])
			{
				p[assignmentVariableNumber - 1] = new point(valid[1], valid[2]);
			}
			else
			{
				//TODO: syntax error
				//handleSyntaxError(currentToken);
				return;
			}
		}
		else if (assignmentVariableType.localeCompare("line") == 0)
		{
			valid = validLine(tokens.slice(2, -1));
			if (valid[0])
			{
				l[assignmentVariableNumber-1] = new line(valid[1], valid[2], valid[3], valid[4], "line");
			}
			else
			{
				//TODO:
				//handleSyntaxError(currentToken);
				return;
			}
		}
		else if (assignmentVariableType.localeCompare("polygon") == 0)
		{
			/*boolean morePolyPointsExpected = true;
            boolean firstPoint = true;
            Integer firstX = new Integer(-1);
            Integer firstY = new Integer(-1);

            // Wipe out the old contents of the polygon vector
            g[assignmentVariableNumber-1] = new Vector();
            
            while (morePolyPointsExpected)
            {
               if (validPoint())  // may getNextToken for second distance
               {
                  // add the current point to the Vector for this poly
                  g[assignmentVariableNumber-1].addElement(
                                                new Integer(pointValueX) );
                  g[assignmentVariableNumber-1].addElement(
                                                new Integer(pointValueY) );

                  // are we finished yet?
                  if (firstPoint)
                  {
                     firstPoint = false;
                     firstX = (Integer)
                              g[assignmentVariableNumber-1].elementAt(0);
                     firstY = (Integer)
                              g[assignmentVariableNumber-1].elementAt(1);
                  
                     // we expect more poly points, so get the next token
                     if (!getNextToken())
                     {
                        handleUnexpectedEndOfProgram();
                        return;
                     }
                  }
                  else if ((pointValueX == firstX.intValue()) &&
                           (pointValueY == firstY.intValue())    )
                  {
                     // We just found a point in the polygon that matches the
                     // first point.  We are quite likely at the end of the 
                     // polygon, but just to make sure that there is not a
                     // point in the middle of the polygon that happens to match
                     // the first point, we will check to see if a "," follows
                     // in the case of a point variable or a ")," follows in the
                     // case of a distance variable or constant.  This situation
                     // can only arise in polygons generated under program control
                     // as opposed to being created interactively. 

                     // Get a copy of the remainder of the program from this point
                     // on.  Reset the CodeParser so it will be unaware that we 
                     // made a copy of the program string.

                     String remainderOfProgram = (codeParser.nextToken("")).trim();
                     codeParser = new StringTokenizer(remainderOfProgram, "(,) \t\n\r");
 
                     if ( ! ( remainderOfProgram.startsWith(",") ||
                              remainderOfProgram.startsWith("),")   ) )
                     {
                        // This truly was the last point in the polygon, so
                        // prepare to exit the loop.  
                        morePolyPointsExpected = false;
                     }
                     else
                     {
                        // false alarm.  We are not at the end of the polygon,
                        // so get the next token.
                        if (!getNextToken())
                        {
                           handleUnexpectedEndOfProgram();
                           return;
                        }
                     }
                  }
                  else
                  {
                     // we expect more poly points, so get the next token
                     if (!getNextToken())
                     {
                        handleUnexpectedEndOfProgram();
                        return;
                     }
                  }
               }
               else
               {
                  handleSyntaxError(currentToken);
                  return;
               }
            }
            
            // update the Current Line Number (necessary since polygons
            // are multiline statements)

            currentLineIndexZeroBased =
                       currentLineIndexZeroBased +
                       ( g[assignmentVariableNumber-1].size() / 2 ) - 1;
		*/
		}
		else
		{
			valid = validCircle(tokens.slice(2, -1));
			if (valid[0])
			{
				c[assignmentVariableNumber - 1].startX = valid[1];
				c[assignmentVariableNumber - 1].startY = valid[2];
				c[assignmentVariableNumber - 1].diameter = valid[3];
			}
			else
			{
				//TODO:
				//handleSyntaxError(currentToken);
				return;
			}
		}
	}
	// Otherwise, something is terribly wrong.  We have encountered
	// a syntactically invalid expression.  The probable cause is
	// that an instructor mistyped the initial program string.
	// Print a (friendly) error message and exit.
	else
	{
		//TODO: syntax
		//handleSyntaxError(currentToken);
		return;
	}
}

function isValid(currentToken)
{
	//string
	var type;
	//int
	var value;
	var start = currentToken.charAt(0);

	// Determine type.  Return false if not a valid variable type.
	if (start == 'd')
		type = "distance";
	else if (start == 'p')
		type = "point";
	else if (start == 'l')
		type = "line";
	else if (start == 'g')
		type = "polygon";
	else if (start == 'c')
		type = "circle";
	else
	{
		return false;
	}

	// We have detected a valid starting character for a variable.
	// Now see if we have a valid variable number to go with it.
	var IsValid = true; // assume valid until proven otherwise.
	// check if there is a valid index after the type identifier
	value = parseInt(currentToken.substr(1));
	if (isNaN(value))
	{
		// began like a variable but did not complete properly
		value = -1;
		IsValid = false;
	}

	// We have a valid variable type and a valid number.  Make sure the
	// number actually refers to a declared variable of the proper type
	// -- i.e., that it is not outside the range of declared variables.
	//TODO: variable names.
	if (IsValid && (value > 0))
	{
		tokens[2].localeCompare("repeat") == 0
		if (((type.localeCompare("distance") == 0) &&
				(value <= d.length)) ||
			((type.localeCompare("point") == 0) &&
				(value <= p.length)) ||
			((type.localeCompare("line") == 0) &&
				(value <= l.length)) ||
			((type.localeCompare("polygon") == 0) &&
				(value <= g.length)) ||
			((type.localeCompare("circle") == 0) &&
				(value <= c.length)))
		{
			variableType = type;
			variableNumber = value;
			return true;
		}
		else
			return false;
	}
	else
	{
		return false;
	}
}

/*
Returns-
index 0: true or false, signifying that the token represents a valid distance constant
index 1: the value of that distance. (If valid)
*/
function validDistanceConstant(currentToken)
{
	var returned = new Array();
	// Determine whether the input represents a valid number
	//boolean
	var IsValid = true; // assume valid until proven otherwise.
	//int
	var TokenValue = -1;
	TokenValue = parseInt(currentToken);
	if (isNaN(TokenValue))
	{
		IsValid = false;
	}

	// Perform a range check on the TokenValue to ensure it is between
	// 0 and 300 inclusive -- the range of valid Distance values.
	if ((IsValid) && (TokenValue >= 0) && (TokenValue <= 300))
	{
		returned[0] = true;
		returned[1] = TokenValue;
		return returned;
	}
	else
	{
		returned[0] = true;
		return returned;
	}
}

function rangeError(val)
{
	if ((val < 0) || (val >= 300))
		return true;
	else
		return false;
}

/*
Returns-
index 0: true or false, signifying that the token represents a valid distance
index 1: the value of that distance. (If valid)
*/
function validDistance(token)
{
	var returned = new Array();
	if (isValid(token) && token.charAt(0) == 'd')
	{
		if (d[variableNumber - 1] != -1)
		{
			returned[0] = true;
			returned[1] = d[variableNumber - 1];
			return returned;
		}
		else
		{
			// TODO: reference to unassigned variable
			//handleUnassignedVariable("d"+variableNumber);
			returned[0] = false
			return returned;
		}
	}
	else
	{
		returned = validDistanceConstant(token);
		if (returned[0])
		{
			return returned;
		}
		else if (token.localeCompare("DISTANCE") == 0)
		{
			// TODO: program is still not complete
			//handleIncompleteProgram(currentToken);
			returned[0] = false;
			return returned;
		}
		else if (currentToken.startsWith("X"))
		{
			// TODO: program is still not complete
			//handleIncompleteProgram(currentToken);
			returned[0] = false;
			return returned;
		}
		else
		{
			returned[0] = false;
			return returned;
		}
	}

}

/*
Returns-
index 0: true or false, signifying that the token represents a valid distance
index 1: The point's x coordinate
index 2: The point's y coordinate
*/
function validPoint(tokens)
{
	var parse = new Array();
	var returned = new Array();
	if (isValid(tokens[0]) && tokens[0].charAt(0) == 'p')
	{
		if ((p[variableNumber - 1].startX != -1) &&
			(p[variableNumber - 1].startY != -1))
		{
			returning[0] = true;
			returned[1] = p[variableNumber - 1].startX;
			returned[2] = 300 - p[variableNumber - 1].startY;
			return returned;
		}
		else
		{
			// error: reference to unassigned variable
			//handleUnassignedVariable("p"+variableNumber);
			//return false;
		}
	}
	else
	{
		parse = validDistance(tokens[0]);
		if (parse[0])
		{
			// the first distance value
			returned[1] = parse[1];

			// get the next token.  
			if (tokens.length < 5)
			{
				//TODO:
				//handleUnexpectedEndOfProgram();
				//return false;
			}
			parse = validDistance(tokens[1]);

			if (parse[0])
			{
				// the second distance value
				returned[2] = 300 - parse[1];
				returned[0] = true;
				return returned;
			}
			else if (tokens[0].charAt(0) == 'Y')
			{
				//TODO: incomplete
				//handleIncompleteProgram(currentToken);
				//return false;
			}
			else if (currentToken.startsWith("X"))
			{
				//TODO:
				//handleIncompleteProgram(currentToken);
				//return false;
				returned[0] = false;
				return returned;
			}
			else
			{
				returned[0] = false;
				return returned;
			}
		}
	}

}
/*
Returns -
    index 0: true or false,
signifying that the token represents a valid distance
index 1: The first point's x coordinate
index 2: The first point's y coordinate
index 3: The second point's x coordinate
index 4: The second point's y coordinate */
function validLine(tokens)
{
	var parse = new Array();
	var returned = new Array();
	if (isValid(tokens[0]) && tokens[0].charAt(0) == 'l')
	{
		if ((l[variableNumber - 1].startX != -1) &&
			(l[variableNumber - 1].startY != -1) &&
			(l[variableNumber - 1].endX != -1) &&
			(l[variableNumber - 1].endY != -1))
		{
			returned[0] = true;
			returned[1] = l[variableNumber - 1].startX;
			returned[2] = l[variableNumber - 1].startY;
			returned[3] = l[variableNumber - 1].endX;
			returned[4] = l[variableNumber - 1].endY;
			return returned;
		}
		else
		{
			/ /
			TODO:
			// error: reference to unassigned variable
			//handleUnassignedVariable("l"+variableNumber);
			returned[0] = false;
			return returned;
		}
	}
	else
	{
		parse = validPoint(tokens.slice(0, 2));
		if (parse[0])
		{
			var index;
			// the first point
			returned[1] = parse[1];
			returned[2] = parse[2];
			if (tokens[0].charAt(0) == 'p')
			{
				index = 1;
			}
			else
			{
				index = 2;
			}

			// get the next token.  
			if (tokens.length < 2)
			{
				//TODO:
				//handleUnexpectedEndOfProgram();
				returned[0] = false;
				return returned;
			}
			parse = validPoint(tokens.splice(index, index + 2));
			if (parse[0])
			{
				// the second point
				returned[0] = true;
				returned[3] = parse[1];
				returned[4] = parse[2];
				return returned;
			}
			else
			{
				returned[0]
				return returned;
			}
		}

		else
		{
			returned[0]
			return returned;
		}
	}
}

function validPolygon()
{
	return true;
}

function validCircle(tokens)
{
	var index;
	var parse = new Array();
	var returned = new Array();
	var rect = canvas.getBoundingClientRect();
	if (isValid(tokens[0]) && tokens.charAt(0) == 'c')
	{
		if ((c[variableNumber - 1].startX != -1) &&
			(c[variableNumber - 1].startY != -1) &&
			(c[variableNumber - 1].diameter != -1))
		{
			returned[0] = true;
			returned[1] = c[variableNumber - 1].startX;
			returned[2] = c[variableNumber - 1].startY;
			returned[3] = c[variableNumber - 1].diameter;
			return returned;
		}
		else
		{
			// TODO: reference to unassigned variable
			//handleUnassignedVariable("c"+variableNumber);
			returned[0] = false;
			return returned;
		}
	}
	else
	{
		parse = validPoint(tokens);
		if (parse[0])
		{
			// the center point
			returned[1] = parse[1];
			returned[2] = parse[2];
			if (tokens[0].charAt(0) == 'p')
			{
				index = 1;
			}
			else
			{
				index = 2;
			}

			// get the next token.  
			if (tokens.length < 3)
			{
				//TODO:
				//handleUnexpectedEndOfProgram();
				returned[0] = false;
				return returned;
			}
			parse = validDistance(tokens[index]);
			if (parse[0])
			{
				returned[0] = true;
				returned[3] = parse[1];
				return returned;
			}
			else if (currentToken.equals("RADIUS"))
			{
				//TODO: incomplete
				//handleIncompleteProgram(currentToken);
				returned[0] = false;
				return returned;
			}
			else
			{
				returned[0] = false;
				return returned;
			}
		}
	}
}