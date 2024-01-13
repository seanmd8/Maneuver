// ----------------ButtonGrid.js----------------
// The ButtonGrid class is used to keep track of the possible moves a card has.

class ButtonGrid{
    #buttons; // A 3x3 2d array used to store the options.
    constructor(){
        var initial = {
            description: `--`
        }
        this.#buttons = [[initial, initial, initial],
                        [initial, initial, initial], 
                        [initial, initial, initial]];
    }
    /**
     * @param {string} description 
     * @param {PlayerCommand[]} behavior 
     * @param {number} [number = 1]
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
     * @param {string} table_name 
     * @param {number} hand_pos 
     */
    show_buttons(table_name, hand_pos){
        // Displays the 3x3 grid to the given table.
        // When one of the buttons with functionality is clicked, the corresponding actions will be performed then it will be discarded.
        display.clear_tb(table_name);

        var make_press_button = function(hand_position){
            return function(button){
                if(button.behavior){
                    GS.player_turn(button.behavior, hand_position)
                }
            }
        }
        var press_button = make_press_button(hand_pos);
        for(var i = 0; i < this.#buttons.length; ++i){
            display.add_button_row(table_name, this.#buttons[i], press_button)
        }
    }
    /**
     * @param {string} direction 
     * @returns {number}
     */
    #convert_direction(direction){
        // Converts a short direction string into the number of the button it should use.
        // Returns -1 if the string doesn't match one in the list.
        var dir_list = [NW, N, NE, W, C, E, SW, S, SE];
        for(var i = 0; i < dir_list.length; ++i){
            if(direction === dir_list[i]){
                return i + 1;
            }
        }
        return -1;
    }
}