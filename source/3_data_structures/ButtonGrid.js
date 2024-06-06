// ----------------ButtonGrid.js----------------
// The ButtonGrid class is used to keep track of the possible moves a card has.

class ButtonGrid{
    #buttons; // A 3x3 2d array used to store the options.
    constructor(){
        var initial = {
            description: null_move_button
        }
        this.#buttons = [[initial, initial, initial],
                        [initial, initial, initial], 
                        [initial, initial, initial]];
    }
    /**
     * A function to add behavior to a button.
     * @param {string} description Text that should appear on the button.
     * @param {PlayerCommand[]} behavior An array of commands for the player to follow when the button is clicked.
     * @param {number} [number = -1] Which spot on the 3x3 grid (numbered 1-9) the button should appear on. 
     *                                  If it is blank or -1, the position will be infered from the description.
     */
    add_button(description, behavior, number = -1){
        // Adds a description and a list of commands to one of the buttons.
        // Throws error of the button number is out of range.
        if(number === -1){
            // If the button that should be edited is not provided, it will be infered from the description if possible.
            number = this.#convert_direction(description);
        }
        if(number < 1 || number > 9){
            throw new Error(`button out of range`);
        }
        var button = {
            description,
            behavior
        }
        this.#buttons[Math.floor((number - 1) / 3)][(number - 1) % 3] = button;
    }
    /**
     * A function to display the grid of buttons to a table.
     * @param {string} table_name The location where the buttons should be displayed.
     * @param {number} hand_pos the position of the card in hand that these buttons belong to.
     */
    show_buttons(table_name, hand_pos){
        // Displays the 3x3 grid to the given table.
        // When one of the buttons with functionality is clicked, the corresponding actions will be performed then it will be discarded.
        display.clear_tb(table_name);
        display.display_message(UIIDS.display_message, ``);
        var make_press_button = function(hand_position){
            return function(button, position){
                if(button.behavior){
                    GS.player_turn(button.behavior, hand_position)
                }
            }
        }
        var explain_moves = function(card){
            var text = card.explain_card()
            return function(){
                display.display_message(UIIDS.display_message, text);
            }
        }
        
        var press_button = make_press_button(hand_pos);
        for(var i = 0; i < this.#buttons.length; ++i){
            display.add_button_row(table_name, this.#buttons[i], press_button)
        }
        display.add_on_click(UIIDS.move_info, explain_moves(this));
    }
    /**
     * Creates an explanation of what each button does.
     * @returns {String} The explanation.
     */
    explain_card(){
        var explanation = `Move Options (actions will be performed in order):\n`;
        for(let row of this.#buttons){
            for(let button of row){
                if(button.description !== null_move_button){
                    var commands = button.behavior.map((b) => `(${explain_action(b)})`);
                    if(commands.length === 0){
                        commands = [`(${move_types.nothing})`];
                    }
                    var command_str = commands.join(`, ${NBS}`); // Non breaking spaces used so they won't be collapsed.
                    explanation = explanation.concat(`${NBS}${NBS}${NBS}${NBS}-${button.description}: ${command_str}\n`);
                }
            }
        }
        return explanation;
    }
    /**
     * A helper function to infer the number (1-9) on the 3x3 button grid where a new button should go.
     * @param {string} direction String used to make the inference.
     * @returns {number} Returns the number (1-9) if it can be infered and -1 if it can't.
     */
    #convert_direction(direction){
        var direction_list = [NW, N, NE, W, C, E, SW, S, SE];
        for(var i = 0; i < direction_list.length; ++i){
            if(direction === direction_list[i]){
                return i + 1;
            }
        }
        if(direction === SPIN){
            return 5;
        }
        return -1;
    }
}