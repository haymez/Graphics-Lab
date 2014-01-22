var CurrentID = ""; //Global Variable to identify the clicked object

$(document).on('click', "a.Clickable" , function() 
{
	CurrentID = $(this).attr("id");
	if (CurrentID.substring(0,5)=="start")
	{
		$( "#dialog-modal-num" ).dialog(
		{
			height: 280,
			width: 350,
			modal: true
		});
	}
	else if (CurrentID.substring(0,6)=="lclick")
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
	if ((parseInt(NewVal))>300)
		NewVal="300";
	$("input.InputValue").val(NewVal);	
});

$(document).on('click', "input.ClearBtn" , function() 
{
	ClearInput();	
});

$(document).on('click', "input.CancelBtn" , function() 
{
	$( "#dialog-modal-num" ).dialog("close");
});

$(document).on('click', "input.OKBtn" , function() 
{
	var Attrb = CurrentID;
	var Value = $("input.InputValue").val();
	if ((Attrb.substring(0,5)=="start"))
	{
		$("#"+Attrb).html(Value);
		$( "#dialog-modal-num" ).dialog("close");
	}
	else if ((Attrb.substring(0,6)=="lclick"))
	{
		$("#"+Attrb).html(Value);	
	}
	else
	{
		alert('There was an error!');
	}
	return;	
});


$(document).on('click', "input.VarOKBtn" , function() 
{
	var VarName = $('#VarsDialogSelect :selected').text();
	if (VarName=="")
	{
		alert("Please select one variable name.");
	}
	else
	{
		var Attrb = CurrentID;
		$("#"+Attrb).html(VarName);
		$( "#dialog-modal-Vars" ).dialog("close");
	}
});

$(document).on('click', "input.VarCancelBtn" , function() 
{
		$( "#dialog-modal-Vars" ).dialog("close");
});

function ClearInput()
{
	$("input.InputValue").val("");
}

function CreateDialogOptions(Options)
{
	//Here change Options2 to the name of array variable that holds all the current variables
	//var Options2 = YourVariable;
	var Options2 = ["Var1", "var2", "l3", "c2", "sth"];
	var i = 0;
	var OptionVals = "";
	for (i = 0; i < Options2.length; i++)
	{
		OptionVals = OptionVals+"<option>"+Options2[i]+"</option>";
	}
	$("select#VarsDialogSelect").html(OptionVals);
	return;
}

