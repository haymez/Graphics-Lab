/**********************************************************************************************
 * Authors: Mitchell Martin, James Miltenburger, Bidur Shrestha, Jonathan Teel Neil Vosburg
 *
 * Entity: Watson Dialog Library (WatsonDialogs.js)
 *
 * This file contains the four components to the Watson Dialog Library: NumberPad, StringPad,
 * Selector, and Alert. Each component has one public method, open(), that has different
 * parameters depending on the component. Please refer to the Watson Dialog Library API document
 * for each component's functionalities and parameter specifications.
 **********************************************************************************************/
 
function NumberPad() {
	this.open = open;
	
	var thisID = NumberPad.nextDialogID;
	NumberPad.nextDialogID++;
	var callback;
	
	var minValue;
	var maxValue;
	var decimalAllowed;
	var base;
	
	var dialogHTML =
		 '<div id="numpadInstructDiv' + thisID + '">\
		 <font size="2">Insert some numbers.</font>\
		 </div>\
		 <input id="numpadInput' + thisID + '" class="NumpadInputBox" readonly></input>\
		 <table id="outerTable">\
			<tr>\
			<td><table id="numpadTable' + thisID + '"></table></td>\
			<td><table id="numpadFuncTable' + thisID + '"></table></td>\
			</tr>\
		</table>';
	 
	function open(_minValue, _maxValue, title, instruction, _decimalAllowed, _base, _callbackFunc) {
		base = _base;
		if (base == 10) openNumpad(_minValue, _maxValue, title, instruction, _decimalAllowed, _callbackFunc);
		else if (base == 16) openHexpad(_minValue, _maxValue, title, instruction, _callbackFunc);
		else alert("Unsupported base.");
	}
	
	function openNumpad(_minValue, _maxValue, title, instruction, _decimalAllowed, callbackFunc) {
		minValue = _minValue;
		maxValue = _maxValue;
		if (minValue !== null && maxValue !== null) {
			if (_minValue >= _maxValue) {
				alert("Error: Minimum value is greater than maximum value.");
				return;
			}
		}
		if (boundsCheck(0) == false) {
			alert("Error: Zero must be included within these bounds.");
			return;
		}
		
		callback = callbackFunc;

		var dialogDiv = document.createElement("div");
		dialogDiv.id = "numpadDialog" + thisID;
		dialogDiv.setAttribute("title", title);
		dialogDiv.innerHTML = dialogHTML;
		document.body.appendChild(dialogDiv);
		
		var input = document.getElementById("numpadInput" + thisID);
		input.value = 0;
			
		decimalAllowed = _decimalAllowed;
		
		var instructDiv = document.getElementById("numpadInstructDiv" + thisID);
		if (instruction == null) instructDiv.innerHTML = "";
		else instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';
		
		var input = document.getElementById("numpadInput" + thisID);
		
		var numpadTable = document.getElementById("numpadTable" + thisID);
		
		$( "#numpadDialog" + thisID ).dialog({width: "295px", resizable: false});
		var row;
		var iters = [ 3, 3, 3, 3 ];
		var vals = [ [ ".", "0", "-" ], [ "3", "2", "1", ], [ "6", "5", "4" ], [ "9", "8", "7" ]  ]; 
		var firstRow;
		
		for (var i = 0; i < 4; i++) {
			row = numpadTable.insertRow();
			for (var j = 0; j < 3; j++) {
				cell = row.insertCell();
				if (i == 0) {
					var id;
					if (vals[i][j] == ".") id = "numPadNumButtonDecimal" + thisID;
					else id = "numpadNumButton" + thisID + "-" + vals[i][j];
					
					cell.innerHTML = "<button id='" + id + "' class='NumpadNumButton'>" + vals[i][j] + "</button>"
					$( "#" + id ).button();
					addNumpadButtonEventListener(id, vals[i][j]);
				}
				else {
					var id = "numpadNumButton" + thisID + "-" + vals[i][j];
					cell.innerHTML = "<button id='" + id + "' class='NumpadNumButton'>" + vals[i][j] + "</button>";
					$( "#" + id ).button();
					addNumpadButtonEventListener(id, vals[i][j]);
				}
			}
		}
		
		var funcTable = document.getElementById("numpadFuncTable" + thisID);
		var button;
		var buttonIDs = [ "numpadNumButtonCancel", "numpadNumButtonClear", "numpadNumButtonEnter" ];
		
		for (var i = 0; i < 3; i++) {
			cell = funcTable.insertRow().insertCell();
			cell.innerHTML = "<button id='" + buttonIDs[i] + thisID + "' class='WatsonLibraryFuncButton'>" + buttonIDs[i].slice(15) + "</button>";
			button = document.getElementById(buttonIDs[i] + thisID);
			if (i == 0) addCancelButtonEventListener(buttonIDs[i] + thisID);
			else if (i == 1) addClearButtonEventListener(buttonIDs[i] + thisID);
			else addEnterButtonEventListener(buttonIDs[i] + thisID);
			$( "#" + buttonIDs[i] + thisID).button();
		}
	}
	
	function openHexpad(_minValue, _maxValue, title, instruction, callbackFunc) {
		minValue = _minValue;
		maxValue = _maxValue;
		if (minValue !== null && maxValue !== null) {
			if (_minValue >= _maxValue) {
				alert("Error: Minimum value is greater than maximum value.");
				return;
			}
		}
		if (boundsCheck(0) == false) {
			alert("Error: Zero must be included within these bounds.");
			return;
		}
		
		callback = callbackFunc;
		
		var dialogDiv = document.createElement("div");
		dialogDiv.id = "numpadDialog" + thisID;
		dialogDiv.setAttribute("title", title);
		dialogDiv.innerHTML = dialogHTML;
		document.body.appendChild(dialogDiv);
		
		var input = document.getElementById("numpadInput" + thisID);
		input.value = 0;
		
		var instructDiv = document.getElementById("numpadInstructDiv" + thisID);
		if (instruction == null) instructDiv.innerHTML = "";
		else instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';
		
		var input = document.getElementById("numpadInput" + thisID);
		
		var hexpadTable = document.getElementById("numpadTable" + thisID);
		
		$( "#numpadDialog" + thisID ).dialog({width: "295px", resizable: false});
		var row;
		var iters = [ 2, 3, 3, 3, 3, 3 ];
		var vals = [ [ "0", "S" ], ["3", "2", "1" ], ["6", "5", "4"], [ "9", "8", "7", ], [ "C", "B", "A" ], [ "F", "E", "D" ]  ]; 
		var firstRow;
		
		for (var i = 0; i < 6; i++) {
			row = hexpadTable.insertRow();
			for (var j = 0; j < iters[i]; j++) {
				cell = row.insertCell();
				var id = "numpadNumButton" + thisID + "-" + vals[i][j];
				cell.innerHTML = "<button id='" + id + "' class='NumpadNumButton'>" + vals[i][j] + "</button>";
				if (id == "numpadNumButton" + thisID + "-S") {
					document.getElementById("numpadNumButton" + thisID + "-S").style.visibility = "hidden";
				}
				else $( "#" + id ).button();
				addHexpadButtonEventListener(id, vals[i][j]);
			}
		}
		
		var funcTable = document.getElementById("numpadFuncTable" + thisID);
		var button;
		var buttonIDs = [ "numpadNumButtonCancel", "numpadNumButtonClear", "numpadNumButtonEnter" ];
		
		for (var i = 0; i < 3; i++) {
			cell = funcTable.insertRow().insertCell();
			cell.innerHTML = "<button id='" + buttonIDs[i] + thisID + "' class='WatsonLibraryFuncButton'>" + buttonIDs[i].slice(15) + "</button>";
			button = document.getElementById(buttonIDs[i] + thisID);
			if (i == 0) { addCancelButtonEventListener(buttonIDs[i] + thisID); button.style.marginBottom = "100px"; }
			else if (i == 1) addClearButtonEventListener(buttonIDs[i] + thisID);
			else addEnterButtonEventListener(buttonIDs[i] + thisID);
			$( "#" + buttonIDs[i] + thisID).button();
		}
	}
	
	function addNumpadButtonEventListener(buttonID, value) {
		var button = document.getElementById(buttonID);
		button.addEventListener("click", function() {
			var input = document.getElementById("numpadInput" + thisID);
			
			if (value == "-") {
				if (input.value.charAt(0) != '-' && input.value != '0') {
					var temp = input.value;
					if (boundsCheck("-" + temp) == true) input.value = "-" + temp;
				}
				else {
					var temp = input.value.slice(1);
					if (boundsCheck(temp) == true) input.value = input.value.slice(1);
				}
			}
			else if (value == ".") {
				if (input.value.indexOf(".") < 0 && decimalAllowed == true) input.value += value;
			}
			else {
				if (boundsCheck(input.value + value) == true) {
					if (input.value == "0") input.value = value;
					else input.value += value;
				}
			}
			
			$( "#" + buttonID).blur();
		});
	}
	
	function addHexpadButtonEventListener(buttonID, value) {
		var button = document.getElementById(buttonID);
		button.addEventListener("click", function() {
			var input = document.getElementById("numpadInput" + thisID);
			
			if (boundsCheck(input.value + value) == true) {
				if (input.value == "0") input.value = value;
				else input.value += value;
			}
			
			$( "#" + buttonID).blur();
		});
	}
	
	function addEnterButtonEventListener(buttonID) {
		var button = document.getElementById(buttonID);
		button.addEventListener("click", function() {
			var input = document.getElementById("numpadInput" + thisID);
			callback(input.value);
			$( "#numpadDialog" + thisID).dialog('close');
		});
	}
	
	function addClearButtonEventListener(buttonID) {
		var button = document.getElementById(buttonID);
		button.addEventListener("click", function() {
			var input = document.getElementById("numpadInput" + thisID);
			input.value = "0";
			
			$( "#" + buttonID).blur();
		});
	}
	
	function addCancelButtonEventListener(buttonID) {
		var button = document.getElementById(buttonID);
		button.addEventListener("click", function() {
			$( "#numpadDialog" + thisID).dialog('close');
			callback(null);
		});
	}
	
	function boundsCheck(value) {
		if (base == 10)	value = parseFloat(value);
		else value = parseInt(value, 16);
		
		if (minValue === null && maxValue === null) return true;
		else if (minValue !== null && maxValue !== null) {
			if (value <= maxValue && value >= minValue) return true;
		}
		else if (minValue === null && maxValue !== null) {
			if (value <= maxValue) return true;
		}
		else if (minValue !== null && maxValue === null) {
			if (value >= minValue) return true;
		}
		
		return false;
	}
}

