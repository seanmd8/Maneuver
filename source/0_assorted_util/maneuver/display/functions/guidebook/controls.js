/**
 * Function to get an array of buttons with the keys used for controls as the value to use when displaying the guide.
 * @returns {HTMLElement[]} The array of buttons.
 */
function get_control_symbols(){
    var current_controls = GS.data.controls.get();
    var button_symbols = [...current_controls.stage.card, ...current_controls.stage.direction];
    var buttons = [];
    for(var symbol of button_symbols){
        buttons.push(display.create_button(symbol, `${symbol} key`));
    }
    return buttons;
}