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
            throw new Error(ERRORS.invalid_value);
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
     * @param {number} hand_pos The position of the card in hand that these buttons belong to.
     * @param {string=} extra_info Optional extra information to display when the card info button is clicked.
     */
    show_buttons(table_name, hand_pos, extra_info = ``){
        display.remove_children(table_name);
        say(``, false);
        var make_press_button = function(hand_position){
            return function(button){
                if(display.shift_is_pressed){
                    var t = telegraph_card(button.behavior, GS.map);
                    GS.map.clear_telegraphs();
                    GS.map.display_telegraph(t.moves, `${IMG_FOLDER.actions}move_telegraph.png`);
                    GS.map.display_telegraph(t.attacks, `${IMG_FOLDER.actions}hit_telegraph.png`);
                    GS.map.display_telegraph(t.stun, `${IMG_FOLDER.actions}confuse.png`);
                    GS.map.display_telegraph(t.healing, `${IMG_FOLDER.actions}heal.png`);
                    GS.map.display_telegraph(t.teleport, `${IMG_FOLDER.actions}teleport_telegraph.png`);
                    GS.map.display();
                }
                else if(button.behavior){
                    GS.player_turn(button.behavior, hand_position);
                }
            }
        }
        var explain_moves = function(extra_text, card){
            var text = `${extra_text}${card.explain_card()}`;
            return function(){
                say(text, false);
            }
        }
        
        var press_button = make_press_button(hand_pos);
        for(var button of this.#buttons){
            display.add_button_row(table_name, button, press_button)
        }
        display.add_on_click(UIIDS.move_info, explain_moves(extra_info, this));
    }
    /**
     * Creates an explanation of what each button does.
     * @returns {String} The explanation.
     */
    explain_card(){
        var explanation = card_explanation_start;
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
        return explanation.concat(card_explanation_end);
    }
    /**
     * A helper function to infer the number (1-9) on the 3x3 button grid where a new button should go.
     * @param {string} direction String used to make the inference.
     * @returns {number} Returns the number (1-9) if it can be infered and -1 if it can't.
     */
    #convert_direction(direction){
        var direction_list = [NW, N, NE, W, C, E, SW, S, SE];
        var index = direction_list.indexOf(direction);
        if(index >= 0){
            return index + 1;
        }
        if(direction === SPIN){
            return 5;
        }
        return -1;
    }
    /**
     * Function to convert a card into an instant.
     */
    make_instant(){
        for(var row of this.#buttons){
            for(var button of row){
                if(button.description !== null_move_button && 
                    button.behavior.length > 0 && 
                    button.behavior[button.behavior.length - 1].type !== `instant`
                ){
                    button.behavior.push(pinstant(0, 0));
                }
            }
        }
    }
}