function StringPad() {
	this.open = open;
	
	var thisID = StringPad.nextDialogID;
	StringPad.nextDialogID++;
	var callback;
	
	var dialogHTML =
		'<table id="selectorTable">\
		<tr>\
		<td>\
		<div id="stringPadInstructDiv' + thisID + '"></div>\
		<input id="stringInput' + thisID + '" style="width:270px"></select>\
		</td>\
		<td>\
		<table id="innerTable">\
		<tr>\
		<td><button id="stringPadOkay' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		</tr>\
		<tr>\
		<td><button id="stringPadClear' + thisID + '" class="WatsonLibraryFuncButton">Clear</button></td>\
		</tr>\
		<tr>\
		<td><button id="stringPadCancel' + thisID + '" class="WatsonLibraryFuncButton">Cancel</button></td>\
		</tr>\
		</table>\
		</td>\
		</table>';
		
	function open(title, instruction, callback) {
		var dialogDiv = document.createElement("div");
		dialogDiv.id = "stringPadDialog" + thisID;
		dialogDiv.setAttribute("title", title);
		dialogDiv.innerHTML = dialogHTML;
		document.body.appendChild(dialogDiv);
		
		var instructDiv = document.getElementById("stringPadInstructDiv" + thisID);
		if (instruction == null) instructDiv.innerHTML = "";
		else instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';
	
		$( "#stringPadDialog" + thisID ).dialog({width: "400px", resizable: false});
		
		var input = document.getElementById("stringInput" + thisID);
		var button;
		button = document.getElementById("stringPadOkay" + thisID);
		button.addEventListener("click", function() { $( "#stringPadDialog" + thisID).dialog('close'); callback(input.value); });
		$( "#stringPadOkay" + thisID).button();
	
		button = document.getElementById("stringPadClear" + thisID);
		button.addEventListener("click", function() { input.value = ""; });
		$( "#stringPadClear" + thisID).button();
		
		button = document.getElementById("stringPadCancel" + thisID);
		button.addEventListener("click", function() { $( "#stringPadDialog" + thisID).dialog('close'); callback(null); });
		$( "#stringPadCancel" + thisID).button();
	}
}

