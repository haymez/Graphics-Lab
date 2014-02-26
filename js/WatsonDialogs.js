//holds a .Deferred() object
var dialogsDefer;
var dialogmodalVars;

$(document).on('click', "input.Numpad" , function() 
{
	var parent = "#"+$(this).parent().parent().parent().parent().attr("id");
	var Val = $(this).val();
	console.log($(parent).val());
	var Current = $(parent).val();
	var NewVal = Current+Val;
	compareVal = convertBase(NewVal, $(parent).data("base"));
	//truncates the values under certain conditions.
	while (compareVal > $(parent).data("maxRange") && $(parent).data("maxRange")>=0 && $(parent).data("maxRange")!=null)
		{
			NewVal = NewVal.substring(1);
			compareVal = convertBase(NewVal, $(parent).data("base"));
		}
	console.log($(parent).data("base"));
	$(parent).val(NewVal);
	console.log($(parent).val());
	$("input.InputValue").val(NewVal);
});

$(document).on('click', "input.ClearBtn" , function() 
{
	var parent = "#"+$(this).parent().parent().parent().parent().attr("id");
	$(parent).val("0");
	$("input.InputValue").val(0);
});

$(document).on('click', "input.VarOKBtn" , function() 
{
	var Select = $("#VarsDialogSelect");
	console.log(Select);
	if(typeof Select.data("selected") == 'undefined')
	{
		dialogsDefer.resolve(new String());
	}
	else
		dialogsDefer.resolve(Select.data("selected"));
	console.log($("#dialog-modal-Vars"));
	console.log(dialogmodalVars);
	dialogmodalVars.dialog("close");
});

$(document).on('click', "input.VarCancelBtn" , function() 
{
	dialogsDefer.resolve(new String());
	dialogmodalVars.dialog("close");
});

$(document).on('click', "input.CancelBtn" , function() 
{
	var parent = "#"+$(this).parent().parent().parent().parent().attr("id");
	$(parent).dialog("close");
});

$(document).on('click', "input.OKBtn" , function() 
{
	var input = $("input.InputValue").val();
	var parent = "#"+$(this).parent().parent().parent().parent().attr("id");
	console.log(parent);
	if ((input > $(parent).data("maxRange") && $(parent).data("maxRange")>=0 && $(parent).data("maxRange")!=null) ||
		(input < $(parent).data("minRange") && $(parent).data("minRange")>=0 && $(parent).data("minRange")!=null)) {
	    $(parent).dialog("close");
		//maxRange is unbounded. Should never be triggered.
		if($(parent).data("maxRange")<0 || $(parent).data("maxRange")==null)
			alert("Please choose a value greater than or equal to "+$(parent).data("minRange").toString()+".");
		//minRange is unbounded
		else if($(parent).data("minRange")<0 || $(parent).data("minRange")==null)
			alert("Please choose a value less than "+$(parent).data("maxRange").toString()+".");
		//There should be no errors if both are unbounded, so the only
		//other option is to print both.
		else
		{
			alert("Please choose a value between "+$(parent).data("minRange").toString()+"and "+$(parent).data("maxRange").toString()+".");
		}
	    $(parent).val(0);
	    $(parent).dialog("open");
	}
	else {
		dialogsDefer.resolve(convertBase(input, $(parent).data("base")));
        $(parent).dialog("close");
	}
	//return;	
});

document.write('\
                    <div id="dialog-modal-Vars" title="Choice Selection Panel" style="display:none">\
                            <div id="VarsSelectHolder">\
                                    <select size=8 id="VarsDialogSelect">\
					</select>\
                            </div>\
                            <div id="VarButtons">\
                                    <ul>\
                                            <li><input type="button" value="OK" class="VarOKBtn VarBtn"/></li>\
                                            <li><input type="button" value="Cancel" class="VarCancelBtn VarBtn"/></li>\
                                    </ul>\
                            </div>\
                    </div>\
					');

$(document).on('change', 'select#VarsDialogSelect', function()
{
	console.log(this);
	var Select = $("#VarsDialogSelect");
	Select.data("selected", this.options[this.selectedIndex].value);
});


