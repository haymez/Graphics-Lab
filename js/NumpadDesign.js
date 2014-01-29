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
                            <label class="GeneralLabel">\
                                    Enter up to 3 digits\
                            </label>\
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