function Selector() {
	this.open = open;
	
	var thisID = Selector.nextDialogID;
	Selector.nextDialogID++;
	var callback;
	
	var dialogHTML =
		'<table id="selectorTable">\
		<tr>\
		<td><select id="selector' + thisID + '" size="5" style="width:200px;"></select></td>\
		<td>\
		<table id="innerTable">\
		<tr>\
		<td><button id="selectorOkay' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		</tr>\
		<tr>\
		<td><button id="selectorCancel' + thisID + '" class="WatsonLibraryFuncButton">Cancel</button></td>\
		</tr>\
		</table>\
		</td>\
		</table>';
		
	function open(title, options, callback) {
		var dialogDiv = document.createElement("div");
		dialogDiv.id = "selectorDialog" + thisID;
		dialogDiv.setAttribute("title", title);
		dialogDiv.innerHTML = dialogHTML;
		document.body.appendChild(dialogDiv);
		
		$( "#selectorDialog" + thisID ).dialog({width: "325px", resizable: false});
		
		var select = document.getElementById("selector" + thisID);
		
		var len = options.length;
		for (var i = 0; i < len; i++) {
			var option = document.createElement("option");
			option.text = options[i];
			select.add(option);
		}
		
		var button;
		button = document.getElementById("selectorOkay" + thisID);
		button.addEventListener("click", function() { $( "#selectorDialog" + thisID).dialog('close'); callback(select.options[select.selectedIndex].text); });
		$( "#selectorOkay" + thisID).button();
		
		button = document.getElementById("selectorCancel" + thisID);
		button.addEventListener("click", function() { $( "#selectorDialog" + thisID).dialog('close'); callback(null); });
		$( "#selectorCancel" + thisID).button();
	}
}