document.write
('\
    <!--\
    *************************************************************************************************\
             ************ This is numpad html. Add this anywhere in index page **************************\
    *************************************************************************************************\
    -->\
                    <div id="dialog-modal-num" title="Numeric Entry Pad" style="display:none">\
                            <input type="text" class="InputValue"/>\
                            <div id="NumpadDiv">\
                                    <ul>\
                                            <li><input type="button" class="Numpad" id="Numpad-7" value="7"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-8" value="8"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-9" value="9"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-4" value="4"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-5" value="5"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-6" value="6"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-1" value="1"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-2" value="2"/></li>\
                                            <li><input type="button" class="Numpad" id="Numpad-3" value="3"/></li>\
                                            <li class="Numpad0"><input type="button" class="Numpad" id="Numpad-0" value="0"/></li>\
                                    </ul>\
                            </div>\
                            <div id="NumpadFunctionBtns">\
                                    <ul>\
                                            <li><input type="button" value="OK" class="OKBtn WButton"/></li>\
                                            <li><input type="button" value="Clear" class="ClearBtn WButton"/></li>\
                                            <li><input type="button" value="Cancel" class="CancelBtn WButton"/></li>\
                                    </ul>\
                            </div>\
                    </div>\
    <!--\
    *************************************************************************************************\
            *********************************** Numpad html end ****************************************\
    *************************************************************************************************\
    -->\
\
    <!--\
    *************************************************************************************************\
             ************ This is variable selection html. Add this anywhere in index page **************\
    *************************************************************************************************\
    -->\
                    <div id="dialog-modal-Vars" title="Choice Selection Panel" style="display:none">\
                            <div id="VarsSelectHolder">\
                                    <select size=8 id="VarsDialogSelect">\
                    \
                                    </select>\
                            </div>\
                            <div id="VarButtons">\
                                    <ul>\
                                            <li><input type="button" value="OK" class="VarOKBtn VarBtn"/></li>\
                                            <li><input type="button" value="Cancel" class="VarCancelBtn VarBtn"/></li>\
                                    </ul>\
                            </div>\
                    </div>\
    <!--\
    *************************************************************************************************\
             ***************************** Variable selection html end *********************************\
    *************************************************************************************************\
    -->\
\
');

document.write
('\
	<!--\
    *************************************************************************************************\
             ************ This is hexpad html. Add this anywhere in index page **************************\
    *************************************************************************************************\
    -->\
                    <div id="dialog-modal-hex" title="Numeric Entry Pad" style="display:none">\
                            <input id="hexInput" type="text" class="InputValue"/>\
                            <div id="NumpadDiv">\
                                    <ul>\
                                            <li><input type="button" class="Numpad" id="Hexpad-7" value="7"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-8" value="8"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-9" value="9"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-4" value="4"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-5" value="5"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-6" value="6"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-1" value="1"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-2" value="2"/></li>\
                                            <li><input type="button" class="Numpad" id="Hexpad-3" value="3"/></li>\
						<li class="HexNumpad"><input type="button" class="Numpad" id="Hexpad-D" text = "D" value="D"/></li>\
					<li><input type="button" class="Numpad" id="Hexpad-E" value="E"/></li>\
					<li><input type="button" class="Numpad" id="Hexpad-F" value="F"/></li>\
					<li><input type="button" class="Numpad" id="Hexpad-A" value="A"/></li>\
					<li><input type="button" class="Numpad" id="Hexpad-B" value="B"/></li>\
					<li><input type="button" class="Numpad" id="Hexpad-C" value="C"/></li>\
					<li class="Numpad0"><input type="button" class="Numpad" id="Hexpad-0" value="0"/></li>\
                                    </ul>\
                            </div>\
                            <div id="NumpadFunctionBtns">\
                                    <ul>\
                                            <li><input type="button" value="OK" class="OKBtn WButton"/></li>\
                                            <li><input type="button" value="Clear" class="ClearBtn WButton"/></li>\
                                            <li><input type="button" value="Cancel" class="CancelBtn WButton"/></li>\
                                    </ul>\
                            </div>\
                    </div>\
    <!--\
    *************************************************************************************************\
            *********************************** hexpad html end ****************************************\
    *************************************************************************************************\
    -->\
\
');

function openNumPad(minRange, maxRange, title, instructions, decimal, base)
{    
	//set variables to input or defaults.
	if(typeof minRange === 'undefined')
	{
  		this.minRange = 0;	
	}
	else
	{
		this.minRange = minRange;	
	}

	if(typeof maxRange === 'undefined')
	{
  		this.maxRange = 300;
	}
	else
	{
		this.maxRange = maxRange;
	}

	if(typeof title === 'undefined')
	{
  		this.title = "Bravely Default";	
	}
	else
	{
		this.title = title;
	}

	if(typeof instructions === 'undefined')
	{
  		this.instructions = "do things";
	}
	else
	{
		this.instructions = instructions;
	}

	if(typeof decimal === 'undefined')
	{
  		this.decimal = false;
	}
	else
	{
		this.decimal = decimal;
	}
	if(typeof base === 'undefined')
	{
  		this.base = 10;	
	}
	else
	{
		this.base = base;
	}
	if(this.base == 2)
	{
		//does nothing as of yet.
		dialogsDefer = $.Deferred();
		return dialogsDefer;
	}
	else if(this.base == 16)
	{
		//set variables
		$( "#dialog-modal-hex" ).title =this.title;
		$( "#dialog-modal-hex" ).val(0);
		$("input.InputValue").val(0);
		$( "#dialog-modal-hex" ).data('minRange', this.minRange);
		$( "#dialog-modal-hex" ).data('maxRange', this.maxRange);
		//TODO: instructions should be a text field, not data.
		$( "#dialog-modal-hex" ).data('instructions', this.instructions);
		console.log($( "#dialog-modal-hex" ).data('base', this.base));
		dialogsDefer = $.Deferred();
    		$( "#dialog-modal-hex" ).dialog(
					{
						height: 280,
						width: 350,
						modal: true
					});
		return dialogsDefer.promise();
	}
	else //Default of base 10
	{
		//set variables
		$( "#dialog-modal-num" ).title =this.title;
		$( "#dialog-modal-num" ).val(0);
		$("input.InputValue").val(0);
		$( "#dialog-modal-num" ).data('minRange', this.minRange);
		$( "#dialog-modal-num" ).data('maxRange', this.maxRange);
		$( "#dialog-modal-num" ).data('instructions', this.instructions);
		$( "#dialog-modal-num" ).data('base', this.base);
		dialogsDefer = $.Deferred();
    		$( "#dialog-modal-num" ).dialog(
					{
						height: 280,
						width: 350,
						modal: true
					});
		return dialogsDefer.promise();
	}
}

