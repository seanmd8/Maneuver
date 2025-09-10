/**
 * Function to give a message to the user.
 * @param {string} msg message text.
 */
function say(msg){
    display.display_message(UIIDS.display_message, msg);
}

function say_record(msg, type = record_types.normal){
    say(msg);
    GS.record_message(msg, type);
}