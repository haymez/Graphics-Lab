/*
	Andrew Duryea
	March 22, 2014
	editor.js

	This javascript consists of an implementation of the Editor API.
	
	The editor handles the following:
		Syntax Highlighting
			Highlighting code based on CSS classes defined in editor.css
		Click Events
			Clicking on a cell in the editor
		Mouse Hover Events
			Entering/leaving a cell in the editor
		Insertion Bar
			For setting the insertion point in the code
		Line Numbers
			Numbering each line in the editor
		Adding Lines
			Adding new lines to the editor
		Deleting Lines
			Deleting old lines from the editor
		
	March 28, 2014 - Should now conform to the pre-alpha API v2
	April 3, 2014 - Now conforms to the pre-alpha API v3, and first stable release
*/

/* Constructor - constructs the editor
	@param {number} divID - the ID of the div to place the editor in
	@param {boolean} lineNumBool - if true use line numbers, if false do not
	@param {boolean} syntaxHighlightingBool - if true use syntax highlighting, if false do not
	@param {number} lineNumStart - what number line numbers should start at
	@param {number} cellWidth - the width of the first cell? if < 0 fit to text
	@param {number} insertBetweenRowsBool - if true a line can be inserted/deleted anywhere, if false lines can only be inserted/deleted from the end of the editor
*/
function Editor(divID, lineNumBool, syntaxHighlightingBool, lineNumStart, cellWidth, insertBetweenRowsBool){

	/*GLOBAL VARIABLES********************************************************/
	
	var editorDiv = document.getElementById(divID);			//the div marked by the divID
	var clickHandler;		//the click handler
	var mouseEnterHandler;		//the mouse enter handler
	var codeTable;			//the table containing the code
	var insertTable;		//the table containing the insert bar
	
	var insertBarCursorIndex = -1;
	
	/*copied from the JavaScript lab's original editor.js*/
	var selRow = 0;											// the current selected row
	var blank = "&nbsp;&nbsp;&nbsp;";			// blank template for unselected row
	var arrow = "&nbsp;&#8594;&nbsp;";			// arrow template for selected row
	var indent = "&nbsp;&nbsp;&nbsp;"						// indention used for inside brackets
	var programStart = 0;									// the line the main program starts
	var firstMove = false;									// keeps track if the user has added something to the main program
	var innerTableTemplate = "<table class='innerTable innerTable" + divID + "'><tr>\
								<td class='cell" + divID + " code lineNum'>&nbsp;&nbsp;</td>\
								<td class='cell" + divID + " code lineNum'>" + blank + "</td>\
							</tr></table>";	// template used for a newly added row in the codeTable
	var innerTableArrowTemplate = "<table class='innerTable" + divID + "'><tr>\
										<td class='cell" + divID + " code lineNum'>&nbsp;&nbsp;</td>\
										<td class='cell" + divID + " code lineNum'>" + arrow + "</td>\
									</tr></table>"; // template used for a newly selected row
	var rowType = [];
	var curLine;
	var nextLine;
	var terminate = false;
	var promptFlag = false;
	var insideFunction = false;
	var highlightStart;
	var dummyRows = [];
	var lineNums = [];
	var charCountStart = [];
	var charCountEnd = [];
	var codeStrLen;
	var rowNum = -1;
	var showLineCountFlag = false;
	/*end copy*/
	
	editorDiv.innerHTML = '<div class="textArea"><div class="insertDiv"><div class="offsetDiv"></div><table id="insertTable' + divID + '"></table></div><table id="figEditor' + divID + '" class="codeTable"></table></div>';
	codeTable = document.getElementById('figEditor' + divID);
	insertTable = document.getElementById('insertTable' + divID);
	
	init();
	
	/* init - .... it initializes some important stuff .. o_0
	*/
	function init() {
		var row;
		var cell;
		var innerTable;
		
		// make a blank row where the program starts (this could have been in the for loops above)
		row = codeTable.insertRow(0);	// make a new row
		cell = row.insertCell(0);		// make a new cell here
		cell.className = 'cell' + divID;	//a general class for cells in this editor, used for adding/removing click events
		cell.innerHTML = innerTableArrowTemplate;	// set the cell with arrow template
		programStart = 0;				// increase the program start to 2
		selRow = 0;						// selected row is line 2
		refreshLineCount();				// refresh the line count along the left margin
		
		//add a row to the insert bar
        var row = insertTable.insertRow(selRow);
        var cell = row.insertCell(0);
        cell.className = 'cell' + divID + ' insert insert' + divID;
        cell.innerHTML = blank;
	}
	
	/*PUBLIC FUNCTIONS********************************************************/

	this.rowToArray = rowToArray;
	this.getRowCount = getRowCount;
	this.addRow = addRow;
	this.deleteRow = deleteRow;
	this.selectRowByIndex = selectRowByIndex;
	this.selectAndHighlightRowByIndex = selectAndHighlightRowByIndex;
	this.moveInsertionBarCursor = moveInsertionBarCursor;
	this.getSelectedRowIndex = getSelectedRowIndex;
	this.setCellClickListener = setCellClickListener;
	this.setInsertBarMouseEnterListener = setInsertBarMouseEnterListener;
	
	this.selectRowByStartEnd = selectRowByStartEnd;	//DEPRECATED
	this.getEditor = getEditor;			//DEPRECATED
	this.rowToString = rowToString;		//DEPRECATED

	/* rowToArray - returns an array with each entry representing a cell in the row
		@param {number} index - the index of the row to process
		@returns {array} an array of strings of the cells of the row
	*/
	function rowToArray(index){
		//console.log(codeTable.rows[index].cells[0].children[0].rows[0].cells[2].innerHTML);
		var cells = codeTable.rows[index].cells[0].children[0].rows[0].cells;
		var ret = []; //the return array
		
		//i starts at 2 so it doesn't get the line number
		for(var i = 2; i < cells.length; i++)
		{
			ret.push(cells[i].innerHTML);
		}
		
		//console.log(ret);
		return ret;
	}
	
	/* getRowCount() - returns the number of rows in the editor
		@returns {numer} the number of rows in the editor
	*/
	function getRowCount(){
		return codeTable.rows.length;
	}
	
	/* addRow - adds a row with classes to the editor
		@param {number} index - the index of the row to insert at
		@param {object} values - an array of objects with two things: the text of the cell and the class for syntax highlighting
			every cell automatically receives the "code" class
	*/
	function addRow(index, values){	
		var row = codeTable.insertRow(index);			// get the selected row from the main codeTable
		var cell = row.insertCell(0);					// make a new cell here
		cell.innerHTML = innerTableTemplate;			// put our inner table template in the new cell
		var innerTable = codeTable.rows[index].cells[0].children[0];	// grab the inner table over we just created
		
		var startIndex = 2;		//start at 2 to avoid the line numbers
		
		for (var i = 0; i < values.length; i++) {			// for all cells in the table
			cell = innerTable.rows[0].insertCell(startIndex++);	// insert a cell at startInd
			cell.innerHTML = values[i].text;					// make the innerHTML of the cell cells[i]
			
			//every cell needs the "code" class
			cell.className += 'cell' + divID + ' code';
			
			//if no Highlighting, add class to override others
			if(!syntaxHighlightingBool){
				cell.className += " noHighlighting";
			}
	
			//if the class is not equal to "code", add whatever it is
			if(values[i].type != "code" && typeof values[i].type != "undefined")
				cell.className += " " + values[i].type;
		}
		
		//add a row to the insert bar
        var row = insertTable.insertRow(selRow);
        var cell = row.insertCell(0);
        cell.className = 'cell' + divID + ' insert insert' + divID;
        cell.innerHTML = blank;
		
		//console.log(codeTable.getAttribute('id'));
		
		//we just inserted a new line, so the next selected line should be empty
		selRow++;
		
		refreshLineCount(); // refresh the line count along the left margin
	}
	
	/* deleteRow - deletes the row at the specified index
		@param {number} index - the index of the row to delete
	*/
	function deleteRow(index){
		//you can't delete the selected row
		if(index == selRow){
			return;
		}
		
		codeTable.deleteRow(index);
		
		//if the selected row is after the deleted row, decrement selRow
		if(selRow > index){
			selRow--;
		}
		
		refreshLineCount(); // refresh the line count along the left margin
	}
	
	/* selectRowByIndex - selects a row based upon the index provided
		@param {number} index - the row to select
	*/
	function selectRowByIndex(index){
		//if insertBetweedRowsBool is false, prevent the selected row from being anywhere other than the last row
		if(!insertBetweenRowsBool && index < getRowCount()){
			return;
		}
		
		//if insert bar cursor is not on this line, then you can't select that line, so don't insert
		if(insertBarCursorIndex != index){
			return;
		}
		
		//if the selected row is above the row we want to select, then the index is off by 1
		if(selRow < index){
			index--;
		}
			
		//if you are already on the last line, then don't do anything
		if(index + 1 >= codeTable.rows.length){
			return;
		}
		
		innerTable = codeTable.rows[selRow].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = blank;
		
		//if this is a blank line, remove the row before moving the cursor
		if(innerTable.rows[0].cells.length <= 2){
			codeTable.deleteRow(selRow);
			insertTable.deleteRow(index);
		}
		
		selRow = index;
		addRow(index + 1, []);
		innerTable = codeTable.rows[selRow].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = arrow;
	}
	
	/* selectAndHighlightRowByIndex - selects and highlights a row based upon the index provided
		@param {number} index - the row to select
	*/
	function selectAndHighlightRowByIndex(index){
		innerTable = codeTable.rows[selRow].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = blank;
		
		//remove the 'selected' class the hard way
		for(var i = 0; i < innerTable.rows[0].cells.length; i++){
			innerTable.rows[0].cells[i].className = innerTable.rows[0].cells[i].className.replace("selected running", "");
		}
		
		selRow = index;
		innerTable = codeTable.rows[selRow].cells[0].children[0];
		innerTable.rows[0].cells[1].innerHTML = arrow;
		
		//add the 'selected' and 'running' classes the hard way
		// the 'running' class means that onHover will not remove the selected highlighting
		for(var i = 0; i < innerTable.rows[0].cells.length; i++){
			innerTable.rows[0].cells[i].className += " selected running";
		}
	}
	
	/* moveInsertionBarCursor - moves the cursor in the insertion bar, which is removed in the mouse leave event below
		@param {numeric} index - the index of the row to move the cursor to
	*/
	function moveInsertionBarCursor(index){
		//console.log("\t" + codeTable.getAttribute('id') + " " + insertTable.getAttribute('id') + " " + insertTable.rows[index].cells[0].className + " " + syntaxHighlightingBool);
		
		insertTable.rows[index].cells[0].style.cursor = 'pointer';
		insertTable.rows[index].cells[0].innerHTML = ">";
		insertBarCursorIndex = index;
		console.log(index);
	}
	
	/* getSelectedRowIndex - returns the currently selected row's index
		@returns {numeric} the index of the current row
	*/
	function getSelectedRowIndex(){
		return selRow;
	}
	
	/* setCellClickListener - sets the callback function for clicks, WARNING: this function turns off the click handlers for "td" elements
		@param {function} clickFunc - the click callback function, should take a DOM object as an argument
	*/
	function setCellClickListener(clickFunc){
		//turn off the click handler as it is now, should only remove the current clickHandler
		$('div').off('click', '.cell' + divID, clickHandler);
		
		clickHandler = clickFunc;
		
		//set the new click handler
		$('div').on('click', '.cell' + divID, clickHandler);
	}
	
	/* setInsertBarMouseEnterListener - sets the callback function for mouse enter, WARNING: this function turns off the mouse enter handlers for "td" elements
		@param {function} mouseEnterFunc - the mouse enter callback function, should take a DOM object as an argument
	*/
	function setInsertBarMouseEnterListener(mouseEnterFunc){
		//turn off the mouse enter handler as it is now, should only remove the current mouseEnterHandler
		//console.log('.insert' + divID + " " + codeTable.getAttribute('id') + " " + insertTable.getAttribute('id') + " " + syntaxHighlightingBool);
		$('div').off('mouseenter', '.insert' + divID, mouseEnterHandler);
		
		mouseEnterHandler = mouseEnterFunc;
		
		//set the new mouse enter handler
		$('div').on('mouseenter', '.insert' + divID, mouseEnterHandler);
	}
	
	
	/* getEditor - DEPRECATED - returns the DOM object representing the editor
		@return {object} the editor's DOM object
	*/
	function getEditor(){
		return editorDiv;
	}
	
	/* rowToString - DEPRECATED - returns a string representing the row
		@param {number} index - the index of the row to process
		@returns {string} the string representation of the row
	*/
	function rowToString(index){
		//console.log(codeTable.rows[index].cells[0].children[0].rows[0].cells[2].innerHTML);
		var cells = codeTable.rows[index].cells[0].children[0].rows[0].cells;
		var ret = ""; //the return string
		for(var i = 2; i < cells.length; i++)
		{
			ret += cells[i].innerHTML;
		}
		
		//console.log(ret);
		return ret;
	}
	
	/* selectRowByStartEnd - DEPRECATED and NOT IMPLEMENTED - selects a row based upon the start and end character indexes
		@param {number} start - the start character index
		@param {number} end - the end character index
	*/
	function selectRowByStartEnd(start, end){
	}
	
	/*PRIVATE FUNCTIONS*******************************************************/
	
	/* refreshLineCount - refreshes the line count in the first cell of every inner table
	*/
	function refreshLineCount() {
		var innerTable;
		if (lineNumBool) {
			var numStart = lineNumStart;
			for (var i = 0; i < codeTable.rows.length; i++) {
				innerTable = codeTable.rows[i].cells[0].children[0];
				if (i <= 8) innerTable.rows[0].cells[0].innerHTML = (numStart++) + "&nbsp;";
				else innerTable.rows[0].cells[0].textContent = (numStart++);
			}
		}/*
		else {
			for (var i = 0; i < codeTable.rows.length; i++) {
				innerTable = codeTable.rows[i].cells[0].children[0];
				innerTable.rows[0].cells[0].innerHTML = "";
			}
		}*/
	}
	
	/* mouseleave - a jQuery event handler for mouse leave on insert elements, ie cells in the insert bar
	*/
	$('div').on('mouseleave', '.insert' + divID, function(event){
		if($(this).css('cursor') == 'pointer'){
			$(this).css('cursor', 'default');
			$(this).html(blank);
			insertBarCursorIndex = -1;
		}
	});
	
	/* mouseenter - a jQuery event handler for mouse enter, calls onHover with false
	*/
	$('div').on('mouseenter', '.code', {addClass: true}, onHover);
	
	/* mouseleave - a jQuery event handler for mouse leave, calls onHover with false
	*/
	$('div').on('mouseleave', '.code', {addClass: false}, onHover);
	
	/* onHover - this function handles highlighting cells when they are moused over, and
			removing that highlight when the mouse leaves the cell
		@param {object} event - information about the event that occurred
		@returns {boolean} returns false to prevent event from propagating
	*/
	function onHover(event){
		//the element that triggered the event, used for convenience
		var thisElement = $(this);
		
		//the 'running' class overiders normal syntax highlighting
		if(thisElement.hasClass('running')){
			return;
		}
		
		//the list of elements to affect
		var elements = thisElement;
		
		//comments and row numbers highlight the whole line
		if(thisElement.hasClass('comment') || thisElement.hasClass('lineNum'))
			elements = thisElement.parent().find('.code');//.removeClass('selected');
		
		//begin curly brace and scope stuff, the same concepts as parenthesis, but with more DOM traversing!
		//this is the cell on the next row that should contain a {
		var targetCell = thisElement.parent().parent().parent().parent().parent().next().children().first().children().first().children().first().children().first().children().last();
		
		if(targetCell.length > 0 && thisElement.index() == 2 && targetCell.hasClass('openBrack'))
		{
			thisElement = targetCell;
			elements = thisElement;
		}
		
		//check the last character of the html to account for indentation
		if(thisElement.hasClass('openBrack'))
		{
			//console.log('here');
			//add all the code elements from this row and the previous row
			elements = thisElement.parent().parent().parent().parent().parent().find('.code');
			elements = elements.add(thisElement.parent().parent().parent().parent().parent().prev().find('.code'));
		
			//go up the DOM tree 5 times to get the row, then next() to get the next row
			var nextRow = thisElement.parent().parent().parent().parent().parent().next();
			//then look at the next row, go down 5 times and get the html
			targetCell = nextRow.children().first().children().first().children().first().children().first().children().last();
			
			//the count of unclosed scopes so far
			var count = 1;
			
			while(count > 0 && nextRow.length > 0)
			{
				//if we find another left brace, then we have another unclosed scope
				if(targetCell.hasClass('openBrack'))
					count++;
				//if we find a right brace, then we can close a scope
				else if(targetCell.hasClass('closeBrack'))
					count--;
			
				//add all of this row's code elements to the elements list
				elements = elements.add(nextRow.find('.code'));
				
				//get the next row
				nextRow = nextRow.next();
				//get the html
				targetCell = nextRow.children().first().children().first().children().first().children().first().children().last();
			}
		}
		else if(thisElement.hasClass('closeBrack'))
		{
			//add all the code elements from this row
			elements = thisElement.parent().parent().parent().parent().parent().find('.code');
		
			//go up the DOM tree 5 times to get the row, then prev() to get the prev row
			var prevRow = thisElement.parent().parent().parent().parent().parent().prev();
			//then look at the prev row, go down 5 times and get the html
			var targetCell = prevRow.children().first().children().first().children().first().children().first().children().last();
			
			//the count of unclosed scopes so far
			var count = 1;
			
			while(count > 0 && prevRow.length > 0)
			{
				//if we find another right brace, then we have another unclosed scope
				if(targetCell.hasClass('closeBrack'))
					count++;
				//if we find a left brace, then we can close a scope
				else if(targetCell.hasClass('openBrack'))
					count--;
			
				//add all of this row's code elements to the elements list
				elements = elements.add(prevRow.find('.code'));
				
				//get the prev row
				prevRow = prevRow.prev();
				//get the html
				targetCell = prevRow.children().first().children().first().children().first().children().first().children().last();
			}
			
			elements = elements.add(prevRow.find('.code'));
		}
		//end curly brace and scope stuff
		
		//do parenthesis stuff
		//if the next element is an open paren, highlight all of that too
		// ex highlighting a function call will highlight all of the arguments too
		if(thisElement.next().html() == '(')
		{
			thisElement = thisElement.next();
			elements = thisElement;
		}
		
		if(thisElement.hasClass('openParen'))
		{
			//since this is a left paren, search to the right using next()
			
			//since this is a left paren, add in the previous element
			elements = elements.add(thisElement.prev());
			
			//the next element to process
			var next;
			next = thisElement.next();
				
			var count = 1; //a count of unclosed scopes
			while(count > 0 && next.length > 0)
			{
				//if we find another left paren, then we have another unclosed scope
				if(next.hasClass('openParen'))
					count++;
				//if we find a right paren, then we can close a scope
				else if(next.hasClass('closeParen'))
					count--;
				
				//add next to the list of elements so far
				elements = elements.add(next);
				//move next forward
				next = next.next();
			}
		}
		else if(thisElement.hasClass('closeParen'))
		{
			//since this is a right paren, search to the left using prev()
			
			//the next element to process
			var prev;
			prev = thisElement.prev();
				
			var count = 1; //a count of unclosed scopes
			while(count > 0 && prev.length > 0)
			{
				//if we find another right paren, then we have another unclosed scope
				if(prev.hasClass('closeParen'))
					count++;
				//if we find a left paren, then we can close a scope
				else if(prev.hasClass('openParen'))
					count--;
				
				//add prev to the list of elements so far
				elements = elements.add(prev);
				//move prev forward
				prev = prev.prev();
			}
			
			//since we're iterating backwards, this will be the element directly before the left paren
			elements = elements.add(prev);
		}
		//end parenthesis stuff
		
		//actually add or remove classes
		if(event.data.addClass)
			elements.addClass('selected');
		else
			elements.removeClass('selected');

		return false;
	}
}