//Does nothing as of yet.
function openAlert(title, alert)
{
	dialogsDefer = $.Deferred();
	return dialogsDefer.promise();
}

//Does nothing as of yet.
function openSelector(title, array)
{
	dialogsDefer = $.Deferred();
	//clear options.
	$("#VarsDialogSelect").find('option').remove();
	for(var i=0; i<array.length;i++)
	{
		$("#VarsDialogSelect")
         .append($("<option></option>")
         .val(array[i])
         .text(array[i]));
	}
	//Resets data string.
	$( "#VarsDialogSelect" ).data("selected", new String());
	dialogmodalVars = $( "#dialog-modal-Vars" ).dialog({
						height: 280,
						width: 350,
						modal: true
					});
	//Note: although it appears strange,
	//using.dialog seems to create the dialog
	//with all elements visually present, but 
	//then removes all of them.
	$("#VarsDialogSelect").find('option').remove();
	for(var i=0; i<array.length;i++)
	{
		$("#VarsDialogSelect")
         .append($("<option></option>")
         .val(array[i])
         .text(array[i]));
	}
	return dialogsDefer.promise();
}

//Does nothing as of yet.
function opentringPad(title, instructions)
{
	dialogsDefer = $.Deferred();
	return dialogsDefer.promise();
}

function numExample()
{
	openNumPad(30, null, "This is a test", "Do things", false, 10).done(function(returned) {
		alert(returned);
	});
}

function hexExample()
{
	openNumPad(-1, 1000, "Hexpad test", "Do more things", false, 16).done(function(returned) {
		alert(returned);
	});
}

function selectorExample()
{
	var list = new Array();
	list[0] = "pick me";
	list[1] = "don't pick me";
	list[2] = "I have no strong feelings one way or the other.";
	openSelector("This is a selector", list).done(function(returned)
	{
		alert(returned);
	});
}

function convertBase(number, base)
{
	var total = 0;
	for(var i =0; i<=number.length-1; i++)
	{
		switch(number.charAt(number.length-1-i))
		{
			case '0':
				total = total+Math.pow(base,i)*0;
				break;
			case '1':
				total = total+Math.pow(base,i)*1;
				break;
			case '2':
				total = total+Math.pow(base,i)*2;
				break;
			case '3':
				total = total+Math.pow(base,i)*3;
				break;
			case '4':
				total = total+Math.pow(base,i)*4;
				break;
			case '5':
				total = total+Math.pow(base,i)*5;
				break;
			case '6':
				total = total+Math.pow(base,i)*6;
				break;
			case '7':
				total = total+Math.pow(base,i)*7;
				break;
			case '8':
				total = total+Math.pow(base,i)*8;
				break;
			case '9':
				total = total+Math.pow(base,i)*9;
				break;
			case 'A':
				total = total+Math.pow(base,i)*10;
				break;
			case 'B':
				total = total+Math.pow(base,i)*11;
				break;
			case 'C':
				total = total+Math.pow(base,i)*12;
				break;
			case 'D':
				total = total+Math.pow(base,i)*13;
				break;
			case 'E':
				total = total+Math.pow(base,i)*14;
				break;
			case 'F':
				total = total+Math.pow(base,i)*15;
				break;
			default:
				total = 0;
		}
	}
	return total;
}

function translateBase(number, base)
{
	var returned = new String();
	var currentPlace;
	while(number>base)
	{
		currentPlace = number%base;
		if(currentPlace<10)
		{
			returned = currentPlace.toString() + returned;
		}
		switch(currentPlace)
		{
			case 10:
				returned = "A"+returned;
				break;
			case 11:
				returned = "B"+returned;
				break;
			case 12:
				returned = "C"+returned;
				break;
			case 13:
				returned = "D"+returned;
				break;
			case 14:
				returned = "E"+returned;
				break;
			case 15:
				returned = "F"+returned;
				break;
		}
		number = Math.floor(number/base);
	}
		currentPlace = number;
		if(currentPlace<10)
		{
			returned = currentPlace.toString() + returned;
		}
		switch(currentPlace)
		{
			case 10:
				returned = "A"+returned;
				break;
			case 11:
				returned = "B"+returned;
				break;
			case 12:
				returned = "C"+returned;
				break;
			case 13:
				returned = "D"+returned;
				break;
			case 14:
				returned = "E"+returned;
				break;
			case 15:
				returned = "F"+returned;
				break;
			default:
				returned = currentPlace.toString() + returned;
		}
		return returned;
}