function Alert() {
	this.open = open;
	
	var thisID = Alert.nextDialogID;
	Alert.nextDialogID++;
	var callback;
	
	var dialogHTML1 =
		 '<div id="alertInstructDiv' + thisID + '">\
		 <font size="2">Insert some numbers.</font>\
		 </div>\
		 <table>\
		 <tr>\
		 <td><button id="alertOKButton' + thisID + '" class="WatsonLibraryFuncButton">Okay</button></td>\
		 </tr>\
		 <table>';
		 
	var dialogHTML2 =
		 '<div id="alertInstructDiv' + thisID + '">\
		 <font size="2">Insert some numbers.</font>\
		 </div>\
		 <table>\
		 <tr>\
		 <td><button id="alertProceedButton' + thisID + '" class="AlertFuncButton">Proceed</button></td>\
		 <td><button id="alertCancelButton' + thisID + '" class="AlertFuncButton">Cancel</button></td>\
		 </tr>\
		 <table>';
		 
	function open(title, instruction, bool, _callback) {
		callback = _callback;
		
		var dialogDiv = document.createElement("div");
		dialogDiv.id = "alertDialog" + thisID;
		dialogDiv.setAttribute("title", title);
		if (bool) {
			dialogDiv.innerHTML = dialogHTML1;
		}
		else {
			dialogDiv.innerHTML = dialogHTML2;
		}
		document.body.appendChild(dialogDiv);

		var instructDiv = document.getElementById("alertInstructDiv" + thisID);
		instructDiv.innerHTML = '<font size="2">' + instruction + '</font>';
		
		if (instruction.length < 50) $( "#alertDialog" + thisID ).dialog({width: "295px", resizable: false});
		else $( "#alertDialog" + thisID ).dialog({width: "295px", resizable: false});
		
		if (bool) {
			var okButton = document.getElementById("alertOKButton" + thisID);
			if (instruction.length < 30) okButton.style.marginTop = "30px";
			else okButton.style.marginTop = "10px";
			okButton.style.marginLeft = "85px";
			okButtonEventListener("alertOKButton" + thisID);
			$( "#alertOKButton" + thisID).button();
		}
		else {
			var proceedButton = document.getElementById("alertProceedButton" + thisID);
			if (instruction.length < 50) proceedButton.style.marginTop = "30px";
			else proceedButton.style.marginTop = "10px";
			
			proceedButton.style.marginLeft = "25px";
			proceedButtonEventListener("alertProceedButton" + thisID);
			$( "#alertProceedButton" + thisID).button();
			
			var cancelButton = document.getElementById("alertCancelButton" + thisID);
			if (instruction.length < 50) cancelButton.style.marginTop = "30px";
			else cancelButton.style.marginTop = "10px";
			cancelButtonEventListener("alertCancelButton" + thisID);
			$( "#alertCancelButton" + thisID).button();
		}
	}

	function okButtonEventListener(id) {
		var button = document.getElementById(id);
		button.addEventListener("click", function() {
			$("#alertDialog" + thisID).dialog('close');
			callback(null);
		});
	}
	
	function proceedButtonEventListener(id) {
		var button = document.getElementById(id);
		button.addEventListener("click", function() {
			$("#alertDialog" + thisID).dialog('close');
			callback(true);
		});
	}
	
	function cancelButtonEventListener(id) {
		var button = document.getElementById(id);
		button.addEventListener("click", function() {
			$("#alertDialog" + thisID).dialog('close');
			callback(false);
		});
	}
}

NumberPad.nextDialogID = 0;
StringPad.nextDialogID = 0;
Selector.nextDialogID = 0;
Alert.nextDialogID = 0;