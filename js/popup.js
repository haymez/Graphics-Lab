var CurrentID = ""; //Global Variable to identify the clicked object
var CurrentVal = "";
$(document).on('click', "a.Clickable" , function() 
{
	CurrentID = $(this).attr("id");
	CurrentVal = $(this).html();
	if ((CurrentID.substring(0,5)=="start") || (CurrentID.substring(0,3)=="end")) 
	{
		$( "#dialog-modal-num" ).dialog(
		{
			height: 280,
			width: 350,
			modal: true
		});
	}
	else if ((CurrentID.substring(0,6)=="lclick") || (CurrentID.substring(0,6)=="cclick") || (CurrentID.substring(0,6)=="gclick") || (CurrentID.substring(0,6)=="pclick") || (CurrentID.substring(0,4)=="draw"))
	{
		CreateDialogOptions();
		$( "#dialog-modal-Vars" ).dialog(
		{
			height: 280,
			width: 350,
			modal: true
		});	
	}

});

$(document).on('click', "input.Numpad" , function() 
{
	var Val = $(this).val();
	var Current = $("input.InputValue").val();
	var NewVal = Current+""+Val;
	if (NewVal.length>3)
		NewVal = NewVal.substring(1, 4);
	$("input.InputValue").val(NewVal);
});

$(document).on('click', "input.ClearBtn" , function() 
{
	$("input.InputValue").val("");
});

$(document).on('click', "input.CancelBtn" , function() 
{
	$( "#dialog-modal-num" ).dialog("close");
});

$(document).on('click', "input.OKBtn" , function() 
{
	var input = $("input.InputValue").val();
	
	if (input > 300) {
	    $("#dialog-modal-num").dialog("close");
	    alert("Please choose a value less than or equal to 300");
	    $("input.InputValue").val("");
	    $("#dialog-modal-num").dialog("open");
	}
	else {
	    CurrentElement.html(parseInt(input));
        $("#dialog-modal-num").dialog("close");
	}
	//return;	
});

//User clicked Okay on a variable selector TODO: finish this
$(document).on('click', "input.VarOKBtn" , function() 
{
	var varName = $('#VarsDialogSelect :selected').text();
	if (rowToString(currRow).indexOf("draw") == -1) {
		if (varName.indexOf("d") >= 0) {
			codeTable.deleteRow(currRow);
			addNewRow(currRow, [varName, "&nbsp;=&nbsp;", 'X']);
		}
		else if (varName.indexOf("p") >= 0) {
			alert("add point stuff");
			
		}
		else if (varName.indexOf("l") >= 0) {
			alert("add line stuff");
		}
		else if (varName.indexOf("c") >= 0) {
			alert("add circle stuff");
		}
		else if (varName.indexOf("g") >= 0) {
			alert("add polygon stuff");
		}
		$( "#dialog-modal-Vars" ).dialog("close");
	}
	else {
		if (varName=="") {
			alert("Please select one variable name.");
		}
		else {
			CurrentElement.html(varName);	
			$( "#dialog-modal-Vars" ).dialog("close");
		}	
	}
});

$(document).on('click', "input.VarCancelBtn" , function() 
{
		$( "#dialog-modal-Vars" ).dialog("close");
});

function CreateDialogOptions(list) {
	$("select#VarsDialogSelect").html(list);
}

