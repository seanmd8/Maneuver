// ----------------ButtonGrid.js----------------
// The ButtonGrid class is used to keep track of the possible moves a card has.
class ButtonGrid{
    buttons; // A 3x3 2d array used to store the options.
    constructor(){
        this.buttons =  [[0, 0, 0],
                    [0, 0, 0], 
                    [0, 0, 0]];
    }
    add_button(description, commands, number = -1){
        // Adds a description and a list of commands to one of the buttons.
        // Throws error of the button number is out of range.
        if(number === -1){
            // If the button that should be edited is not provided, it will be infered from the description if possible.
            number = this.#convert_direction(description);
        }
        if(number < 1 || number > 9){
            throw new Error("button out of range");
        }
        var button = [description, commands];
        this.buttons[Math.floor((number - 1) / 3)][(number - 1) % 3] = button;
    }
    show_buttons(table_name, hand_pos){
        // Displays the 3x3 grid to the given table.
        // When one of the buttons with functionality is clicked, the corresponding actions will be performed then it will be discarded.
        clear_tb(table_name);
        for(var i = 0; i < this.buttons.length; ++i){
            var row = document.createElement("tr");
            row.id = "button row " + i;
            for(var j = 0; j < this.buttons[i].length; ++j){
                var cell = document.createElement("input");
                cell.type = "button";
                if(!(this.buttons[i][j] === 0)){
                    // If the button has info, that description and list of commands will be used.
                    cell.name = this.buttons[i][j][0];
                    cell.value = this.buttons[i][j][0];
                    var act = function(behavior, hand_pos){return function(){action(behavior, hand_pos)}};
                    cell.onclick = act(this.buttons[i][j][1], hand_pos);
                }
                else{
                    // If it doesn't have info, a "--" button with no onclick will be used.
                    cell.name = "--";
                    cell.value = "--";
                }
                row.append(cell);
            }
            document.getElementById(table_name).append(row);
        }
    }
    #convert_direction(direction){
        // Converts a short direction string into the number of the button it should use.
        // Returns -1 if the string doesn't match one in the list.
        var dir_list = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];
        for(var i = 0; i < dir_list.length; ++i){
            if(direction === dir_list[i]){
                return i + 1;
            }
        }
        return -1;
    }
}