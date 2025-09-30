// ----------------ButtonGrid.js----------------
// The ButtonGrid class is used to keep track of the possible moves a card has.

class ButtonGrid{
    #buttons; // A 3x3 2d array used to store the options.
    #instant;
    constructor(){
        this.#instant = false;
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
     * A function to return the information required to display the buttons.
     * @param {number} hand_position The position of the card in hand that these buttons belong to.
     */
    show_buttons(hand_position){
        var grid = [];
        var telegraph = function(behavior){
            return function(){
                var t = telegraph_card(behavior, GS.map, GS.map.get_player_location());
                GS.map.clear_telegraphs();
                GS.map.mark_telegraph(t.moves, `${IMG_FOLDER.actions}move_telegraph.png`);
                GS.map.mark_telegraph(t.attacks, `${IMG_FOLDER.actions}hit_telegraph.png`);
                GS.map.mark_telegraph(t.stun, `${IMG_FOLDER.actions}confuse.png`);
                GS.map.mark_telegraph(t.healing, `${IMG_FOLDER.actions}heal.png`);
                GS.map.mark_telegraph(t.teleport, `${IMG_FOLDER.actions}teleport_telegraph.png`);
                display_map(GS.map);
            }
        }
        var click = function(behavior){
            return function(){
                if(behavior != undefined){
                    GS.player_turn(behavior, hand_position);
                }
            }
        }
        for(var row of this.#buttons){
            grid.push(row.map(button => {
                return {
                    description: button.description,
                    alt_click: telegraph(button.behavior),
                    on_click: click(button.behavior),
                }
            }));
        }
        return grid;
    }
    /**
     * Creates an explanation of what each button does.
     * @returns {String} The explanation.
     */
    explain_buttons(){
        var explanation = move_types.intro;
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
        this.#instant = true;
    }
    /**
     * Function to check to see if it is an instant.
     * @returns {boolean} If it is an instant.
     */
    is_instant(){
        return this.#instant;
    }
    get_behavior(num){
        if(num < 1 || 9 < num){
            throw new Error(ERRORS.invalid_value);
        }
        --num;
        return this.#buttons[Math.floor(num / 3)][num % 3].behavior;
    }
}