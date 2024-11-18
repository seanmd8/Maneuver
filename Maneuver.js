// @ts-check
// ----------------GeneralUtil.js----------------
// File for utility functions not connected to any specific project.

/**
 * Function to wait a set amount of time before continuing.
 * @param {number} milliseconds How long to wait in milliseconds.
 * @returns {Promise<*>} Resolves when the time is up.
 */
function delay(milliseconds){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, milliseconds);
    })
}
/**
 * Creates an array by drawing random elements from another with no repeats.
 * @template T
 * @param {T[]} source Array to draw from.
 * @param {number} draws Number of draws. If it is larger than source.length, then source.length will be used instead.
 * @returns {T[]} Array of random draws.
 */
function rand_no_repeates(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        var rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
/**
 * Wraps a string so each line has a maximum number of characters before automatically inserting a newline character.
 * @param {string} message The string to be wrapped.
 * @param {number} wrap_length How many characters maximum.
 * @param {string} [delimiter = undefined] Optional parameter for the delimiter. 
 *                                      If provided, then blocks of text in between delimiters will not be broken up.
 * @returns {string} The wrapped string.
 */
function wrap_str(message, wrap_length, delimiter = undefined){
    var new_message = ``;
    var str_arr = [];
    if(message.indexOf(`\n`) > -1){ // If it already has new line characters, 
        str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message += `${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){ // if there is no delimiter
        var start = 0;
        while(start < message.length){
            var end = Math.min(message.length, start + wrap_length);
            str_arr.push(message.slice(start, end));
            start = end;
        }
        for(var i = 0; i < str_arr.length; ++i){
            new_message += `${str_arr[i]}\n`
        }
    }
    else{ // if there is a delimiter
        str_arr = message.split(delimiter);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line += `${str_arr[i]}${delimiter}`;
            if(line.length > wrap_length){
                new_message += `${line.slice(0, -1 * delimiter.length)}\n`
                line = ``;
            } 
        }
        if(line.length > 0){
            new_message += `${line.slice(0, -1 * delimiter.length)}\n`
        } 
    }
    return new_message.slice(0, -1);
}
/**
 * @overload Returns 1 if num is positive, -1 if it is negative, 0 if it is 0.
 * @param {number} num
 * @return {number}
 * 
 * @overload Returns a new point with it's x and y the sign of the one passed in.
 * @param {Point} num
 * @return {Point}
 * 
 * @param {*} num
 * @returns {*}
 */
function sign(num){
    // Returns whether num is positive, negative, or 0
    if(typeof num === `number`){
        if(num > 0){
            return 1;
        }
        if(num < 0){
            return -1;
        }
        return 0;
    }
    else{
        return new Point(sign(num.x), sign(num.y));
    }
}
/**
 * @returns {number} randomly returns 1 or -1.
 */
function random_sign(){
    return 2 * random_num(2) - 1;
}
/**
 * Function to return a copy of a array with it's order randomized.
 * @template T
 * @param {T[]} arr Array to randomize.
 * @returns {T[]} Randomized copy.
 */
function randomize_arr(arr){
    // Returns a copy of the given array with it's order randomized.
    arr = [...arr];
    var random_arr = [];
    while(arr.length > 0){
        var index = random_num(arr.length);
        random_arr.push(arr[index]);
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
    return random_arr;
}
/**
 * Function to return a copy of an array with it's order reversed.
 * @template T
 * @param {T[]} arr Array to be reversed.
 * @returns {T[]} Reversed array.
 */
function reverse_arr(arr){
    var new_arr = [];
    for(var i = arr.length - 1; i >= 0; --i){
        new_arr.push(arr[i]);
    }
    return new_arr;
}
/**
 * Function to return a random integer 0 <= r < x
 * @param {number} x The return should be less than this.
 * @returns {number} The random number.
 */
function random_num(x){
    return Math.floor(Math.random() * x);
}
/**
 * Function to check if the contents of two arrays are ===.
 * @param {[]} a1 The first array to be compared.
 * @param {[]} a2 the second array to be compared.
 * @returns {boolean} Returns true if the elements at each index in both arrays === the element at the same index of the other.
 */
function array_equals(a1, a2){
    if(!(a1.length === a2.length)){
        return false;
    }
    for(var i = 0; i < a1.length; ++i){
        if(!(a1[i] === a2[i])){
            return false;
        }
    }
    return true;
}
/**
 * Function to make sure a value is not undefined.
 * @template A
 * @param {A | undefined} exists 
 * @returns {A}
 */
function ifexists(exists){
    if(exists === undefined){
        throw new Error(`value is undefined.`)
    }
    return exists;
}

// ----------------Point.js----------------
// File contains Point class and associated functions.

/**
 * @callback PointOp Function that simulates a binary operation between this point a point or number passed in.
 * @param {Point | number} p2 The other operand.
 *                      If p2 is a Point, the operation will be performed by matching their respective x and y values,
 *                      If p2 is a number, it will be used wherever either p2.x or p2.y would be used.
 * @returns {Point} Returns the resulting point.
 */

class Point{
    /** @type {number} The x value of the point. */
    x;
    /** @type {number} The y value of the point. */
    y;
    /**
     * @param {number} x The x value of the new point.
     * @param {number} y The y value of the new point.
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    /** @type {PointOp} Returns this + p2, which is a new point*/
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    /** @type {PointOp} Does this = this + p2, then returns this.*/
    plus_equals(p2){
        if(typeof p2 === `number`){
            this.x += p2;
            this.y += p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x += p2.x;
            this.y += p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /** @type {PointOp} Returns this - p2, which is a new point*/
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    /** @type {PointOp} Does this = this - p2, then returns this.*/
    minus_equals(p2){
        if(typeof p2 === `number`){
            this.x -= p2;
            this.y -= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x -= p2.x;
            this.y -= p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /** @type {PointOp} Returns this * p2, which is a new point*/
    times(p2){
        return this.copy().times_equals(p2);
    }
    /** @type {PointOp} Does this = this * p2, then returns this.*/
    times_equals(p2){
        if(typeof p2 === `number`){
            this.x *= p2;
            this.y *= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x *= p2.x;
            this.y *= p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /** @type {PointOp} Returns this * p2, which is a new point*/
    divide(p2){
        return this.copy().divide_equals(p2);
    }
    /** @type {PointOp} Does this = this * p2, then returns this.*/
    divide_equals(p2){
        if(typeof p2 === `number`){
            if(p2 === 0){
                throw new Error(ERRORS.divide_by_0);
            }
            this.x /= p2;
            this.y /= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            if(p2.x === 0 || p2.y === 0){
                throw new Error(ERRORS.divide_by_0);
            }
            this.x /= p2.x;
            this.y /= p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /**
     * Function to check if a point's x and y values both have an absolute value <= radius.
     * @param {number} radius How far away from 0 x and y can be.
     * @returns {boolean} If the point is <= radius far from (0, 0).
     */
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    /** @returns {Point} Returns a copy of this point.*/
    copy(){
        return new Point(this.x, this.y);
    }
    /**
     * @returns {number} The taxicab distance away from the origin.
     */
    taxicab_distance(){
        return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
     * Rotates a point by a multiple of 90 degrees around the origin.
     * @param {number} degrees How many degrees it should be rotated by. Must be a multiple of 90.
     * @returns {Point} A rotated copy of the point.
     */
    rotate(degrees){
        if(degrees % 90 !== 0){
            throw new Error(ERRORS.invalid_value);
        }
        degrees = degrees % 360;
        if(degrees === 0){
            return this.copy();
        }
        return new Point(this.y * -1, this.x).rotate(degrees - 90);
    }
    /**
     * @returns true if the point is on the x or y axis, false otherwise.
     * (0, 0) returns false.
     */
    on_axis(){
        var is_origin = point_equals(this, new Point(0, 0));
        return (this.x === 0 || this.y === 0) && !is_origin;
    }
    /**
     * @returns true if the point is on the lines y = x or y = -x, false otherwise.
     * (0, 0) returns false.
     */
    on_diagonal(){
        var is_origin = point_equals(this, new Point(0, 0));
        return Math.abs(this.x) === Math.abs(this.y) && !is_origin;
    }
}

/**
 * Checks to see if 2 points are equal.
 * @param {Point} p1 The first point to compare.
 * @param {Point} p2 The second point to compare.
 * @returns  {boolean} If the points are equal.
 */
function point_equals(p1, p2){
    if(p1.x !== undefined && p1.y !== undefined && p2.x !== undefined && p2.y !== undefined){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(ERRORS.invalid_type);
    }
}
// ----------------Const.js----------------
// File containing global constants used throughout the program.


// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;

// Settings just used for testing.
const SECOND_STARTING_ENEMY = spider_tile;
const SECOND_STARTING_ENEMY_AMOUNT = 0;
const STARTING_CHEST_CONTENTS = future_sight;
const STARTING_CHEST_AMOUNT = 0;
const CARDS_TO_TEST = [];

// Initialization settings.
const STARTING_ENEMY = spider_tile;
const STARTING_ENEMY_AMOUNT = 1;
const STARTING_DECK = CARDS_TO_TEST.length > 0 ? make_test_deck : make_starting_deck;
const STARTING_AREA = [generate_ruins_area];
var GS;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const CHEST_LOCATION = 3;
const BOON_CHOICES = 3;
const SAFE_SPAWN_ATTEMPTS = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const SMALL_CARD_SCALE = 75;
const CHEST_CONTENTS_SIZE = 120;
const TILE_SCALE = 40;
const INITIATIVE_SCALE = 50;
const CARD_SYMBOL_SCALE = 20;
const ANIMATION_DELAY = 160;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;




// Keyboard controls.
const CONTROLS = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`, `l`],
    alt: [`shift`, `shiftleft`, `shiftright`]
}
Object.freeze(CONTROLS);

// Image folder file structure.
const IMG_FOLDER = {
    src: `images/`,
    actions: `actions/`,
    backgrounds: `backgrounds/`,
    cards: `cards/`,
    other: `other/`,
    symbols: `symbols/`,
    tiles: `tiles/`,
    boons: `boons/`
}
Object.freeze(IMG_FOLDER);

const TAGS = {
    boss: `Boss`,
    unmovable: `Unmovable`,
    unstunnable: `Unstunnable`,
    hidden: `Hidden`,
    thorn_bush_roots: `Thorn Bush Roots`,
    nettle_immune: `Nettle Immune`
}
Object.freeze(TAGS);
// ----------------Display.js----------------
// File containing the display class which interacts with wherever the game is being displayed. 
// Currently the only way to display is via HTML, but if I wanted to port the game, this should
// make it easier to do without too much editing outside of this file and the uiid file. This also
// standardizes how information is displayed making it easier to create new display elements.

/**
 * @typedef {Object} CellInfo The info required to create a table cell with an image.
 * @property {string} pic The image to be displayed in the cell.
 * @property {string=} name If name is provided, it will be used as mouseover text.
 * @property {number=} rotate If rotate is provided (in 90 degree increments) the image will be rotated by that amount.
 * @property {boolean=} flip If flip is provided, the image will be flipped horizontally.
 */

/**
 * @typedef {Object} ButtonInfo The info required to create a button table cell.
 * @property {string} description The text to be displayed in the button.
 * @property {OnClickFunction=} on_click The function to be called when the button is clicked.
 */

/**
 * @callback OnClickFunction A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {Point} position The row and column of the element.
 */


/**
 * @callback NormalCallback A function with no args or returns.
 * @returns {void}
 */

/**
 * @typedef {Object} DropdownOption
 * @property {string} label The label that should be displayed in the dropdown menu.
 * @property {NormalCallback} on_change The function executed when this option is chosen.
 */

/**
 * @callback add_tb_row A function to add a row of images to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {CellInfo[]} row_contents The objects used to construct the row's contents.
 * @param {number} scale The size of the images.
 */

/**
 * @callback add_button_row A function to add a row of buttons to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {ButtonInfo[]} row_contents The objects used to construct the row's contents.
 */

/**
 * @callback display_message A function to display a message to an element.
 * @param {string} location The ID of the element to display the message to.
 * @param {string} message The message to be displayed.
 */

/**
 * @callback remove_children A function to remove all rows from a table.
 * @param {string} location The ID of the table to remove rows from.
 */

/**
 * @callback swap_screen A function to swap which div from a group is visible
 * @param {string[]} divisions An array of div names to set to invisible.
 * @param {string} [screen = undefined] Optional parameter for the ID of a div to set to visible.
 */

/**
 * @callback select A function to outline one image from a row of images in a table.
 * @param {string} location The ID of the table.
 * @param {number} row_num The row number of the image.
 * @param {number} column_num The column number of the image.
 */

/**
 * @callback press A function to handle keyboard controls.
 * @param {KeyboardEvent} key_press The keystroke to handle.
 */

/**
 * @callback create_visibility_toggle A function to create a section of text that can be minimized with the press of a button.location, header, body
 * @param {string} location Where to create the section.
 * @param {string} header What the section is called.
 * @param {HTMLElement} body_elemnt The text to display in the section.
 */

/**
 * @callback create_dropdown A function to create a dropdown menu where the user can select an option.
 * @param {string} location Where the dropdown menu should be added to.
 * @param {DropdownOption[]} options_arr An array of each label and associated function that make up the dropdown menu.
 */

/**
 * @callback create_alternating_text_section A function to create a section of interspersed text with images and other elements.
 * @param {string} location The id of the div element to put the section in.
 * @param {string} header The header to give the section. The div id will be of the form `${header} section`.
 * @param {string[]} par_arr An array of the strings which other elements should be placed between.
 * @param {HTMLElement[]} inline_arr An array of other elements to be added inline inbetween the strings. 
 *                                  It's length should be 1 or 0 less than par_arr's.
 * @returns {string} The div id.
 */

/**
 * @callback create_button Creates and returns a button element.
 * @param {string} label The button text.
 * @param {string} id The element id.
 * @param {NormalCallback=} on_click If provided, called when it is clicked.
 * @returns {HTMLInputElement} The created button.
 */

/**
 * @callback create_image Creates and returns an image eleemnt.
 * @param {string} src The pic to display.
 * @param {string} id The element id
 * @param {number | Point} size How largethe pic should be.
 * @returns {HTMLImageElement} The created image.
 */

/**
 * @callback add_on_click Adds an on_click function to an element.
 * @param {string} location The id of the element to add an on_click to.
 * @param {function} on_click The function to call when the element is clicked on.
 */

/**
 * @typedef {Object} DisplayLibrary The library of functions used to handle displaying things in a specific language.
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {remove_children} remove_children
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
 * @property {create_visibility_toggle} create_visibility_toggle
 * @property {create_dropdown} create_dropdown
 * @property {create_alternating_text_section} create_alternating_text_section
 * @property {create_button} create_button
 * @property {create_image} create_image
 * @property {add_on_click} add_on_click
 */


/**
 * A function to get the display library for a given language.
 * @param {string} language The language to get the library for.
 * @returns {DisplayLibrary}
 */
function get_display(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return DisplayHTML;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * @callback get_transformation A helper function to format all css transformation properties detailed by an object into a single string.
 * @param {CellInfo} to_display The object that contains which transformations to perform.
 * @returns {string} String that can be used to apply the appropriate transformations.
 */

/**
 * @callback html_constructor Typedef for a HTMLElement constructor
 * @returns {*}
 * 
 * @overload 
 * @param {string} location
 * @returns {HTMLElement}
 * 
 * @overload
 * @param {string} location
 * @param {html_constructor} type
 * @returns {HTMLElement}
 * 
 * @callback get_element Function to get a html element, make sure it's not void, and optionally make sure it is the correct type.
 * @param {string} location The ID of the element to get.
 * @param {function} [type = undefined] Optional constructor of the type of element it should be.
 * @returns {*} Returns the element which is optionally guarenteed to be the right type.
 */

/**
 * @typedef {Object} HTML_Helpers A collection of the helper functions used by the DisplayHTML library.
 * @property {get_transformation} get_transformation
 * @property {get_element} get_element
 */


/**
 * Library containing functions used to diplay things in HTML.
 * Implements DisplayLibrary.
 * @type {DisplayLibrary & HTML_Helpers}
 */
const DisplayHTML = {
    // Required functions.
    add_tb_row: function(location, row_contents, scale){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        row.style.height = `auto`;
        row.style.minHeight= `${scale}px`; 
        for(var i = 0; i < row_contents.length; ++i){
            var to_display = row_contents[i];
            // Make table cell
            var cell = document.createElement(`td`);
            cell.id = `${location} ${row_num} ${i}`;
            cell.style.height = `${scale}px`;
            cell.style.width = `${scale}px`;
            cell.classList.add(`relative`);
            if(to_display.on_click !== undefined){
                cell.onclick = to_display.on_click;
            }
            if(to_display.name !== undefined){
                cell.title = to_display.name;
            }
            var layers = [];
            var image;
            // Foreground images
            if(to_display.foreground !== undefined){
                for(let pic of to_display.foreground){
                    image = document.createElement(`img`);
                    image.src = `${IMG_FOLDER.src}${pic}`;
                    layers.push(image);
                }
            }
            // Main image
            image = document.createElement(`img`);
            image.src = `${IMG_FOLDER.src}${to_display.pic}`;
            if(to_display.name !== undefined){
                image.alt = to_display.name;
            }
            image.style.transform = DisplayHTML.get_transformation(to_display);
            layers.push(image);
            // Background images
            if(to_display.background !== undefined){
                for(let pic of to_display.background){
                    image = document.createElement(`img`);
                    image.src = `${IMG_FOLDER.src}${pic}`;
                    layers.push(image);
                }
            }
            // Style/size images
            layers = layers.reverse();
            for(let layer of layers){
                layer.height = scale;
                layer.width = scale;
                layer.classList.add(`absolute`);
                cell.append(layer);
            }
            row.append(cell);
        }
        table.append(row);
    },
    add_button_row: function(location, row_contents){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        for(var i = 0; i < row_contents.length; ++i){
            var button = row_contents[i];
            row.append(DisplayHTML.create_button(button.description, `${location} ${row_num} ${i}`, button.on_click));
        }
        table.append(row);
    },
    display_message: function(location, message){
        var output = message;//wrap_str(message, TEXT_WRAP_WIDTH, ` `);
        DisplayHTML.get_element(location).innerText = output;
    },
    remove_children: function(location){
        var element = DisplayHTML.get_element(location);
        while(element.firstChild){
            element.removeChild(element.lastChild);
        }
    },
    swap_screen: function(divisions, screen = undefined){
        for(var i = 0; i < divisions.length; ++i){
            DisplayHTML.get_element(divisions[i], HTMLDivElement);
            display.remove_class(divisions[i], `visible-section`);
            display.add_class(divisions[i], `hidden-section`);
        }
        if(screen !== undefined){
            DisplayHTML.get_element(screen, HTMLDivElement);
            display.remove_class(screen, `hidden-section`);
            display.add_class(screen, `visible-section`);
        }
    },
    select: function(location, row_num, column_num){
        var row = DisplayHTML.get_element(`${location} row ${row_num}`, HTMLTableRowElement);
        var column_count = row.cells.length;
        for(var i = 0; i < column_count; ++i){
            DisplayHTML.get_element(`${location} ${row_num} ${i}`, HTMLTableCellElement).classList.remove("selected-element");
        }
        DisplayHTML.get_element(`${location} ${row_num} ${column_num}`, HTMLTableCellElement).classList.add("selected-element");
    },
    press: function(key_press){
        // Pick direction via keyboard.
        var key = key_press.key.toLowerCase();
        var key_num = CONTROLS.directional.indexOf(key);
        if(key_num >= 0){
            try{
                DisplayHTML.get_element(`${UIIDS.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`).click();
            }
            catch(error){
                if(error.message !== ERRORS.value_not_found){
                    throw error;
                }
            }
            
        }
        // Select card via keyboard.
        key_num = CONTROLS.card.indexOf(key);
        if(key_num >= 0){
            try{
                var element = DisplayHTML.get_element(`${UIIDS.hand_display} 0 ${key_num}`);
                element && element.click();
            }
            catch(error){
                if(error.message !== ERRORS.value_not_found){
                    throw error;
                }
            }
            
        }
        key_num = CONTROLS.alt.indexOf(key);
        if(key_num >= 0){
            display.shift_is_pressed = true;
        }
    },
    unpress: function(key_press){
        var key = key_press.key.toLowerCase();
        var key_num = CONTROLS.alt.indexOf(key);
        if(key_num >= 0){
            display.shift_is_pressed = false;
        }
    },
    create_visibility_toggle: function(location, header, on_click){
        var section = DisplayHTML.get_element(location);
        var element = document.createElement(`input`);
        element.type = `button`;

        element.value = header;
        element.onclick = on_click;
        section.append(element);
    },
    create_dropdown: function(location, options_arr){
        var doc_location = this.get_element(location);
        var select_button = document.createElement(`select`);
        var select_id = `${location} select`
        select_button.id = select_id;
        var select_func = function(options, select_id){
            var option_func_map = new Map()
            for(var option of options){
                option_func_map.set(option.label, option.on_change);
            }
            return function(){
                var select_element = DisplayHTML.get_element(select_id, HTMLSelectElement);
                var label = select_element.value;
                var chosen_option = option_func_map.get(label);
                if(chosen_option === undefined){
                    throw new Error("unrecognized value in select element");
                }
                chosen_option();
            }
        }
        select_button.onchange = select_func(options_arr, select_id);
        for(var option_data of options_arr){
            var option = document.createElement(`option`);
            option.value = option_data.label;
            option.innerText = option_data.label;
            select_button.append(option);
        }
        doc_location.append(select_button);
    },
    create_alternating_text_section: function(location, header, par_arr, inline_arr){
        if(par_arr.length !== inline_arr.length && par_arr.length !== inline_arr.length + 1){
            throw new Error(ERRORS.array_size);
        }
        var body_div = document.createElement(`div`);
        var body_div_id = `${header} section`;
        body_div.id = body_div_id;
        body_div.classList.add(`guidebook-section`)


        var body_header = document.createElement(`h2`);
        body_header.id = `${body_div_id} header`;
        body_header.innerText = `${header}:`;
        body_div.append(body_header);

        for(var i = 0; i < par_arr.length; ++i){
            var body_text = document.createElement(`p`);
            body_text.id = `${body_div_id} text ${i}`;
            body_text.innerText = wrap_str(par_arr[i], TEXT_WRAP_WIDTH, ` `);
            body_text.style.display = `inline`;
            body_div.append(body_text);
            if(i < inline_arr.length){
                inline_arr[i].id = `${body_div_id} non-text ${i}`
                inline_arr[i].style.display = `inline`;
                body_div.append(inline_arr[i]);
            }
        }
        var destination = DisplayHTML.get_element(location, HTMLDivElement);
        destination.append(body_div);
        return body_div_id;
    },
    create_button: function(label, id, on_click = undefined){
        var button = document.createElement(`input`);
        button.type = `button`;
        button.id = id;
        if(on_click !== undefined){
            button.onclick = on_click;
        }
        button.value = label;
        return button;
    },
    create_image: function(src, id, size){
        var image = document.createElement(`img`);
        image.src = `${IMG_FOLDER.src}${src}`;
        image.id = id;
        if(typeof size === `number`){
            image.width = size;
            image.height = size;
        }
        else{
            image.width = size.x;
            image.height = size.y;
        }
        return image;
    },
    add_on_click: function(location, on_click){
        var element = DisplayHTML.get_element(location);
        element.onclick = on_click;
    },
    add_class: function(location, css_class){
        var element = DisplayHTML.get_element(location);
        element.classList.add(css_class);
    },
    remove_class: function(location, css_class){
        var element = DisplayHTML.get_element(location);
        element.classList.remove(css_class);
    },
    create_stacked_p: function(location, strs){
        element = DisplayHTML.get_element(location);
        var hr = document.createElement(`hr`);
        element.append(hr);
        for(var str of strs){
            var p = document.createElement(`p`);
            p.innerText = str;
            element.append(p);
            hr = document.createElement(`hr`);
            element.append(hr);
        }
    },
    detect_keys: function(){
        document.onkeydown = display.press;
        document.onkeyup = display.unpress;
    },
    create_initiative: function(location, contents, size){
        location = DisplayHTML.get_element(location);
        for(let element of contents){
            let container = document.createElement(`div`);
            let picbox = document.createElement(`div`);
            let pic = document.createElement(`img`);
            let parbox = document.createElement(`div`);
            let par = document.createElement(`p`);

            container.classList.add(`initiative-element`);
            if(element.on_click !== undefined){
                container.onclick = element.on_click;
            }
            pic.src = `${IMG_FOLDER.src}${element.pic}`;
            pic.alt = element.name;
            pic.title = element.name;
            pic.style.height = `${size}px`;
            pic.style.width = `${size}px`;
            pic.style.transform = DisplayHTML.get_transformation(element);
            if(element.stun){
                pic.classList.add(`stun-background`);
            }
            par.innerText = element.str;

            picbox.append(pic);
            parbox.append(par);
            container.append(picbox);
            container.append(parbox);
            location.append(container);
        }
    },
    click(location){
        var element = DisplayHTML.get_element(location);
        if(element.onclick !== undefined){
            element.click();
        }
    },
    shift_is_pressed: false,

    // Non Required helper functions.
    get_transformation: function(to_display){
        var transformation = ``;
        if(to_display.rotate !== undefined){
            transformation += `rotate(${to_display.rotate}deg) `;
        }
        if(to_display.flip){
            transformation += `scaleX(-1) `;
        }
        return transformation;   
    },
    get_element: function(location, type = undefined){
        var element = document.getElementById(location);
        if(element === null){
            throw new Error(ERRORS.value_not_found);
        }
        if(type !== undefined && !(element instanceof type)){
            throw new Error(ERRORS.invalid_type);
        }
        return element
    }
}

// Set up the display library and the onkeydown function.
const display = get_display(MARKUP_LANGUAGE);

const NBS = `\u00a0`; // non-breaking space used for inserting multiple html spaces.


function display_boons(boon_list){
    // Updates the list of boons they have.
    display.remove_children(UIIDS.boon_list_table);
    var gained = boon_list.get_gained();
    display.add_tb_row(UIIDS.boon_list_table, gained, SMALL_CARD_SCALE);

    // Updates the list of used up boons.
    display.remove_children(UIIDS.removed_boon_table);
    var lost = boon_list.get_lost();
    display.add_tb_row(UIIDS.removed_boon_table, lost, SMALL_CARD_SCALE);
}

function display_move_buttons(card, hand_position){
    display.remove_children(UIIDS.move_buttons);
    var button_data = card.options.show_buttons(hand_position);
    for(let row of button_data){
        let button_row = row.map(button => {return {
            description: button.description,
            on_click: function(){
                display.shift_is_pressed ? button.alt_click() : button.on_click();
            }
        }});
        display.add_button_row(UIIDS.move_buttons, button_row);
    }
    display.add_on_click(UIIDS.move_info, function(){explain_card(card)});
}

/**
 * Displays the hand to it's proper location.
 */
function refresh_hand_display(deck){
    // Updates the hand.
    var card_row = deck.get_hand_info();
    display.remove_children(UIIDS.hand_display);
    display.add_tb_row(UIIDS.hand_display, card_row, CARD_SCALE);

    // Shows how many cards are left in your deck.
    var remaining = deck.get_deck_count();
    display.display_message(UIIDS.deck_count, `${remaining}`);

    // Makes sure the card info button shows that no card is selected.
    var explain_blank_moves = function(){
        say(blank_moves_message, false);
    }
    display.add_on_click(UIIDS.move_info, explain_blank_moves);
}
/**
 * Displays the discard pile to it's proper location.
 */
function refresh_discard_display(deck){
    var discard = deck.get_discard_info();
    display.remove_children(UIIDS.discard_pile_table);
    display.add_tb_row(UIIDS.discard_pile_table, discard, SMALL_CARD_SCALE);
}
/**
 * Displays the library to it's proper location.
 */
function refresh_deck_order_display(deck){
    var library = deck.get_library_info();
    display.remove_children(UIIDS.deck_order_table);
    display.add_tb_row(UIIDS.deck_order_table, [future_sight(), ...library], SMALL_CARD_SCALE);
}

function telegraph_repetition_boon(repeat){
    display.remove_class(UIIDS.hand_box, `telegraph-repetition`);
    display.remove_class(UIIDS.move_box, `telegraph-repetition`);
    display.remove_class(UIIDS.hand_box, `no-repetition`);
    display.remove_class(UIIDS.move_box, `no-repetition`);
    var class_name = repeat ? `telegraph-repetition` : `no-repetition`;
    display.add_class(UIIDS.hand_box, class_name);
    display.add_class(UIIDS.move_box, class_name);
}

function display_entire_deck(deck){
    // Display section header.
    var min_deck_size = deck.deck_min();
    display.display_message(UIIDS.current_deck, `${current_deck}${min_deck_size}):`);
    // Display deck with limited cards per line.
    var decklist = deck.get_deck_info();
    for(var i = 0; i < Math.ceil(decklist.length / DECK_DISPLAY_WIDTH); ++i){
        var row = decklist.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH);
        display.add_tb_row(UIIDS.display_deck, row, CARD_SCALE);
    }

}

function display_map(map){
    // Updates the GameMap display.
    display.remove_children(UIIDS.map_display);
    var grid = map.display();
    for(var row of grid){
        display.add_tb_row(UIIDS.map_display, row, TILE_SCALE);
    }
    map.clear_telegraphs();
    // Updates the health bar display.
    display.remove_children(UIIDS.health_display);
    display_health(map.get_player(), TILE_SCALE);
    // Updates the initiative tracker display.
    update_initiative(map);
}

function explain_card(card){
    var text = ``;
    text += `${move_types.alt}\n`;
    text += `\n`;
    text += `${card.options.explain_buttons()}`;
    text += `\n`;
    if(card.per_floor !== undefined){
        text += `${move_types.per_floor}\n`;
    }
    else if(card.temp){
        text += `${move_types.temp}\n`;
    }
    if(card.options.is_instant()){
        text += `${move_types.instant}\n`;
    }
    say(text, false);
}

/**
 * Function to give a message to the user.
 * @param {string} msg message text.
 * @param {boolean} record If true, also adds it to the chat log.
 */
function say(msg, record = true){
    if(msg === ``){
        record = false;
    }
    display.display_message(UIIDS.display_message, msg);
    if(record){
        GS.record_message(msg);
    }
}

function update_initiative(map){
    var info = map.get_initiative().map(e => {
        let str = `${e.name}\n` + hp_description(e);
        let on_click = function(){
            display.click(`${UIIDS.map_display} ${e.location.y} ${e.location.x}`);
        }
        return {
            pic: e.pic,
            rotate: e.rotate,
            flip: e.flip,
            stun: e.stun !== undefined && e.stun > 0,
            name: e.name,
            str,
            on_click,
        }
    });
    display.remove_children(UIIDS.initiative);
    display.create_initiative(UIIDS.initiative, info, INITIATIVE_SCALE);
}
// Library for the various kinds of errors that the game could throw
const ERRORS = {
    invalid_type: `invalid type`,
    missing_property: `tile missing property`,
    pass_turn: `pass turn to player`,
    skip_animation: `skip animation delay`,
    game_over: `game over`,
    floor_complete: `floor complete`,
    array_size: `array size mismatch`,
    missing_id: `id not found`,
    invalid_value: `invalid value`,
    value_not_found: `value not found`,
    space_full: `space not empty`,
    already_exists: `value already set`,
    map_full: `map full`,
    creature_died: `creature died`,
    out_of_bounds: `out of bounds`,
    divide_by_0: `divide by 0`
}
Object.freeze(ERRORS);


// ----------------ManeuverUtil.js----------------
// File for utility functions used throughout the program.

/**
 * Initiates the game when the page is loaded.
 * @returns {void}
 */
function initiate_game(){
    display.detect_keys();
    display.swap_screen(DISPLAY_DIVISIONS);
    display.display_message(UIIDS.title, `${game_title}    `);
    create_main_dropdown(UIIDS.title);
    display_guide();
    GS = new GameState();
}


// Deck Creation
/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE);

    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(basic_slice());
    deck.add(basic_slice());
    deck.add(short_charge());
    deck.add(jump());

    deck.deal();
    return deck;
}
// Makes a deck for testing new cards.
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(){
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE);
    for(var card of CARDS_TO_TEST){
        deck.add(card());
    }
    var size = CARDS_TO_TEST.length;
    for(var i = 0; i < Math.max(4 - size, 1); ++i){
        deck.add(basic_horizontal());
    }
    deck.add(basic_slice());
    deck.deal();
    return deck;
}


// misc display functions
/**
 * Function to create the full description including
 *      -stun amount
 *      -health
 *      -max health
 * when appropriate.
 * @param {Tile} tile Tile to make the description for.
 * @returns {string} The formatted description.
 */
function tile_description(tile){
    if(tile.description === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return `${hp_description(tile)}${tile.description}`;
}

function hp_description(tile){
    var hp = ``
    var stunned = ``;
    if(tile.max_health !== undefined && tile.health !== undefined){
        hp = `(${tile.health}/${tile.max_health} hp) `;
    }
    else if(tile.health !== undefined){
        hp = `(${tile.health} hp) `;
    }
    if(tile.stun !== undefined && tile.stun > 0){
        stunned = `*${stunned_msg}${tile.stun}* `;
    }
    return `${hp}${stunned}`;
}

/**
 * Function to create the combined description of everything happening on a space of the game map.
 * @param {GridSpace} space The space to get a description of.
 * @returns {string} The properly formatted description.
 */
function grid_space_description(space){
    var tile = tile_description(space.tile);
    var foreground = space.foreground.filter((fg) => fg.description !== undefined);
    foreground = foreground.map((fg) => `${tile_description_divider}${fg.description}`);
    var background = space.background.filter((bg) => bg.description !== undefined);
    background = background.map((bg) => `${tile_description_divider}${bg.description}`);
    var descriptions = [tile, ...foreground, ...background];
    return descriptions.reduce((res, str) => `${res}${str}`);
}
/**
 * Function to display the player's current and max health.
 * @param {Tile} player The player to get health from.
 * @param {number} scale The size of the display images.
 */
function display_health(player, scale){
    if(player.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({
            pic: `${IMG_FOLDER.other}heart.png`, 
            name: `heart`
        });
    }
    if(player.max_health !== undefined){
        for(var i = 0; i < (player.max_health - player.health); ++i){
            health.push({
                pic: `${IMG_FOLDER.other}heart_broken.png`, 
                name: `broken heart`
            });
        }
    }
    display.add_tb_row(UIIDS.health_display, health, scale);
}
/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    var options = [];
    var make_on_change = function(screens, screen){
        return function(){
            display.swap_screen(screens, screen);
        }
    }
    if(DISPLAY_DIVISION_NAMES.length !== DISPLAY_DIVISIONS.length){
        throw new Error("list length mismatch");
    }
    for(var i = 0; i < DISPLAY_DIVISIONS.length; ++i){
        var option = {
            label: DISPLAY_DIVISION_NAMES[i],
            on_change: make_on_change(DISPLAY_DIVISIONS, DISPLAY_DIVISIONS[i])
        }
        options.push(option);
    }
    display.create_dropdown(location, options);
}
/**
 * Function to display the guide.
 */
function display_guide(){
    var section_location = UIIDS.guide;
    var navbar_location = UIIDS.guide_navbar;

    // Create the image arrays for the sections with images.
    var cards_symbol_arr = make_guidebook_images(CARD_SYMBOLS);
    var ctrl_symbol_arr = get_control_symbols();
    var cards_inline_arr = cards_symbol_arr.concat(ctrl_symbol_arr);
    var confusion_inline_arr = make_guidebook_images(CONFUSION_CARDS.map(card => {
        card = card();
        return {
            src: card.pic,
            name: card.name,
            x: 5,
            y: 5
        }
    }));

    // Create guidebook text sections.
    var basics_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.basics, GUIDE_TEXT.basics, []);
    var cards_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.cards, GUIDE_TEXT.cards, cards_inline_arr);
    var enemies_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.enemies, GUIDE_TEXT.enemies, []);
    var shop_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.shop, GUIDE_TEXT.shop, []);
    var bosses_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.bosses, GUIDE_TEXT.bosses, []);
    var chests_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.chests, GUIDE_TEXT.chests, []);
    var sidebar_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.sidebar, GUIDE_TEXT.sidebar, []);
    var confusion_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.confusion, 
        [...GUIDE_TEXT.confusion, ...CONFUSION_CARDS.map((card, i) => {
            // Adds the space for confusion card images.
            if(i % 4 !== 3){
                return NBS;
            }
            return `\n`;
        })],
        confusion_inline_arr);

    var section_id_list = [
        basics_section, 
        cards_section, 
        enemies_section, 
        shop_section, 
        bosses_section, 
        chests_section, 
        sidebar_section,
        confusion_section
    ];

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    // Create guidebook navbar.
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.basics, swap_visibility(section_id_list, basics_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.cards, swap_visibility(section_id_list, cards_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.enemies, swap_visibility(section_id_list, enemies_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.shop, swap_visibility(section_id_list, shop_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.bosses, swap_visibility(section_id_list, bosses_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.chests, swap_visibility(section_id_list, chests_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.sidebar, swap_visibility(section_id_list, sidebar_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.confusion, swap_visibility(section_id_list, confusion_section));

    display.swap_screen(section_id_list, basics_section);
}

/**
 * Function to get an array of images for the card symbols to use when displaying the guide..
 * @returns {HTMLElement[]} The array of images.
 */
function make_guidebook_images(arr){
    var images = [];
    for(var img of arr){
        images.push(display.create_image(img.src, `${img.name} symbol`, new Point(img.x, img.y).times(CARD_SYMBOL_SCALE)));
    }
    return images;
}
/**
 * Function to get an array of buttons with the keys used for controls as the value to use when displaying the guide.
 * @returns {HTMLElement[]} The array of buttons.
 */
function get_control_symbols(){
    var button_symbols = CONTROLS.card.concat(CONTROLS.directional);
    var buttons = [];
    for(var symbol of button_symbols){
        buttons.push(display.create_button(symbol, `${symbol} key`));
    }
    return buttons;
}
/**
 * Function to add a random temporary debuff card to the player's deck.
 */
function confuse_player(){
    // Chance redused by 50% for each stable_mind boon.
    if(1 + random_num(2) - GS.boons.has(boon_names.stable_mind) > 0){
        var card = rand_no_repeates(CONFUSION_CARDS, 1)[0]();
        GS.give_temp_card(card);
        GS.refresh_deck_display();
    } 
}

/**
 * Function to create and add the buttons for the sidebar.
 */
function create_sidebar(){
    var location = UIIDS.sidebar_header;
    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }
    display.remove_children(location);
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.text_log, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.text_log));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.discard_pile, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.discard_pile));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.initiative, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.initiative));
    swap_visibility(SIDEBAR_DIVISIONS, UIIDS.text_log)();
}
// Area Descriptions.
const ruins_description = `You have entered the ruins.`;
const sewers_description = `You have entered the sewers.`;
const basement_description = `You have entered the basement.`;
const magma_description = `You have entered the magmatic caves.`;
const crypt_description = `You have entered the crypt.`;
const forest_description = `You have entered the subteranean forest.`;
const library_description = `You have entered the library.`;
const sanctum_description = `You have entered the sanctum.`;
const default_area_description = `You have reached the end of the current content. Floors will continue to generate but there will `
                                +`be no more boss fights. Good luck.`;


const boon_names = {
    adrenaline_rush: `Adrenaline Rush`,
    ancient_card: `Ancient Card`,
    bitter_determination: `Bitter Determination`,
    boss_slayer: `Boss Slayer`,
    brag_and_boast: `Brag & Boast`,
    chilly_presence: `Chilly Presence`,
    creative: `Creative`,
    dazing_blows: `Dazing Blows`,
    escape_artist: `Escape Artist`,
    expend_vitality: `Expend Vitality`,
    fleeting_thoughts: `Fleeting Thoughts`,
    fortitude: `Fortitude`,
    frenzy: `Frenzy`,
    frugivore: `Frugivore`,
    future_sight: `Future Sight`,
    hoarder: `Hoarder`,
    learn_from_mistakes: `Learn From Mistakes`,
    limitless: `Limitless`,
    pacifism: `Pacifism`,
    pain_reflexes: `Pain Reflexes`,
    picky_shopper: `Picky Shopper`,
    practice_makes_perfect: `Practice Makes Perfect`,
    pressure_points: `Preassure Points`,
    rebirth: `Rebirth`,
    repetition: `Repetition`,
    roar_of_challenge: `Roar of Challenge`,
    safe_passage: `Safe Passage`,
    serenity: `Serenity`,
    shattered_glass: `Shattere Glass`,
    skill_trading: `Skill Trading`,
    slayer: `Slayer`,
    spiked_shoes: `Spiked Shoes`,
    spined_armor: `Spined Armor`,
    spontaneous: `Spontaneous`,
    stable_mind: `Stable Mind`,
    stealthy: `Stealthy`,
    stubborn: `Stubborn`,
    thick_soles: `Thick Soles`,
}
Object.freeze(boon_names);


// Boon Descriptions
const adrenaline_rush_description = 
    `Dealing at least 2 damage in 1 turn gives you an extra turn.`;
const bitter_determination_description = 
    `At the start of each floor, heal 1 if your health is exactly 1.`;
const boss_slayer_description = 
    `Bosses start with 2 less hp.`;
const brag_and_boast_description = 
    `Add 2 random boss cards and 1 random debuff card to your deck.`;
const chilly_presence_description = 
    `Enemies have a 1/6 chance to become stunned at the end of their `
    +`turn. Bosses are not affected.`;
const creative_description = 
    `Increase your hand size by 1. Increases minimum deck size by 5.`;
const dazing_blows_description = 
    `Your attacks stun enemies. Bosses are unaffected.`;
const escape_artist_description = 
    `Teleport away when attacked.`;
const expend_vitality_description =  
    `Heal 1 life at the start of each floor. Your max health is decreased `
    +`by 1.`;
const fleeting_thoughts_description = 
    `Temporary cards added to your deck will happen instantly.`;
const fortitude_description = 
    `Gain an extra max health.`;
const frenzy_description = 
    `Deal double damage while you only have 1 health.`
const frugivore_description = 
    `50% chance to encounter a fruit tree on each floor. Eating the fruit will heal you `
    +`for 1, but might attract enemies.`;
const future_sight_description = 
    `You may look at the order of your deck.`;
const hoarder_description = 
    `All treasure chests contain 2 additional choices and are invulnerable.`;
const learn_from_mistakes_description = 
    `Remove any 2 cards from your deck.`;
const limitless_description = 
    `Remove your max health. Heal for 2. If you would be fully healed, heal `
    +`for 1 instead.`;
const pacifism_description = 
    `If you would attack an enemy, stun them twice instead. Fully heal at `
    +`the start of each floor. All boss floor exits unlock.`;
const pain_reflexes_description = 
    `Take a turn whenever you are attacked.`;
const picky_shopper_description = 
    `Recieve an extra card choice for adding and removing cards in the shop.`;
const practice_makes_perfect_description = 
    `Defeating a boss while at max health increases your max health by 1.`;
const pressure_points_description = 
    `When you stun an enemy, there is a 50% chance you also deal it 1 damage.`;
const rebirth_description = 
    `When you die, you are revived at full health and this boon is removed.`;
const rebirth_revival_message = 
    `You died, but were brought back to life.`;
const repetition_description = 
    `Every 3rd turn, your cards happen twice.`;
const roar_of_challenge_description = 
    `Gain 2 max health. Difficulty increases by 5 floors.`;
const safe_passage_description = 
    `Fully heal and travel to the next floor.`;
const serenity_description = 
    `Reduce your minimum deck size to 4.`;
const shattered_glass_description = 
    `Enemies explode on death damaging each other nearby enemy. Reduce your `
    +`max health by 1.`;
const skill_trading_description = 
    `You may both add a card and remove a card at each shop.`;
const spiked_shoes_description = 
    `Attempting to move onto enemies damages them. Reduces your max health by 1.`;
const spined_armor_description = 
    `Retaliate for 1 damage when attacked. Bosses are immune.`;
const spontaneous_description = 
    `After using a non instant card, discard your whole hand. Minimum deck size `
    +`increased by 5.`;
const stable_mind_description = 
    `You gain a 50% chance to resist confusion.`;
const stealthy_description = 
    `Enemies are stunned for two turns at the start of each floor. Bosses are immune.`;
const stubborn_description = 
    `You can decide to skip shops.`;
const thick_soles_description = 
    `You are immune to damage on your turn.`;


// Button Options.
const null_move_button = `--`;
const NW = `NW`;
const N = `N`;
const NE = `NE`;
const E = `E`;
const SE = `SE`;
const S = `S`;
const SW = `SW`;
const W = `W`;
const C = `C`;
const SPIN = `Spin`;

// Directions.
const four_directions = {
    up: `Up`,
    down: `Down`,
    left: `Left`,
    right: `Right`
}

// Move types.
const move_types = {
    alt: `Shift click on a button to show what it will do on the map.`,
    intro: `Move Options (actions will be performed in order):\n`,

    attack: `Attack`,
    move: `Move`,
    teleport: `Teleport you to a random space`,
    stun: `Stun`,
    confuse: `Confuse: you. Adds a bad temporary card to your deck.`,
    move_until: `Keep Moving`,
    heal: `Heal`,
    you: `you`,
    nothing: `Do nothing`,
    
    per_floor: `Once Per Floor: after being played, this card will disapear for the rest of the floor.`,
    temp: `Temporary: this card will be removed from your deck when used, or at the end of the floor.`,
    instant: `Instant: you will take an extra turn after playing this card.`
}
Object.freeze(move_types);
// Boss Descriptions
const boss_death_description = 
    `The exit opens.\nYou feel your wounds begin to heal.`;

// Velociphile
const velociphile_floor_message = 
    `You hear a deafening shriek.`;
const velociphile_description = 
    `Velociphile (Boss): A rolling ball of mouths and hate. Moves `
    +`in straight lines. Must build up speed to ram you.`;
const velociphile_death_message = 
    `The wailing falls silent as the Velociphile is defeated.`;

// Spider Queen
const spider_queen_floor_message = 
    `The floor is thick with webs.`;
const spider_queen_description = 
    `Spider Queen (Boss): Her back crawls with her young. Moves like a `
    +`normal spider. Taking damage will stun her, but will also spawn a spider.`;
const spider_queen_death_message = 
    `As the Spider Queen falls to the floor, the last of her children emerge.`;

// Two Headed Serpent
const two_headed_serpent_floor_message = 
    `The discarded skin of a massive creature litters the floor.`;
const two_headed_serpent_awake_description = 
    `Two Headed Serpent (Boss): Moves then attacks 1 square orthogonally. `
    +`When damaged, the neck will instantly grow a new head.`;
const two_headed_serpent_asleep_description = 
    `Two Headed Serpent (Boss): This head is sleeping. When damaged, `
    +`the neck will grow a new head, which will spend it's turn waking up. `
    +`The other head will then fall asleep.`;
const two_headed_serpent_body_description = 
    `Two Headed Serpent (Boss): The scales on the body are too tough to pierce. `;
const two_headed_serpent_death_message = 
    `It's body too small to regenerate any further, all four of the serpent's `
    +`eyes close for the final time`;

// Lich
const lich_floor_message = 
    `Dust and dark magic swirl in the air.`;
const lich_description = 
    `Lich (Boss): An undead wielder of dark magic. Alternates between moving `
    +`one space away from you and casting a spell.\nThe Lich is currently preparing `
    +`to cast:\n`;
const lich_announcement = 
    `The Lich is currently preparing to cast:\n`;
const lich_death_message = 
    `The Lich's body crumbles to dust.`;

// Lich Spells
const teleport_spell_description = 
    `Teleport: The user moves to a random square on the map`;
const summon_spell_description = 
    `Summon: Summons a random enemy`;
const earthquake_spell_description = 
    `Earthquake: Causes chunks of the ceiling to rain down.`;
const flame_wave_spell_description = 
    `Flame Wave: Shoots 3 explosive fireballs towards the target.`;
const confusion_spell_description = 
    `Confusion: Pollutes your deck with 2 bad temporary cards.`;
const lava_moat_spell_description = 
    `Lava Moat: Creates pools of molten lava to shield the user.`;
const piercing_beam_spell_description = 
    `Piercing Beam: Fires a piercing beam in the direction closest to the target.`;
const rest_spell_description = 
    `Nothing.`;

// Young Dragon
const young_dragon_floor_message = 
    `The air burns in your lungs.`;
const young_dragon_description_arr = [
    `Young Dragon (Boss): Be glad it's still young. Alternates between `
    +`gliding short distances and breathing fire.\nThe Dragon is currently `, 
    `preparing to fly a short distance.`, 
    `preparing to aim it's fire breath.`, 
    `preparing to breath fire in a cone of length `
];
const young_dragon_death_message = 
    `Scales so soft are easily pierced. The Young Dragon's fire goes out.`;

// Forest Heart
const forest_heart_floor_message = 
    `In the center of the floor stands a massive tree trunk spanning from floor to ceiling.`;
const forest_heart_description = 
    `An ancient tree warped by dark magic. Cannot take more than 1 damage each turn. `;
const forest_heart_death_message = 
    `Branches rain from above as the ancient tree is felled.`

// Forest Heart Spells
const forest_heart_rest_description = 
    `Currently, the Forest Heart is resting.`;
const forest_heart_growth_description = 
    `Currently, the Forest Heart is preparing to grow plants.`;
const forest_heart_summon_description = 
    `Currently, the Forest Heart is preparing to summon forest creatures.`;


// Normal Enemy Descriptions.

const spider_description = 
    `Spider: Will attack the player if it is next to them. `
    +`Otherwise it will move 1 space closer.`;
const turret_h_description = 
    `Turret: Does not move. Fires beams orthogonally that hit `
    +`the first thing in their path.`;
const turret_d_description = 
    `Turret: Does not move. Fires beams diagonally that hit the `
    +`first thing in their path.`;
const turret_r_description = 
    `Turret: Does not move. Fires beams in two directions hitting `
    +`the first thing in their path. Rotates every turn.`;
const scythe_description = 
    `Scythe: Will move 3 spaces diagonally towards the player `
    +`damaging them if it passes next to them. Can only see diagonally.`;
const shadow_knight_description = 
    `Shadow Knight: Moves in an L shape. If it tramples the player, `
    +`it will move again.`;
const spider_web_description = [
    `Spider Web: Does not move or attack. Spawns a spider every `, 
    ` turns. Slows over time.`
];
const ram_description = 
    `Ram: Moves orthogonally. When it sees the player, it will `
    +`prepare to charge towards them and ram them.`;
const large_porcuslime_description = 
    `Large Porcuslime: Moves towards the player 1 space and attacks `
    +`in that direction. Weakens when hit.`;
const medium_porcuslime_description = 
    `Medium Porcuslime: Moves towards the player 1 space and attacks `
    +`in that direction. Alternates between orthoganal and diagonal `
    +`movement. Splits when hit.`;
const small_h_porcuslime_description = 
    `Small Porcuslime: Moves towards the player 1 space orthogonally `
    +`and attacks in that direction.`;
const small_d_porcuslime_description = 
    `Small Porcuslime: Moves towards the player 1 space diagonally and `
    +`attacks in that direction.`;
const acid_bug_description = 
    `Acid bug: Moves towards the player 1 space. Has no normal attack, `
    +`but will spray acid upon death hurting everything next to it.`;
const brightling_description = 
    `Brightling: Is not aggressive. Will occasionally teleport the player `
    +`close to it before teleoprting away the next turn.`;
const corrosive_caterpillar_description = 
    `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive `
    +`slime behind it when it moves or dies.`;
const noxious_toad_description = 
    `Noxious Toad: Every other turn it will hop over a space orthogonally. `
    +`If it lands near the player, it will damage everything next to it.`;
const vampire_description = 
    `Vampire: Moves orthogonally then will attempt to attack diagonally. `
    +`When it hits the player, it will heal itself. Teleports away and is `
    +`stunned when hit.`;
const clay_golem_description = 
    `Clay Golem: Will attack the player if it is next to them. Otherwise `
    +`it will move 1 space closer. Taking damage will stun it and it cannot `
    +`move two turns in a row.`;
const vinesnare_bush_description = [
    `Vinesnare Bush: Does not move. Can drag the player towards it using it's vines from up to `,
    ` spaces away. It can then lash out at the player if they are still nearby next turn.`
];
const rat_description = 
    `Rat: Will attack the player if it is next to them. Otherwise it will move `
    +`2 spaces closer. After attacking, it will flee.`;
const shadow_scout_description = 
`Shadow Scout: Will attack the player if it is next to them. Otherwise it will `
+`move 1 space closer. Can go invisible every other turn.`;
const darkling_description = 
`Darkling: Teleports around randomly hurting everything next to the location it `
+`arrives at. Blocking it's rift will destroy it.`;
const orb_of_insanity_description = [
    `Orb of Insanity: Does not move or attack. If the player is within `, 
    ` spaces of it, it will confuse them, polluting their deck with a bad temporary card.`
];
const carrion_flies_description = 
    `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders `
    +`aimlessly. Over time they will multiply.`;
const magma_spewer_description = 
    `Magma Spewer: Fires magma into the air every other turn. Retreats when you `
    +`get close.`
const boulder_elemental_description = 
    `Boulder Elemental: Wakes up stunned when something touches it. Each turn, `
    +`it damages anyone close to it, then moves 1 space closer to the player. `
    +`After 3 turns of failing to hit anything, it will go back to sleep.`;
const pheonix_description = 
    `Pheonix: Flies to an empty spot 2 or 3 spaces away in a single direction. `
    +`Everything it flies over will be damaged and set on fire. When it dies, `
    +`it drops a pile of ashes from which it will eventually be reborn.`;
const igneous_crab_description = 
    `Igneous Crab: Will attack the player if it is next to them. Otherwise it will `
    +`move 1 space closer. When damaged, it will spend the next 2 turns fleeing.`;
const strider_description = 
    `Strider: Attacks then moves 2 spaces away in one direction.`;
const swaying_nettle_description = 
    `Swaying Nettle: Alternates between attacking the squares orthogonal and diagonal `
    +`to it. Won't hurt each other`;
const nettle_root_description = 
    `Watch out, swaying nettles are about to sprout damaging anything standing here.`
const thorn_bush_description = 
    `Thorn Bush: Trying to move here hurts. Spreads it's brambles over time.`;
const living_tree_description = 
    `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
    +`Moves one square in any direction every other turn if it didn't attack.`;
const living_tree_rooted_description = 
    `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
    +`This one has put down roots making it unable to move.`
const scorpion_description = 
    `Scorpion: Will attack the player if it is next to them. Otherwise, moves 2 spaces `
    +`closer every other turn.`;
const moving_turret_description = 
    `Moving Turret: Fires beams in two directions that hit the first thing in their path. `
    +`Moves in the same direction until it hits something.`;
const walking_prism_description = [
    `Walking Prism: Has no normal attack, but will fire beams in 4 directions when damaged `
    +`which hit the first thing in their path. Changes firing direction aftewards.\n`, 
    `Currently aiming orthogonally.`,
    `Currently aiming diagonally.`
    ];
const unstable_wisp_description = 
    `Unstable Wisp: Moves randomly and occasionally leaves behind a fireball. Explodes `
    +`into a ring of fireballs on death.`;
const captive_void_description = 
    `Captive Void: Creatures within two spaces will be drawn towards it. Damaging it `
    +`turns it off for 2 turns.`;
const paper_construct_description = 
    `Paper Construct: can shoot the player from up to 2 spaces away orthogonally. Otherwise, `
    +`moves up to two spaces diagonally.`;
const lava_pool_description = 
    `Lava Pool: Attempting to move here will hurt.`;
const corrosive_slime_description = 
    `Corrosive Slime: Stepping into this will hurt. Clear it out `
    +`by attacking.`;
const wall_description = 
    `Wall: It seems sturdy.`;
const damaged_wall_description = 
    `Damaged Wall: Something might live inside.`;
const fireball_description = 
    `Fireball: Moves forwards until it comes into contact with `
    +`something, then damages it.`;
const falling_rubble_description = 
    `Watch out, something is about to fall here.`;
const darkling_rift_description = 
    `If this space isn't blocked, a darkling will teleport here `
    +`next turn damaging everything nearby.`;
const magmatic_boulder_description = 
    `Magmatic Boulder: The light reflecting off of it gives you the `
    +`feeling of being watched.`;
const smoldering_ashes_description = [
    `Smoldering Ashes: A pheonix will be reborn here in `, 
    ` turns unless you scatter the ashes by attacking them or moving onto them.`
];
const raging_fire_description = 
    `Raging Fire: The very ground here is burning. It will grow weaker `
    +`every turn, but it's not safe to move through.`;
const coffin_description = 
    `Coffin: There is no telling whether whatever is inside is still `
    +`alive or not. Touch it at your own risk.`;
const sewer_grate_description = 
    `Sewer Grate: It's clogged. Corrosive slime is oozing out.`;
const repulsor_description = 
    `Repulsor: Pushes nearby creatures away by 2 spaces on it's turn or `
    +`if touched. Takes 2 turns to recharge afterwards.`;
const thorn_bramble_description = 
    `Thorn Bramble: Trying to move here hurts. Allows the thorn bush to `
    +`spread further.`;
const thorn_root_description = 
    `Watch out, brambles are about to sprout damaging anything standing here.`
const enticing_fruit_tree_description = 
    `Enticing Fruit Tree: Moving you here will heal you, but other creatures `
    +`may be attracted by the fruit.`;
const rotting_fruit_tree_description = 
    `Rotting Fruit Tree: None of the remaining fruit is edible, but the smell `
    +`could still attract creatures if it is disturbed.`;
const bookshelf_description = 
    `Bookshelf: When damaged, adds a random temporary card to your deck.`;
const floating_barrier_description = 
    `Moving Barrier: Moves in a straight line. Changes direction when it hits `
    +`something.`;


const empty_description = 
    `There is nothing here.`;
const exit_description = 
    `Stairs: Takes you to the next floor.`;
const lock_description = 
    `Locked Exit: Defeat the boss to continue.`;
const player_description = 
    `You: Click a card to move.`;

// Chest
const chest_description = 
    `Chest: It might have something useful inside. Breaking it will damage `
    +`the contents.`;
const armored_chest_description = 
    `Armored Chest: It might have something useful inside. It is larger than `
    +`a normal chest and armored to protect it's contents.`;
const chest_inner_discription = 
    `Choose up to one reward:`;
const take_from_chest = 
    `Take`;
const abandon_chest = 
    `Abandon`;
const add_card_description = 
    `Add this card to your deck.`
// General Descriptions
const game_title = `Maneuver`;
const hand_label_text = `Hand of cards`;
const move_label_text = `Moves`;
const mod_deck = `Choose one card to add or remove:`;
const current_deck = `Current Deck (minimum `;
const welcome_message = `Use cards to move (blue) and attack (red).\n` 
                        + `Click on things to learn more about them.\n`
                        + `Refer to the guidebook if you need more information.`;
const blank_moves_message = `Before choosing what move to make, you must first select a card to use.`;
const floor_message = `Welcome to floor `;
const game_over_message = `Game Over. You were killed by a `;
const retry_message = `Retry?`;
const stunned_msg = `Stunned x`;
const gameplay_screen_name = `Gameplay`;
const guide_screen_name = `Guidebook`;
const tile_description_divider = `\n--------------------\n`;
const card_explanation_start = `Move Options (actions will be performed in order):\n`;
const card_explanation_end = `Shift click on a button to show what it will do on the map.\n`;
const SIDEBAR_BUTTONS = {
    text_log: `Messages`, 
    boon_list: `Boons`, 
    discard_pile: `Discard`, 
    initiative: `Initiative`, 
    deck_order: `Deck`,
    sidebar: `Sidebar`
}
Object.freeze(SIDEBAR_BUTTONS);
// ----------------GuideText.js----------------
// This file contains the headers and text for the guide / tutorial section.

const GUIDE_HEADERS = {
    basics: `The Basics`,
    cards: `Using Cards`,
    enemies: `Handling Enemies`,
    shop: `The Shop`,
    bosses: `Bosses`,
    chests: `Chests`,
    sidebar: `Sidebar`,
    confusion: `Confusion`
}
Object.freeze(GUIDE_HEADERS);

const GUIDE_TEXT = {
    basics: [`Welcome to Maneuver. The goal of the game is to progress as deep into the dungeon as possible by completing each floor. `
            +`To finish a floor, you need to reach the stairs that lead down to the next one. Enemies will spawn on each floor which will `
            +`try to stop you from continuing. You do not need to defeat everything on the current floor to continue, but will often need to `
            +`fight most of them to survive. Read more about controlling your character in the next section. Good luck!\n\n`],

    cards: [`To control your character's actions, you have a deck of cards. Each card gives you several options for a set of actions `
            +`to take. The actions on the card will be performed relative to your current location (the black dot). Clicking on a card will `
            +`bring up a grid of buttons which will let you use it. When you finish using a card, it will be discarded and replaced with another `
            +`from your deck, then everything else on the floor will get a chance to act (read more in the next section). When your deck runs out, `
            +`your discard pile will be shuffled back into it. The amount of cards remaining in your deck is shown next to your health bar.\n`
            +`\n`
            +`Colors and symbols that make up a card:\n`,
                ` Your relative starting location.\n`,
                ` You will attack this space.\n`,
                ` You will move to this space.\n`,
                ` If applied to an enemy, it will stun them. If applied to the player, it will instead add a temporary debuff card to your deck.\n`,
                ` You will heal the creature on this space if it's health is less than it's max health.\n`,
                ` Each action the line goes through will be performed.\n`,
                ` Multiple actions will be performed in a specific order.\n`,
                ` Multiple actions of the same type will be performed until you hit something.\n`,
                ` You will be teleported to a random unoccupied location.\n`,
                `  `,    ` Multiple actions will be performed on the same space. Moves will be performed last.\n`,
                ` A card with a purple grid will be performed instantly.\n`,
                ` A card with a tan background is temporary. It will be removed from your deck when you use it or when the floor ends.\n`,
                ` A card with a brown grid can only be used once per floor. When drawn it will show up as temporary.\n`
            +`\n`
            +`You can use the (?) button next to your move options to learn exactly what a selected card does, or shift click to `
            +`display what the card does on the map.\n`
            +`\n`
            +`In addition to clicking on cards to use them, you can use the keys\n`,
                ` `, ` `, ` `, `\n`
            +`to select a card in your hand.\n`
            +`Press the keys\n`,
                ` `, ` `, `\n`,
                ` `, ` `, `\n`,
                ` `, ` `, `\n`
            +`to use a card once it is selected.\n\n`],

    enemies: [`As you travel through the dungeon, you will encounter various other creatures, many of whom want to kill you. Each creature has `
            +`different patterns of attack and movement and many of them have other unique abilities. Click on a tile to learn more about it. `
            +`Clicking will show you a description of it, how much health it has, and which squares it might be able to attack on it's next `
            +`turn. Some enemies also have the ability to move you during their turn. When this happens, you will get the chance to respond.\n`
            +`Remember that you do not need to kill everything to go to the next stage. Sometimes it's better to run past an enemy than to `
            +`fight it and risk getting surrounded or cornered. There may also be some creatures you encounter that are more helpful than `
            +`harmful.\n`
            +`Some effects will cause an enemy to become stunned. Stunned enemies will skip their next turn. Multiple instances of stun `
            +`will cause multiple turns to get skipped.\n\n`],

    shop: [`When you complete a floor, you will enter a shop where you must either add or remove a card from your deck. You will get `
            +`${ADD_CHOICE_COUNT} options of random cards to add, and ${REMOVE_CHOICE_COUNT} options of random cards from your deck to remove. `
            +`The current contents of your deck will be shown to help you choose. You cannot go below your minimum deck size.\n`
            +`Some enemies or effects may add temporary cards to your deck. They will go away after you play them or go to the next `
            +`floor.\n\n`],

    bosses: [`Every ${AREA_SIZE} floors, you will encounter a boss floor. The stairs out of this floor will be locked until you defeat it's `
            +`powerful occupant. When you defeat the boss, the stairs will be unlocked, you will be fully healed, and it might drop a chest `
            +`containing a powerful new card as a reward.\n`
            +`When leaving the floor, you will enter a new area of the dungeon with a different set of inhabitants and a new boss at `
            +`the end.\n\n`],

    chests: [`On floor ${CHEST_LOCATION} of every area, you will find a treasure chest. Moving onto this chest will allow you to pick `
            +`a boon. Boons are powerful abilities that can give your character a unique edge when it comes to surviving.\n\n`
            +`Chests will also be dropped after a boss is defeated. Rather than boons, these ones will contain a card that lets you `
            +`imitate one of the bosses abilities.\n\n`
            +`Be careful when killing bosses and picking up chests. Breaking a chest will destroy it's contents.\n\n`],

    sidebar: [`The sidebar contains several tabs which keep track of useful information so you don't need to remember it.\n\n`
            +`- The Messages tab keeps track of messages the game tells you. Ones you bring up yourself like the descriptions `
            +`given by clicking on a tile will not be tracked.\n\n`
            +`- The Discard tab will keep track of which cards in your deck have been used so far, to help you figure out what might `
            +`be left to draw. It resets after shuffling.\n\n`
            +`- The Initiative tab will keep track of the health and turn order of enemies. Pay attention to it when trying to `
            +`use one enemy to block the attack of another. It will not track hidden enemies.\n\n`
            +`- The Boons tab will become available when you pick up your first boon. It will keep track of each boon you pick up `
            +`and allow you to view their descriptions again by clicking on them. It will also track when certain boons are lost.\n\n`
            +`More tabs might become available as you play.\n\n`],

    confusion: [`Certain enemies and cards will confuse you. Confusion adds a temporary bad card to your deck which will go away after `
            +`it goes to your discard pile, or when you go to the next floor. Cards will do this if they highlight your current square `
            +`in yellow.\n\n`
            +`Here is a list of the possible confusion cards:\n\n`]
}
Object.freeze(GUIDE_TEXT);

const CARD_SYMBOLS = [
    {src: `${IMG_FOLDER.symbols}you.png`,               name: `you`,                x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}attack.png`,            name: `attack`,             x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}move.png`,              name: `move`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}stun.png`,              name: `stun`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}heal.png`,              name: `heal`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple.png`,          name: `multiple actions`,   x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple_ordered.png`,  name: `actions in order`,   x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}move_until.png`,        name: `move until`,         x: 4, y: 1},
    {src: `${IMG_FOLDER.symbols}teleport.png`,          name: `teleport`,         x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}attack_move.png`,       name: `attack then move`,   x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}triple_attack.png`,     name: `tripple attack`,     x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}instant.png`,           name: `instant`,            x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}temporary.png`,         name: `temporary`,          x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}per_floor.png`,         name: `once per floor`,     x: 2, y: 2},
];


// ----------------UIID.js----------------
// File containing a library of ids used to retrieve elements of the ui.

/**
 * Function to get a set of uiids (Identifiers that can be used to retrieve the appropriate ui element) for the appropriate language.
 * Throws an error if an invalid language is provided.
 * @param {string} language The language to get uiids for.
 * @returns {uiid_library} The library of uiids for that language.
 */
function get_uiids(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return HTML_UIIDS;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * @typedef {Object} uiid_library
 * @property {string} title Displays the title of the game.
 * @property {string} game_screen Controls the visibility of the game itself.
 *      @property {string} stats Displays the current stats.
 *      @property {string} stage Controls the visibility of the current floor.
 *          @property {string} map_display Displays the map of the floor.
 *          @property {string} health_display Displays the player's health.
 *          @property {string} remaining_deck Shows how many cards are left in the player's deck.
 *              @property {string} deck_image Deck icon in the background.
 *              @property {string} deck_count # of cards in the foreground.
 *          @property {string} hand_box The box around the hand of cards.
 *              @property {string} hand_label Labels the hand box.
 *              @property {string} hand_display Displays the player's hand of cards.
 *          @property {string} move_box The box around the move buttons.
 *              @property {string} move_label Labels the move button box.
 *              @property {string} move_info Info icon for move buttons.
 *              @property {string} move_buttons Displays the buttons for the last card clicked on.
 *          @property {string} display_message Displays messages.
 *          @property {string} retry_button: A button to allow them to reset after they die.
 *      @property {string} shop Controls the visibility of the shop.
 *          @property {string} shop_instructions Lets the player know they can add or remove a card.
 *          @property {string} add_card Displays which cards that could be added to their deck.
 *          @property {string} remove_card Displays which cards that could be removed from their deck.
 *          @property {string} current_deck Tells them the next element is their current deck.
 *          @property {string} display_deck Displays their entire deck.
 *      @property {string} chest Controls the visibility of the chest contents.
 *          @property {string} chest_lid: Creates the lid of the chest.
 *              @property {string} chest_instructions: A description of the contents of the chest.
 *          @property {string} chest_body: Created the body of the chest.
 *              @property {string} contents The images associated with the contents.
 *              @property {string} chest_confirm_row: Buttons allowing you to confirm your pick or skip the reward.
 *              @property {string} content_description: A description of whichever one of the contents you last clicked on.
 * @property {string} guide Controls the visibility of the guide screen.
 *      @property {string} guide_navbar Controls the visibility of each guidebook section.
 */


/** @type {uiid_library} The uiid library for HTML.*/
const HTML_UIIDS = {
    title: `title`,
    game_screen: `gameScreen`,
        stats: `stats`,
        stage: `stage`,
            map_display: `mapDisplay`,
            sidebar: `sidebar`,
                sidebar_header: `sidebarHeader`,
                initiative: `initiative`,
                boon_list: `boonList`,
                    boon_list_table: `boonListTable`,
                    removed_boon_table: `removedBoonTable`,
                discard_pile: `discardPile`,
                    discard_pile_table: `discardPileTable`,
                text_log: `textLog`,
                    text_scroll: `textScroll`,
                deck_order: `deckOrder`,
                    deck_order_table: `deckOrderTable`,
            health_display: `healthDisplay`,
            remaining_deck: `remainingDeck`,
                deck_image: `deckImage`,
                deck_count: `deckCount`,
            hand_box: `handBox`,
                hand_label: `handLabel`,
                hand_display: `handDisplay`,
            move_box: `moveBox`,
                move_label: `moveLabel`,
                move_info: `moveInfo`,
                move_buttons: `moveButtons`,
            display_message: `displayMessage`,
            retry_button: `retryButton`,
        shop: `shop`,
            shop_instructions: `shopInstructions`,
            add_card: `addCard`,
            remove_card: `removeCard`,
            current_deck: `currentDeck`,
            display_deck: `displayDeck`,
        chest: `chest`,
            chest_lid: `chestLid`,
                chest_instructions: `chestInstructions`,
            chest_body: `chestBody`,
                contents: `contents`,
                chest_confirm_row: `chestConfirmRow`,
                content_description: `contentDescription`,
    guide: `guide`,
        guide_navbar: `guideNavbar`,
}
Object.freeze(HTML_UIIDS);

const UIIDS = get_uiids(MARKUP_LANGUAGE);

const GAME_SCREEN_DIVISIONS = [UIIDS.stage, UIIDS.shop, UIIDS.chest];
const DISPLAY_DIVISIONS = [UIIDS.game_screen, UIIDS.guide];
const DISPLAY_DIVISION_NAMES = [gameplay_screen_name, guide_screen_name];

const SIDEBAR_DIVISIONS = [UIIDS.text_log, UIIDS.boon_list, UIIDS.discard_pile, UIIDS.initiative, UIIDS.deck_order];

/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(self, target, map){
    if(self.tile.death_message === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.card_drops !== undefined && self.tile.card_drops.length > 0){
        // Create a chest containing a random card from it's loot table.
        var chest = appropriate_chest_tile();
        var cards = rand_no_repeates(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.hoarder));
        for(var card of cards){
            add_card_to_chest(chest, card());
        }
        map.add_tile(chest, self.location);
    }
    say(`${self.tile.death_message}\n${boss_death_description}`);
    map.unlock();
}
// ToDo
//      Handle Death
//      Handle Spells
//      New Pics?
//      Test Stun immunity
//      Test Nettle immunity (along with nettle's nettle immunity)
//      Add Cards
//      Double check which things replace previous spawns and how.

//      Playtest
//      Finish Forest
//      Clean up testing, put forest into context
//      Try to beat it


/** @type {TileGenerator} */
function forest_heart_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}forest_heart.png`,
        `${IMG_FOLDER.tiles}forest_heart_invincible.png`
    ]
    var spells = [
        // Index + 1 corresponds with the health it's triggered at.
        /*1*/greater_thorn_bush_spell_generator(),
        /*2*/forest_heart_rest_spell_generator(),
        /*3*/swaying_nettle_spell_generator(),
        /*4*/living_tree_spell_generator(),
        /*5*/thorn_bush_spell_generator(),
        /*6*/rotting_fruit_spell_generator(),
        /*7*/scorpion_spell_generator(),
        /*8*/forest_heart_rest_spell_generator(),
        /*9*/thorn_bush_spell_generator(),
        /*10*/vinesnare_bush_spell_generator(),
        /*11*/forest_heart_rest_spell_generator(),
    ];
    var health = 12
    var tile = {
        type: `enemy`,
        name: `Forest Heart`,
        pic: pic_arr[0],
        description: forest_heart_description + forest_heart_rest_description,
        tags: new TagList([TAGS.boss, TAGS.unmovable, TAGS.unstunnable, TAGS.nettle_immune]),
        health: 12,
        death_message: forest_heart_death_message,
        behavior: forest_heart_ai,
        on_hit: forest_heart_on_hit,
        on_death: forest_heart_death,
        telegraph_other: rest_spell_telegraph,
        pic_arr,
        cycle: health,
        segment_list: [undefined, undefined],
        spells,
        card_drops: [snack, branch_strike]
    }
    if(GS.boons.has(boon_names.boss_slayer)){
        tile.health -= 2;
        var next_spell = spells[tile.health - 2];
        tile.description = forest_heart_description + next_spell.description;
        tile.pic = next_spell.pic;
        tile.telegraph_other = next_spell.telegraph_other;
    }
    return tile;
}

/** @type {AIFunction} */
function forest_heart_ai(self, target, map){
    if( self.tile.cycle === undefined || // Make sure it checks for correct fields
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health === undefined){
        // Performs the action corresponding to the current health.
        self.tile.spells[self.tile.cycle - 1].behavior(self, target, map);
        if(self.tile.cycle === 0){
            return;
        }
        // Makes it vulnerable again
        var sections = get_forest_heart_sections(self, map);
        var health = self.tile.cycle;
        var next_spell = self.tile.spells[health - 2];
        if(health > 1){
            map.add_event({name: `spell announcement`, behavior: () => {say(next_spell.description)}});
        }
        for(var section of sections){
            var tile = section.tile;
            tile.health = health;
            tile.pic = tile.pic_arr[0];
            if(tile.health > 1){
                tile.description = forest_heart_description + next_spell.description;
                tile.pic = next_spell.pic;
                tile.telegraph_other = next_spell.telegraph_other;
            }
        }
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {AIFunction} */
function forest_heart_on_hit(self, target, map){
    // Removes health so it can't be damaged again this turn.
    if(self.tile.health !== undefined && self.tile.health > 0){
        var sections = get_forest_heart_sections(self, map);
        var health = self.tile.health;
        for(var section of sections){
            var tile = section.tile;
            // cycle stores the health value so it can be restored.
            tile.cycle = health;
            tile.health = undefined;
            tile.pic = tile.pic_arr[1];
        }
    }
}

/**
 * Function to get an array of each tile in a Forest Heart.
 * @param {AISelfParam} self The tile and location of one section.
 * @param {GameMap} map The map used to locate the sections.
 * @returns {AISelfParam[]} An array with each tile and location in the Forest Heart.
 */
function get_forest_heart_sections(self, map){
    if(self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var tiles = [self];
    // Goes one direction
    var current = self.tile.segment_list[0];
    var next_location = self.location;
    while(current != undefined){
        next_location = next_location.plus(current);
        var next_tile = map.get_tile(next_location);
        if(next_tile.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        tiles.push({
            tile: next_tile,
            location: next_location
        });
        current = next_tile.segment_list[0]
    }
    // Goes the other
    current = self.tile.segment_list[1];
    next_location = self.location;
    while(current != undefined){
        next_location = next_location.plus(current);
        var next_tile = map.get_tile(next_location);
        if(next_tile.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        tiles.push({
            tile: next_tile,
            location: next_location
        });
        current = next_tile.segment_list[1]
    }
    return tiles;
}

/** @type {AIFunction} */
function forest_heart_death(self, target, map){
    var sections = get_forest_heart_sections(self, map);
    for(var section of sections){
        section.tile.on_hit = undefined;
        section.tile.on_death = undefined;
        section.tile.health = 1;
        map.attack(section.location);
    }
    boss_death(self, target, map);
}
/** @type {TileGenerator} */
function lich_tile(){
    var spells = [
        rest_spell_generator(),
        teleport_spell_generator(), 
        summon_spell_generator(), 
        earthquake_spell_generator(), 
        flame_wave_spell_generator(),
        confusion_spell_generator(),
        lava_moat_spell_generator(),
        piercing_beam_spell_generator(),
    ];
    var summons = [
        shadow_scout_tile,
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        clay_golem_tile,
        vampire_tile,
        medium_porcuslime_tile,
        pheonix_tile,
        darkling_tile,
    ];
    var health = 4;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `Lich`,
        pic: spells[starting_cycle].pic,
        description: `${lich_description}${spells[starting_cycle].description}`,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: lich_death_message,
        behavior: lich_ai,
        telegraph: lich_telegraph,
        telegraph_other: lich_telegraph_other,
        on_hit: lich_hit,
        on_death: boss_death,
        cycle: starting_cycle,
        spells,
        summons,
        card_drops: [instant_teleport, debilitating_confusion]
    }
}

/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Move away and prepare the next spell.
        var player_close = (target.difference.within_radius(1));
        var moves = reverse_arr(order_nearby(target.difference));
        for(var i = 0; i < moves.length && !map.check_empty(self.location.plus(moves[i])); ++i){}
        if(i < moves.length){
            map.move(self.location, self.location.plus(moves[i]));
        }
        if(self.tile.cycle === 0){
            self.tile.cycle = random_num(self.tile.spells.length - 2) + 2;
        }
        if(player_close || i >= moves.length){
            self.tile.cycle = 1;
        }
    }
    else{
        // Cast the current spell.
        self.tile.spells[self.tile.cycle].behavior(self, target, map);
        self.tile.cycle = 0;
    }
    self.tile.description = `${lich_description}${self.tile.spells[self.tile.cycle].description}`;
    self.tile.pic = self.tile.spells[self.tile.cycle].pic;
    var announcement = `${lich_announcement}${self.tile.spells[self.tile.cycle].description}`
    map.add_event({name: `spell announcement`, behavior: () => {say(announcement)}});
}

/** @type {TelegraphFunction} */
function lich_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.spells[self.cycle]
    if(spell.telegraph !== undefined){
        return spell.telegraph(location, map, self);
    }
    return rest_spell_telegraph(location, map, self)
}

/** @type {TelegraphFunction} */
function lich_telegraph_other(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.spells[self.cycle]
    if(spell.telegraph_other !== undefined){
        return spell.telegraph_other(location, map, self);
    }
    return rest_spell_telegraph(location, map, self)
}

/** @type {AIFunction} Function used when the lich is hit to have it prep teleport.*/
function lich_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 1;
    self.tile.description = `${lich_description}${self.tile.spells[self.tile.cycle].description}`;
    self.tile.pic = self.tile.spells[self.tile.cycle].pic;
}
/** @type {TileGenerator} */
function spider_queen_tile(){
    var health = 3;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: `enemy`,
        name: `Spider Queen`,
        pic: `${IMG_FOLDER.tiles}spider_queen.png`,
        description: spider_queen_description,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: spider_queen_death_message,
        behavior: spider_ai,
        telegraph: spider_telegraph,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        card_drops: [skitter, bite]
    }
}

/** @type {AIFunction} Function used when the spider queen is hit to stun her and spawn a spider.*/
function spider_queen_hit(self, target, map){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(self.tile);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, self.location);
}
/** @type {TileGenerator} */
function two_headed_serpent_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}serpent_head_sleep.png`, `${IMG_FOLDER.tiles}serpent_head.png`];
    return{
        type: `enemy`,
        name: `Two Headed Serpent`,
        pic: pic_arr[1],
        description: two_headed_serpent_awake_description,
        tags: new TagList([TAGS.boss, TAGS.unmovable]),
        health: 1,
        death_message: two_headed_serpent_death_message,
        behavior: two_headed_serpent_ai,
        telegraph: two_headed_serpent_telegraph,
        on_death: two_headed_serpent_hurt,
        pic_arr,
        cycle: 1,
        segment_list: [undefined, undefined],
        card_drops: [regenerate, fangs]
    }
}
/** @type {TileGenerator} */
function two_headed_serpent_body_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}serpent_body_straight.png`, `${IMG_FOLDER.tiles}serpent_body_bend.png`];
    return{
        type: `terrain`,
        name: `Two Headed Serpent body`,
        pic: pic_arr[0],
        description: two_headed_serpent_body_description,
        tags: new TagList([TAGS.boss, TAGS.unmovable]),
        pic_arr,
        segment_list: [undefined, undefined],
    }
}
/** @type {AIFunction} */
function two_headed_serpent_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle !== 1){
        throw new Error(ERRORS.skip_animation);
    }
    var moved = false;
    var index = serpent_get_direction(self.tile);
    if(!(target.difference.within_radius(1) && target.difference.on_axis())){
        var dir = order_nearby(target.difference);
        for(var i = 0; i < dir.length && !moved; ++i){
            if(dir[i].on_axis()){
                moved = map.move(self.location, self.location.plus(dir[i]));
                if(moved){
                    // Create segment where the head was.
                    var neck = two_headed_serpent_body_tile();
                    if(neck.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    neck.segment_list[1 - index] = dir[i];
                    neck.segment_list[index] = self.tile.segment_list[index]
                    serpent_rotate(neck);
                    map.add_tile(neck, self.location);
                    // Update head
                    self.location.plus_equals(dir[i]);
                    target.difference.plus_equals(dir[i].times(-1));
                    self.tile.segment_list[index] = dir[i].times(-1);
                    serpent_rotate(self.tile);
                    // Drag tail
                    var tail = serpent_other_end(self, index, map);
                    if(tail.tile.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    var last_segment_location = tail.location.plus(ifexists(tail.tile.segment_list[1 - index]));
                    var last_segment = map.get_tile(last_segment_location);
                    if(last_segment.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    tail.tile.segment_list[1 - index] = last_segment.segment_list[1 - index];
                    last_segment.health = 1;
                    map.attack(last_segment_location);
                    map.clear_telegraphs();
                    map.move(tail.location, last_segment_location);
                    serpent_rotate(tail.tile);
                }
            }
        } 
    }
    if(target.difference.within_radius(1) && target.difference.on_axis()){
        map.attack(self.location.plus(target.difference));
    }
    else if(!moved){
        // If stuck, switch heads.
        var tail = serpent_other_end(self, index, map);
        var wake_up = function(map_to_use){
            serpent_wake(tail, map_to_use);
        }
        map.add_event({name: `Wake Up`, behavior: wake_up});
    }
}
/**
 * Recursively finds the other head of the snake.
 * @param {AISelfParam} self The current segment and it's location.
 * @param {Number} index The index to find the next segment using the current one's segment_list.
 * @param {GameMap} map The game map the snake is on.
 * @returns {AISelfParam} The other head and it's location..
 */
function serpent_other_end(self, index, map){
    if(self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var p = self.tile.segment_list[index];
    if(p === undefined){
        return self;
    }
    var next_location = self.location.plus(p);
    var next = {
        location: next_location,
        tile: map.get_tile(next_location)
    }
    return serpent_other_end(next, index, map);
}
/**
 * Finds the index of the provided head's segment list that is being used.
 * @param {Tile} tile The current head.
 * @returns {number} The index.
 */
function serpent_get_direction(tile){
    if(tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return 1 - tile.segment_list.findIndex((element) => element === undefined);
}
/** 
 * Gives the provided segment the correct picture and correct amount of rotation.
 * @param {Tile} tile The tile to rotate.
 */
function serpent_rotate(tile){
    if( tile.pic_arr === undefined || 
        tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var index = serpent_get_direction(tile);
    if(index === 0 || index === 1){
        var p = ifexists(tile.segment_list[index]);
        tile.rotate = 1 - p.x + p.y;
        if(p.y === 0){
            ++tile.rotate;
        }
        tile.rotate *= 90;
    }
    else if(index === 2){
        var p0 = ifexists(tile.segment_list[0]);
        var p1 = ifexists(tile.segment_list[1]);
        if(p0.x === p1.x){
            tile.pic = tile.pic_arr[0];
            tile.rotate = 0;
        }
        else if(p0.y === p1.y){
            tile.pic = tile.pic_arr[0];
            tile.rotate = 90;
        }
        else{
            tile.pic = tile.pic_arr[1];
            var x = p0.x + p1.x;
            var y = p0.y + p1.y;
            tile.rotate = (x + y + 2) / 2;
            if(x < 0 && y > 0){
                tile.rotate = 3;
            }
            tile.rotate = (tile.rotate + 2) % 4;
            tile.rotate *= 90;
        }
    }
}
/**
 * Wakes up the provided head and puts the other to sleep.
 * @param {AISelfParam} self The head to wake up.
 * @param {GameMap} map The map the snake is on.
 */
function serpent_wake(self, map){
    serpent_toggle(self.tile, 1);
    var index = serpent_get_direction(self.tile);
    var tail = serpent_other_end(self, index, map);
    serpent_toggle(tail.tile, 0);
}
/**
 * Wakes a head up or puts it to sleep.
 * @param {Tile} tile The head to alter.
 * @param {number} cycle The cycle to set it to. 1 is awake, 0 is asleep.
 */
function serpent_toggle(tile, cycle){
    if( tile.cycle === undefined || 
        tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    tile.cycle = cycle;
    tile.pic = tile.pic_arr[tile.cycle];
    if(tile.cycle === 1){
        tile.description = two_headed_serpent_awake_description;
    }
    else{
        tile.description = two_headed_serpent_asleep_description;
    }
}
/**
 * @type {AIFunction} Regrows destroyed heads and causes them to wake up. If the snake has no more body segments,
 * it will then be destroyed.
 */
function two_headed_serpent_hurt(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // New head replaces neck segment
    var index = serpent_get_direction(self.tile);
    var neck_location = self.location.plus(ifexists(self.tile.segment_list[index]));
    var neck = map.get_tile(neck_location);
    if(neck.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var regrow = {
        tile: two_headed_serpent_tile(),
        location: neck_location
    }
    if(regrow.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    regrow.tile.segment_list[index] = neck.segment_list[index];
    serpent_rotate(regrow.tile);
    neck.health = 1;
    map.attack(neck_location);
    map.add_tile(regrow.tile, neck_location);
    if(self.tile.cycle != 1){
        stun(regrow.tile);
    }
    serpent_wake(regrow, map);
    // If no segments remain, it dies.
    neck_location = regrow.location.plus(ifexists(regrow.tile.segment_list[index]));
    neck = map.get_tile(neck_location);
    if(neck.name === `Two Headed Serpent`){
        neck.on_death = undefined;
        regrow.tile.on_death = undefined;
        map.attack(neck_location);
        map.attack(regrow.location);
        boss_death(regrow, target, map);
    }
}
/** @type {TelegraphFunction} */
function two_headed_serpent_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = [];
    if(self.cycle === 0){
        return attacks;
    }
    for(var direction of HORIZONTAL_DIRECTIONS){
        attacks.push(location.plus(direction));
    }
    for(var move of HORIZONTAL_DIRECTIONS){
        if(map.check_empty(location.plus(move))){
            for(var direction of HORIZONTAL_DIRECTIONS){
                attacks.push(location.plus(move).plus(direction));
            }
        }
    }
    return attacks;
}

/** @type {TileGenerator} */
function velociphile_tile(){
    var health = 3;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: `enemy`,
        name: `Velociphile`,
        pic: `${IMG_FOLDER.tiles}velociphile.png`,
        description: velociphile_description,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: velociphile_death_message,
        behavior: velociphile_ai,
        telegraph: velociphile_telegraph,
        on_death: boss_death,
        card_drops: [roll_nesw, roll_nwse, roll_ew]
    }
}

/** @type {AIFunction} AI used by the Velociphile.*/
function velociphile_ai(self, target, map){
    // Moves towards the player 2/3 of the time, otherwise moves randomly.
    var directions = order_nearby(target.difference);
    if(random_num(3) === 0){
        directions = randomize_arr(directions);
    }
    // Direction is reselected until an unobstructed one is found.
    var direction = get_empty_nearby(self.location, directions, map);
    if(!(direction === undefined)){
        // Moves in the chosen direction until it hits something, which it then attacks.
        while(map.move(self.location, self.location.plus(direction))){
            self.location.plus_equals(direction);
        }
        map.attack(self.location.plus(direction));
    }
}

/** @type {TelegraphFunction} */
function velociphile_telegraph(location, map, self){
    var attacks = [];
    for(var direction of ALL_DIRECTIONS){
        if(map.check_empty(location.plus(direction))){
            attacks.push(...get_points_in_direction(location.plus(direction), direction, map));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function young_dragon_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}young_dragon_flight.png`, 
        `${IMG_FOLDER.tiles}young_dragon_diagonal_flight.png`,
        `${IMG_FOLDER.tiles}young_dragon_walk.png`,
        `${IMG_FOLDER.tiles}young_dragon_diagonal_walk.png`,
        `${IMG_FOLDER.tiles}young_dragon_breath.png`,
        `${IMG_FOLDER.tiles}young_dragon_diagonal_breath.png`
    ];
    var health = 5;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return {
        type: `enemy`,
        name: `Young Dragon`,
        pic: pic_arr[0],
        description: `${young_dragon_description_arr[0]}${young_dragon_description_arr[1]}`,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: young_dragon_death_message,
        behavior: young_dragon_behavior,
        telegraph: young_dragon_telegraph,
        on_death: boss_death,
        pic_arr,
        description_arr: young_dragon_description_arr,
        rotate: 180,
        cycle: 0,
        range: 3,
        direction: new Point(0, 1),
        card_drops: [firebreathing_horizontal, firebreathing_vertical, firebreathing_ne, firebreathing_nw, glide,
                     soar]
    }
}

/** @type {AIFunction} AI used by the Young Dragon.*/
function young_dragon_behavior(self, target, map){
    if( self.tile.pic_arr === undefined ||
        self.tile.description_arr === undefined ||
        self.tile.rotate === undefined ||
        self.tile.cycle === undefined ||
        self.tile.range === undefined ||
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Flight
        var spaces = [new Point(3, 0), new Point(3, 1), new Point(3, -1), new Point(2, 2),]; 
        spaces.push(...spaces.map((p) => p.rotate(90)));
        spaces.push(...spaces.map((p) => p.rotate(180))); // All rotations of the original are included.
        spaces = randomize_arr(spaces);
        var moved = false;
        var preffered_distance = [4, 3, 5];
        for(let radius of preffered_distance){
            for(let space of spaces){
                if(moved){
                    break;
                }
                // Tries to move to a space the appropriate taxicab distance away from the player.
                var taxi = target.difference.minus(space).taxicab_distance();
                var destination = self.location.plus(space)
                if(!moved && taxi === radius && map.check_empty(destination)){
                    moved = map.move(self.location, destination);
                    self.tile.direction = sign(space);
                }
            }
        }
        for(let space of spaces){
            if(moved){
                break;
            }
            // Instead tries to move to a space that isn't next to the player.
            var next_to = target.difference.minus(space).within_radius(1);
            var destination = self.location.plus(space)
            if(!moved && !(next_to) && map.check_empty(destination)){
                moved = map.move(self.location, destination);
                self.tile.direction = sign(space);
            }
        }
        if(moved){
            ++self.tile.cycle;
            self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
            self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
        }
        return;
    }
    if(self.tile.cycle === 1 && target.difference.taxicab_distance() <= self.tile.range + 1){
        // Aims it's breath.
        self.tile.direction =  order_nearby(target.difference)[0];
        ++self.tile.cycle;
        self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
        self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}${self.tile.range}.`;
        return;
    }
    if(self.tile.cycle === 2){
        // Breathe fire.
        var horizontal_cone = [];
        for(var i = 1; i <= self.tile.range; ++i){
            for(var j = -(i - 1); j < i; ++j){
                // Creates the horizontal cone pattern pointing North.
                horizontal_cone.push(new Point(j, -1 * i));
            }
        }
        var diagonal_cone = [];
        for(let i = 1; i <= self.tile.range; ++i){
            for(let j = 0; j < i; ++j){
                // Creates the diagonal cone pattern ponting North West.
                diagonal_cone.push(new Point(j - i, -1 - j));
            }
        }
        // Choose breath cone for the direction we are facing.
        var cone = [];
        if(self.tile.direction.on_axis()){
            cone = create_orthogonal_cone(self.tile.rotate, self.tile.range);
        }
        else if(self.tile.direction.on_diagonal()){
            cone = create_diagonal_cone(self.tile.rotate, self.tile.range);
        }
        // Breath attack.
        for(let space of cone){
            var target_space = self.location.plus(space)
            map.attack(target_space);
            if(map.check_empty(target_space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, target_space);
            }
        }
    }
    // Prep Flight.
    // Happens when it fails to aim fire breath or after it uses it. 
    var nearby = order_nearby(target.difference)
    if(target.difference.within_radius(2)){
        nearby = nearby.reverse();
    }
    self.tile.direction = nearby[0];
    self.tile.cycle = 0;
    self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
    self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
    return;
}

/** @type {TelegraphFunction} */
function young_dragon_telegraph(location, map, self){
    if( self.rotate === undefined ||
        self.cycle === undefined ||
        self.range === undefined ||
        self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle !== 2){
        return [];
    }
    var cone = [];
    if(self.direction.on_axis()){
        cone = create_orthogonal_cone(self.rotate, self.range);
    }
    else if(self.direction.on_diagonal()){
        cone = create_diagonal_cone(self.rotate, self.range);
    }
    cone = cone.map((p) => p.plus(location));
    return cone;
}
/**
 * Function to create a orthogonal cone of points potruding from the origin.
 * @param {number} rotation A multiple of 90 degrees indicating how much the cone should be rotated from North.
 * @param {number} range The height of the cone.
 * @returns {Point[]} The resulting cone.
 */
function create_orthogonal_cone(rotation, range){
    var cone = [];
    for(var i = 1; i <= range; ++i){
        for(var j = -(i - 1); j < i; ++j){
            cone.push((new Point(j, -1 * i)).rotate(rotation));
        }
    }
    return cone;
}
/**
 * Function to create a diagonal cone of points potruding from the origin.
 * @param {number} rotation A multiple of 90 degrees indicating how much the cone should be rotated from North West.
 * @param {number} range The height of the cone.
 * @returns {Point[]} The resulting cone.
 */
function create_diagonal_cone(rotation, range){
    var cone = [];
    for(var i = 1; i <= range; ++i){
        for(var j = 0; j < i; ++j){
            cone.push((new Point(j - i, -1 - j)).rotate(rotation));
        }
    }
    return cone;
}
/** @type {TileGenerator} */
function acid_bug_tile(){
    return {
        type: `enemy`,
        name: `Acid Bug`,
        pic: `${IMG_FOLDER.tiles}acid_bug.png`,
        description: acid_bug_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        telegraph_other: spider_telegraph,
        on_death: acid_bug_death,
    }
}

/** @type {AIFunction} Function used when acid bugs die to explode and harm everything around them.*/
function acid_bug_death(self, target, map){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var attack of attacks){
        map.attack(self.location.plus(attack));
    }
}
/** @type {TileGenerator} Generates a camoflauged boulder elemental. */
function boulder_elemental_tile(){
    var tile = boulder_elemental_look();
    shapeshift(tile, ifexists(tile.look_arr)[0]);
    return tile;
}

/** @type {TileGenerator} Generates an uncomoflauged boulder elemental. */
function boulder_elemental_look(){
    return {
        type: `enemy`,
        name: `Boulder Elemental`,
        pic: `${IMG_FOLDER.tiles}boulder_elemental.png`,
        description: boulder_elemental_description,
        tags: new TagList([TAGS.unmovable, TAGS.hidden]),
        behavior: boulder_elemental_ai,
        telegraph: spider_telegraph,
        on_enter: boulder_elemental_wake_up,
        on_hit: boulder_elemental_wake_up,
        look_arr: [magmatic_boulder_tile, boulder_elemental_look],
        cycle: 0
    }
}


/** @type {AIFunction} AI used by boulder elementals.*/
function boulder_elemental_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 0){
        // Asleep.
        throw new Error(ERRORS.skip_animation);
    }
    if(self.tile.cycle < 0){
        // Asleep and resting.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    var nearby = order_nearby(target.difference);
    var hit = false;
    for(let space of nearby){
        // Attacks everything nearby.
        hit = map.attack(self.location.plus(space)) || hit;
    }
    // Gets sleepier
    --self.tile.cycle;
    if(self.tile.cycle <= 0){
        // Falls asleep.
        shapeshift(self.tile, self.tile.look_arr[0]);
        self.tile.tags.add(TAGS.hidden);
        self.tile.cycle = -2;
    }
    else if(!target.difference.within_radius(1)){
        // If not asleep, moves towards the player.
        move_closer_ai(self, target, map);
    }
}
/** @type {AIFunction} boulder elemental wakes up when touched.*/
function boulder_elemental_wake_up(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 0){
        stun(self.tile);
        self.tile.cycle = 3;
        shapeshift(self.tile, self.tile.look_arr[1]);
        self.tile.tags.remove(TAGS.hidden);
    }
}


/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `Brightling`,
        pic: `${IMG_FOLDER.tiles}brightling.png`,
        description: brightling_description,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        cycle: starting_cycle

    }
}

/** @type {AIFunction} AI used by brightlings.*/
function brightling_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === -1){
        // teleports to a random empty space, then cycle goes to 0.
        teleport_spell(self, target, map);
        ++self.tile.cycle;
        return;
    }
    var near_points = random_nearby();
    if(random_num(4) < self.tile.cycle && !target.tile.tags.has(TAGS.unmovable)){
        // Attempts to teleport the player next to it, then cycle goes to -1 to prepare to teleport next turn.
        for(var near of near_points){
            if(map.check_empty(self.location.plus(near))){
                map.move(self.location.plus(target.difference), self.location.plus(near));
                self.tile.cycle = -1;
                // Since player has been moved, it returns to their turn.
                throw new Error(ERRORS.pass_turn);
            }
        }
    }
    // Moves 2 spaces randomly and increments cycle.
    for(var i = 0; i < 2; ++i){
        var moved = map.move(self.location, self.location.plus(near_points[i]));
        if(moved){
            self.location.plus_equals(near_points[i])
        }
    }
    ++self.tile.cycle;
}
/** @type {TileGenerator} */
function captive_void_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}captive_void_on.png`, `${IMG_FOLDER.tiles}captive_void_off.png`];
    var starting_cycle = 0;
    return {
        type: `enemy`,
        name: `Captive Void`,
        pic: pic_arr[starting_cycle],
        description: captive_void_description,
        tags: new TagList([TAGS.unmovable]),
        difficulty: 2,
        behavior: captive_void_ai,
        on_hit: captive_void_on_hit,
        telegraph_other: captive_void_telegraph_other,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction}.*/
function captive_void_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var moved_player = false;
        var spaces = get_2_away();
        for(var space of spaces){
            var start = self.location.plus(space);
            var end = self.location.plus(sign(space));
            if(map.is_in_bounds(start) && !map.check_empty(start) && !map.get_tile(start).tags.has(TAGS.unmovable)){
                var moved = map.move(start, end)
                if(moved && map.get_tile(end).type === `player`){
                    moved_player = true;
                }
            }
        }
        if(moved_player){
            throw new Error(ERRORS.pass_turn);
        }
    }
    else{
        --self.tile.cycle;
        if(self.tile.cycle === 0){
            self.tile.pic = self.tile.pic_arr[0];
        }
    }
}

/** @type {AIFunction}.*/
function captive_void_on_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 2;
    self.tile.pic = self.tile.pic_arr[1];
}

/** @type {TelegraphFunction} */
function captive_void_telegraph_other(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spaces = [];
    if(self.cycle === 0){
        spaces = get_2_away().map(p => {
            return location.plus(p);
        });
    }
    return spaces;
}
/** @type {TileGenerator} */
function carrion_flies_tile(){
    return {
        type: `enemy`,
        name: `Carrion Flies`,
        pic: `${IMG_FOLDER.tiles}carrion_flies.png`,
        description: carrion_flies_description,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: carrion_flies_ai,
        telegraph: spider_telegraph,
        cycle: random_num(2),
        spawn_timer: 3
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function carrion_flies_ai(self, target, map){
    if( self.tile.cycle === undefined ||
        self.tile.spawn_timer === undefined){
        throw new Error(ERRORS.missing_property);
    }
    ++self.tile.cycle;
    if(self.tile.cycle === self.tile.spawn_timer){
        // When the cycle reaches the spawn timer, spawn and reset it while increasing the time until the next one.
        self.tile.spawn_timer += 2;
        self.tile.cycle = 0;
        var new_tile = carrion_flies_tile()
        new_tile.spawn_timer = self.tile.spawn_timer;
        spawn_nearby(map, new_tile, self.location);
    }
    if(target.difference.within_radius(1)){
        // Attack the player if they are close.
        map.attack(self.location.plus(target.difference));
    }
    else{
        // Move randomly.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(self.location, self.location.plus(near_points[i])); ++i){}
    }
}
/** @type {TileGenerator} */
function clay_golem_tile(){
    return {
        type: `enemy`,
        name: `Clay Golem`,
        pic: `${IMG_FOLDER.tiles}clay_golem.png`,
        description: clay_golem_description,
        tags: new TagList(),
        health: 3,
        difficulty: 4,
        behavior: clay_golem_ai,
        telegraph: spider_telegraph,
        on_hit: clay_golem_hit,
        cycle: 1
    }
}

/** @type {AIFunction} AI used by clay golems.*/
function clay_golem_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = 1;
    }
    else if(self.tile.cycle === 1){
        // Otherwise, move closer if it didn't move last turn.
        move_closer_ai(self, target, map);
        self.tile.cycle = 0;
    }
    else{
        // Otherwise, it moved last turn so don't move.
        self.tile.cycle = 1;
    }
}
/** @type {AIFunction} Function used when clay golems are hit to stun them.*/
function clay_golem_hit(self, target, map){
    stun(self.tile);
}
/** @type {TileGenerator} */
function corrosive_caterpillar_tile(){
    return {
        type: `enemy`,
        name: `Corrosive Caterpillar`,
        pic: `${IMG_FOLDER.tiles}corrosive_caterpillar.png`,
        description: corrosive_caterpillar_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death
    }
}

/** @type {AIFunction} AI used by corrosive catterpillars.*/
function corrosive_caterpillar_ai(self, target, map){
    for(var i = 0; i < 2; ++i){
        var direction = get_empty_nearby(self.location, random_nearby(), map);
        if(!(direction === undefined)){
            if(map.move(self.location, self.location.plus(direction))){
                map.add_tile(corrosive_slime_tile(), self.location);
            }
            self.location.plus_equals(direction);
        }
    }
}
/** @type {AIFunction} Function used on corrosive catterpillar death to slime where they were.*/
function corrosive_caterpillar_death(self, target, map){
    map.add_tile(corrosive_slime_tile(), self.location);
}
/** @type {TileGenerator} */
function darkling_tile(){
    return {
        type: `enemy`,
        name: `Darkling`,
        pic: `${IMG_FOLDER.tiles}darkling.png`,
        description: darkling_description,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: darkling_ai,
        telegraph: darkling_telegraph
    }
}

/** @type {AIFunction} AI used by darklings.*/
function darkling_ai(self, target, map){
    if(self.tile.direction !== undefined){
        // Teleport to it's rift.
        var moved = map.move(self.location, self.tile.direction);
        if(moved){
            // If moved, attack around it.
            attack_around(self.tile.direction, map);
        }
        else{
            // If something is blocking the rift, it dies.
            map.attack(self.location);
            return;
        }
    }
    // Create a new rift for next turn.
    self.tile.direction = map.random_empty();
    var darkling_rift = function(map_to_use){
        if(self.tile.health === undefined || self.tile.health > 0){
            var rift = {
                pic: `${IMG_FOLDER.tiles}darkling_rift.png`,
                description: darkling_rift_description,
                telegraph: spider_telegraph
            }
            map_to_use.mark_event(self.tile.direction, rift, false);
        }
    }
    map.add_event({name: `Darkling Rift`, behavior: darkling_rift});
}

/** @type {TelegraphFunction} */
function darkling_telegraph(location, map, self){
    if(self.direction === undefined){
        return [];
    }
    return spider_telegraph(self.direction, map, self);
}
/** @type {TileGenerator} A crab which flees when hit. */
function igneous_crab_tile(){
    return {
        type: `enemy`,
        name: `Igneous Crab`,
        pic: `${IMG_FOLDER.tiles}igneous_crab.png`,
        description: igneous_crab_description,
        tags: new TagList(),
        health: 2,
        difficulty: 3,
        behavior: igneous_crab_ai,
        telegraph: igneous_crab_telegraph,
        on_hit: igneous_crab_hit,
        cycle: 0
    }
}

/** @type {AIFunction} AI used by igneous crabs.*/
function igneous_crab_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle > 0){
        var directions = reverse_arr(order_nearby(target.difference));
        for(var i = 0; i < directions.length && !map.move(self.location, self.location.plus(directions[i])); ++i){}
        --self.tile.cycle;
    }
    else{
        if(target.difference.within_radius(1)){
            map.attack(self.location.plus(target.difference));
        }
        else{
            var directions = order_nearby(target.difference);
            for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
            if(i < directions.length){
                map.move(self.location, self.location.plus(directions[i]));
            }
        }
    }
}
/** @type {AIFunction} Used to cause igneous crabs to flee when damaged.*/
function igneous_crab_hit(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property)
    }
    self.tile.cycle += 2;
}
/** @type {TelegraphFunction} Function to telegraph igneous crab attacks.*/
function igneous_crab_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle > 0){
        return [];
    }
    return spider_telegraph(location, map, self);
}


/** @type {TileGenerator} */
function living_tree_tile(){
    return {
        type: `enemy`,
        name: `Living Tree`,
        pic: `${IMG_FOLDER.tiles}living_tree.png`,
        description: living_tree_description,
        tags: new TagList(),
        health: 2,
        difficulty: 7,
        behavior: living_tree_ai,
        telegraph: living_tree_telegraph,
        cycle: random_num(2)
    }
}

/** @type {AIFunction} AI used by living trees.*/
function living_tree_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // Checks if it can attack the player.
    var hits = get_2_away().filter(p => {
        return point_equals(p, target.difference);
    });
    if(hits.length > 0){
        map.attack(self.location.plus(target.difference));
        return;
    }
    if(self.tile.cycle === 0){
        self.tile.cycle = 1 - self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    // Orders the places it could move.
    var directions = order_nearby(target.difference);
    if(target.difference.within_radius(1)){
        directions = reverse_arr(directions);
    }
    // Carefully tries to move.
    for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
    if(i < directions.length){
        var move = directions[i];
        map.move(self.location, self.location.plus(move));
    }
    self.tile.cycle = 1 - self.tile.cycle;
}


/** @type {TelegraphFunction} Function to telegraph living tree attacks.*/
function living_tree_telegraph(location, map, self){
    return get_2_away().map(p => {
        return p.plus(location);
    })
}

/** @type {TileGenerator} */
function living_tree_rooted_tile(){
    return {
        type: `enemy`,
        name: `Living Tree`,
        pic: `${IMG_FOLDER.tiles}living_tree_rooted.png`,
        description: living_tree_rooted_description,
        tags: new TagList(),
        health: 2,
        behavior: living_tree_rooted_ai,
        telegraph: living_tree_telegraph
    }
}

/** @type {AIFunction} AI used by living trees that are rooted.*/
function living_tree_rooted_ai(self, target, map){
    // Checks if it can attack the player.
    var hits = get_2_away().filter(p => {
        return point_equals(p, target.difference);
    });
    if(hits.length > 0){
        map.attack(self.location.plus(target.difference));
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}


/** @type {TileGenerator} */
function magma_spewer_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}magma_spewer.png`, `${IMG_FOLDER.tiles}magma_spewer_firing.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: `enemy`,
        name: `Magma Spewer`,
        pic: `${IMG_FOLDER.tiles}magma_spewer.png`,
        description: magma_spewer_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: magma_spewer_ai,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by magma spewers.*/
function magma_spewer_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 0){
        // Move away if the player gets close.
        if(target.difference.within_radius(2)){
            var directions = order_nearby(target.difference.times(-1));
            var moved = false;
            for(var i = 0; i < directions.length && !moved; ++i){
                if(map.check_empty(self.location.plus(directions[i]))){
                    map.move(self.location, self.location.plus(directions[i]));
                    self.location.plus_equals(directions[i]);
                    moved = true;
                }
            }
        }
    }
    else{
        // Spew Magma.
        var locations = [];
        var center = self.location.plus(target.difference);
        for(var i = -2; i <= 2; ++i){
            for(var j = -2; j <= 2; ++j){
                locations.push(center.plus(new Point(i, j)));
            }
        }
        map.add_event({name: `Falling Magma`, behavior: earthquake_event(random_num(4) + 4, locations)})
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}
/** @type {TileGenerator} */
function noxious_toad_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}noxious_toad_leaping.png`, `${IMG_FOLDER.tiles}noxious_toad.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: `enemy`,
        name: `Noxious Toad`,
        pic: pic_arr[starting_cycle],
        description: noxious_toad_description, 
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: noxious_toad_ai,
        telegraph: noxious_toad_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by noxious toads.*/
function noxious_toad_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var directions = order_nearby(target.difference);
        var moved = false;
        for(var i = 0; i < directions.length && !moved; ++i){
            // Leap orthogonally closer.
            if(directions[i].on_axis()){
                moved = map.move(self.location, self.location.plus(directions[i].times(2)));
                if(moved){
                    self.location.plus_equals(directions[i].times(2));
                    target.difference.minus_equals(directions[i].times(2))
                }
            }
        }
        if(moved){
            self.tile.cycle = 1;
            if(target.difference.within_radius(1)){
                // If it landed near the player, attack everything nearby.
                attack_around(self.location, map);
            }
        }
    }
    else{
        // Prepare to leap.
        self.tile.cycle = 0;
    }
    self.tile.pic = self.tile.pic_arr[self.tile.cycle]
}

/** @type {TelegraphFunction} */
function noxious_toad_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = [];
    if(self.cycle === 1){
        return attacks;
    }
    for(var direction of HORIZONTAL_DIRECTIONS){
        var move = location.plus(direction.times(2));
        if(map.check_empty(move)){
            attacks.push(...spider_telegraph(move, map, self));
        }
        
    }
    return attacks;
}
/** @type {TileGenerator} */
function orb_of_insanity_tile(){
    var range = 2;
    var pic_arr = [`${IMG_FOLDER.tiles}orb_of_insanity_off.png`, `${IMG_FOLDER.tiles}orb_of_insanity_on.png`];
    return {
        type: `enemy`,
        name: `Orb of Insanity`,
        pic: pic_arr[0],
        description: `${orb_of_insanity_description[0]}${range}${orb_of_insanity_description[1]}`,
        tags:  new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 3,
        behavior: orb_of_insanity_ai,
        telegraph_other: orb_of_insanity_telegraph_other,
        pic_arr,
        range
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function orb_of_insanity_ai(self, target, map){
    if( self.tile.range === undefined ||
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(self.tile.range)){
        map.stun_tile(self.location.plus(target.difference));
        self.tile.pic = self.tile.pic_arr[1];
    }
    else{
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function orb_of_insanity_telegraph_other(location, map, self){
    if(self.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var area = [];
    for(var i = -1 * self.range; i <= self.range; ++i){
        for(var j = -1 * self.range; j <= self.range; ++j){
            if(i !== 0 || j !== 0){
                area.push(location.plus(new Point(i, j)));
            }
        }
    }
    return area;
}
/** @type {TileGenerator} */
function paper_construct_tile(){
    return{
        type: `enemy`,
        name: `Paper Construct`,
        pic: `${IMG_FOLDER.tiles}paper_construct.png`,
        description: paper_construct_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: paper_construct_ai,
        telegraph: porcuslime_horizontal_telegraph,
        rotate: 90 * random_num(4)
    }
}

/** @type {AIFunction} AI used by scythes.*/
function paper_construct_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(target.difference.within_radius(2) && target.difference.on_axis()){
        // If the player is within range, attacks.
        var direction = sign(target.difference);
        var space = self.location.plus(direction)
        for(var i = 0; i < 2 && !map.attack(space) && map.check_empty(space); ++i){
            space.plus_equals(direction);
        }
    }
    else{
        // Choose a open direction nearest to towards the player.
        var directions = order_nearby(target.difference);
        var dir = undefined;
        for(var i = 0; i < directions.length && !dir; ++i){
            if(directions[i].on_diagonal() && map.check_empty(self.location.plus(directions[i]))){
                dir = directions[i];
            }
        }
        if(dir){
            // Move up to 2 spaces in that direction.
            var moved = true;
            for(var i = 0; i < 2 && !(target.difference.on_axis() && target.difference.within_radius(2)) && moved; ++i){
                moved = map.move(self.location, self.location.plus(dir));
                if(moved){
                    self.location.plus_equals(dir);
                    target.difference.minus_equals(dir);
                }
            }
        }
    }
    // Face it towards the player;
    self.tile.direction = order_nearby(target.difference).filter(p => {
        return p.on_axis();
    })[0];
    set_rotation(self.tile);
}

/** @type {TileGenerator} Function to act as a starting point for making new enemies. */
function pheonix_tile(){
    return {
        type: `enemy`,
        name: `Pheonix`,
        pic: `${IMG_FOLDER.tiles}pheonix.png`,
        description: pheonix_description,
        tags: new TagList(),
        health: 1,
        difficulty: 5,
        behavior: pheonix_ai,
        telegraph: pheonix_telegraph,
        on_death: pheonix_death
    }
}


/** @type {AIFunction} AI used by pheonixes.*/
function pheonix_ai(self, target, map){
    var direction = new Point(0, 0);
    var distance = 0;
    if((target.difference.on_axis() || target.difference.on_diagonal()) && target.difference.within_radius(2)){
        // Sees the player and tries to attack them.
        var direction = sign(target.difference);
        if(map.check_empty(self.location.plus(direction.times(3)))){
            distance = 3;
        }
        else if(map.check_empty(self.location.plus(direction.times(2)))){
            distance = 2;
        }
        
    }
    var directions = order_nearby(target.difference);
    for(var i = 0; i < directions.length && distance === 0; ++i){
        // otherwise it flies towards them.
        direction = directions[i];
        for(var j = 3; j > 1 && distance === 0; --j){
            if(map.check_empty(self.location.plus(direction.times(j)))){
                distance = j;
            }
        }
    }
    if(distance > 0){
        map.move(self.location, self.location.plus(direction.times(distance)));
        for(var i = 0; i < distance; ++i){
            var space = self.location.plus(direction.times(i))
            map.attack(space);
            if(map.check_empty(space)){
                map.add_tile(raging_fire_tile(), space);
            }
        }
        self.location.plus_equals(direction.times(distance));
    }
}
/** @type {AIFunction} Spawns smoldering ashes on death.*/
function pheonix_death(self, target, map){
    map.add_tile(smoldering_ashes_tile(), self.location);
}
/** @type {TelegraphFunction} Function to telegraph pheonix attacks.*/
function pheonix_telegraph(location, map, self){
    var nearby = random_nearby();
    var telegraph = [];
    for(var direction of nearby){
        var distance = 0
        for(var j = 3; j > 1 && distance === 0; --j){
            if(map.check_empty(location.plus(direction.times(j)))){
                distance = j;
            }
        }
        for(var i = 0; i < distance; ++i){
            telegraph.push(location.plus(direction.times(i)));
        }
    }
    return telegraph;
}


/** @type {TileGenerator} */
function large_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `Large Porcuslime`,
        pic: `${IMG_FOLDER.tiles}large_porcuslime.png`,
        description: large_porcuslime_description,
        tags: new TagList(),
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
        telegraph: large_porcuslime_telegraph
    }
}

/** @type {AIFunction} AI used by large porcuslimes.*/
function large_porcuslime_ai(self, target, map){
    if(self.tile.health !== undefined && self.tile.health === 2){
        // If health is 2, turns into the medium version.
        map.attack(self.location);
        map.attack(self.location);
        map.clear_telegraphs();
        map.add_tile(medium_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        map.clear_telegraphs();
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_h_porcuslime_tile(), self.location);
        return;
    }
    var direction = sign(target.difference);
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}

/** @type {TelegraphFunction} */
function large_porcuslime_telegraph(location, map, self){
    return porcuslime_diagonal_telegraph(location, map, self).concat(porcuslime_horizontal_telegraph(location, map, self));
}
/** @type {TileGenerator} */
function medium_porcuslime_tile(){
    var starting_cycle = random_num(2);
    var pic_arr = [`${IMG_FOLDER.tiles}medium_h_porcuslime.png`, `${IMG_FOLDER.tiles}medium_d_porcuslime.png`];
    return {
        type: `enemy`,
        name: `Medium Porcuslime`,
        pic: pic_arr[starting_cycle],
        description: medium_porcuslime_description,
        tags: new TagList(),
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        telegraph: medium_porcuslime_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by medium porcuslimes.*/
function medium_porcuslime_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        map.clear_telegraphs();
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_h_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.cycle === 0){
        // If cycle is at 0, direction will be orthogonally towards the player.
        porcuslime_horizontal_ai(self, target, map);
    }
    else{
        // If cycle is at 1, direction will be diagonally towards the player.
        porcuslime_diagonal_ai(self, target, map);
    }
    // Swaps cycle and picture between the two.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function medium_porcuslime_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return porcuslime_horizontal_telegraph(location, map, self);
    }
    return porcuslime_diagonal_telegraph(location, map, self);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving diagonally.*/
function porcuslime_diagonal_ai(self, target, map){
    // Small version which moves then attacks diagonally.
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first diagonal direction.
        if(directions[i].on_diagonal()){
            direction = directions[i];
        }
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving orthogonally.*/
function porcuslime_horizontal_ai(self, target, map){
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first orthogonal direction.
        if(directions[i].on_axis()){
            direction = directions[i];
        }
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}

/** @type {TelegraphFunction} */
function porcuslime_diagonal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, DIAGONAL_DIRECTIONS).concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function porcuslime_horizontal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, HORIZONTAL_DIRECTIONS).concat(hazard_telegraph(location, map, self));
}
/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `Small Porcuslime`,
        pic: `${IMG_FOLDER.tiles}small_d_porcuslime.png`,
        description: small_d_porcuslime_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
        telegraph: porcuslime_diagonal_telegraph,
    }
}
/** @type {TileGenerator} */
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `Small Porcuslime`,
        pic: `${IMG_FOLDER.tiles}small_h_porcuslime.png`,
        description: small_h_porcuslime_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai,
        telegraph: porcuslime_horizontal_telegraph,
        }
}
/** @type {TileGenerator} */
function ram_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}ram.png`, `${IMG_FOLDER.tiles}ram_charge.png`];
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `Ram`,
        pic: pic_arr[starting_cycle],
        description: ram_description,
        tags: new TagList(),
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        telegraph: ram_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by rams.*/
function ram_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    var direction = sign(target.difference);
    var other_direction = sign(target.difference);
    var wander_speed = 2;
    var moved = true;
    var amount_moved = 0;
    if(self.tile.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        if(Math.abs(target.difference.x) <= Math.abs(target.difference.y)){
            direction.y = 0;
            other_direction.x = 0;
        }
        else{
            direction.x = 0;
            other_direction.y = 0;
        }
        for(var i = 0; i < wander_speed && !target.difference.on_axis() && moved; ++i){
            // Attempts to move towards the closest row or column that they are in.
            moved = map.move(self.location, self.location.plus(direction));
            if(moved){
                self.location.plus_equals(direction);
                target.difference.minus_equals(direction);
                ++amount_moved;
            }
        }
        if(amount_moved === 0){
            // Moves towards them instead.
            direction = other_direction;
            moved = true;
            for(var i = 0; i < wander_speed && !target.difference.on_axis() && moved; ++i){
                // Attempts to move towards the closest row or column that they are in.
                moved = map.move(self.location, self.location.plus(direction));
                if(moved){
                    self.location.plus_equals(direction);
                    target.difference.minus_equals(direction);
                    ++amount_moved;
                }
            }
        }

        if(target.difference.on_axis()){
            // If it sees them, prepares to charge.
            self.tile.cycle = 1;
            self.tile.pic = self.tile.pic_arr[self.tile.cycle];
        }
    }
    else{
        // Charges orthogonally until it hits something and rams it.
        // Reverts to wandering after.
        if(Math.abs(target.difference.x) > Math.abs(target.difference.y)){
            direction.y = 0;
        }
        else{
            direction.x = 0;
        }
        while(moved){
            moved = map.move(self.location, self.location.plus(direction));
            self.location.plus_equals(direction);
        }
        map.attack(self.location);
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    }
}

/** @type {TelegraphFunction} */
function ram_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return [];
    }
    return turret_h_telegraph(location, map, self);
}
/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: `enemy`,
        name: `Rat`,
        pic: `${IMG_FOLDER.tiles}rat.png`,
        description: rat_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        telegraph: rat_telegraph,
        flip: random_num(2) === 0,
        cycle: 1
    }
}

/** @type {AIFunction} AI used by rats.*/
function rat_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle >= 1 && target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = -1;
    }
    // Move 2 spaces.
    for(var i = 0; i < 2; ++i){
        var directions = order_nearby(target.difference);
        if(self.tile.cycle <= 0){
            // If they bit the player within 2 turns, move away. Otherwise move closer.
            directions = reverse_arr(directions);
        }
        var moved = false;
        for(var j = 0; j < directions.length && !moved; ++j){
            moved = map.move(self.location, self.location.plus(directions[j]));
            if(moved){
                self.location.plus_equals(directions[j])
                target.difference.minus_equals(directions[j])
                if(directions[j].x < 0){
                    self.tile.flip = false;
                }
                if(directions[j].x > 0){
                    self.tile.flip = true;
                }
            }
        }
    }
    ++self.tile.cycle;
}

/** @type {TelegraphFunction} Function to telegraph rat attacks.*/
function rat_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle >= 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TileGenerator} */
function scorpion_tile(){
    return {
        type: `enemy`,
        name: `Scorpion`,
        pic: `${IMG_FOLDER.tiles}scorpion.png`,
        description: scorpion_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: scorpion_ai,
        telegraph: spider_telegraph,
        flip: random_num(2) === 0,
        cycle: random_num(2)
    }
}

/** @type {AIFunction} AI used by scorpion.*/
function scorpion_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = 0;
        return;
    }
    // Move 2 spaces.
    if(self.tile.cycle === 1){
        for(var i = 0; i < 2; ++i){
            var directions = order_nearby(target.difference);
            var moved = false;
            for(var j = 0; j < directions.length && !moved; ++j){
                var destination = self.location.plus(directions[j]);
                moved = map.check_empty(destination);
                if(moved){
                    map.move(self.location, destination);
                    self.location.plus_equals(directions[j]);
                    target.difference.minus_equals(directions[j]);
                    if(directions[j].x < 0){
                        self.tile.flip = false;
                    }
                    if(directions[j].x > 0){
                        self.tile.flip = true;
                    }
                }
            }
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    if(self.tile.cycle === 1){
        throw new Error(ERRORS.skip_animation);
    }
}
/** @type {TileGenerator} */
function scythe_tile(){
    return{
        type: `enemy`,
        name: `Scythe`,
        pic: `${IMG_FOLDER.tiles}scythe.png`,
        description: scythe_description,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: scythe_ai,
        telegraph: scythe_telegraph,
        rotate: 90 * random_num(4)
    }
}

/** @type {AIFunction} AI used by scythes.*/
function scythe_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property)
    }
    var distance = 3;
    self.tile.direction = sign(target.difference);
    if(self.tile.direction.on_axis()){
        // If the player is orthogonal, moves randomly.
        self.tile.direction = new Point(random_sign(), random_sign());
    }
    // Rotate image based on direction.
    var direction = self.tile.direction;
    set_rotation(self.tile);
    for(var i = 0; i < distance && map.move(self.location, self.location.plus(direction)) ; ++i){
        // moves <distance> spaces attacking each space it passes next to. Stops when blocked.
        self.location.plus_equals(direction);
        target.difference.minus_equals(direction);
        var passed = [new Point(direction.x, 0), new Point(0, direction.y)];
        for(var p of passed){
            if(point_equals(target.difference, p.times(-1)) || map.check_empty(self.location.minus(p))){
                map.attack(self.location.minus(p));
            }
        }
    }
}

/** @type {TelegraphFunction} */
function scythe_telegraph(location, map, self){
    var attacks = [];
    for(var direction of DIAGONAL_DIRECTIONS){
        var current = location.copy();
        for(var i = 0; i < 3 && map.check_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
const L_SHAPES = [new Point(1, 2), new Point(-1, 2), new Point(1, -2), new Point(-1, -2),
                  new Point(2, 1), new Point(-2, 1), new Point(2, -1), new Point(-2, -1)];

/** @type {TileGenerator} */
function shadow_knight_tile(){
    return{
        type: `enemy`,
        name: `Shadow Knight`,
        pic: `${IMG_FOLDER.tiles}shadow_knight.png`,
        description: shadow_knight_description,
        tags: new TagList(),
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
        telegraph: shadow_knight_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_ai(self, target, map){
    // Moves in an L.
    if(target.difference.on_diagonal() && target.difference.within_radius(1)){
        // If the player is next to it diagonally, attempty to reposition to attack them next turn.
        if(map.move(self.location, self.location.plus(sign(target.difference).times(new Point(2, -1)))) ||
           map.move(self.location, self.location.plus(sign(target.difference).times(new Point(-1, 2))))){
            return;
        }
    }
    if(target.difference.taxicab_distance() === 3 && !target.difference.on_axis()){
        // If the player is a L away, attack them then try to move past them.
        map.attack(self.location.plus(target.difference));
        map.move(self.location, self.location.plus(target.difference.times(new Point(2, 2))));
        return;
    }
    // Otherwise, attempt to move closer
    if(Math.abs(target.difference.x) >= Math.abs(target.difference.y)){
        var new_dir = new Point(2, 1);
    }
    else{
        var new_dir = new Point(1, 2);
    }
    if(target.difference.x < 0){
        new_dir.x *= -1;
    }
    if(target.difference.y < 0){
        new_dir.y *= -1;
    }
    if(!map.move(self.location, self.location.plus(new_dir))){
        var directions = randomize_arr(L_SHAPES);
        for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0); ++i){
            if(map.move(self.location, self.location.plus(directions[i]))){
                self.location.plus_equals(directions[i]);
                return;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function shadow_knight_telegraph(location, map, self){
    var attacks = [];
    var Ls = [new Point(1, 2), new Point(2, 1)];
    for(var L of  Ls){
        for(var transformation of DIAGONAL_DIRECTIONS){
            attacks.push(L.times(transformation).plus(location));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function shadow_scout_tile(){
    var look_arr = [empty_tile, shadow_scout_tile];
    var starting_cycle = random_num(2);
    return {
        type: `enemy`,
        name: `Shadow Scout`,
        pic: `${IMG_FOLDER.tiles}shadow_scout.png`,
        description: shadow_scout_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: shadow_scout_ai,
        telegraph: spider_telegraph,
        look_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function shadow_scout_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 1 - self.tile.cycle;
    // Goes invisible on alternate turns.
    shapeshift(self.tile, self.tile.look_arr[self.tile.cycle]);
    self.tile.cycle === 0 ? self.tile.tags.add(TAGS.hidden) : self.tile.tags.remove(TAGS.hidden);
    spider_ai(self, target, map);
}
/** @type {TileGenerator} */
function spider_tile(){
    return {
        type: `enemy`,
        name: `Spider`,
        pic: `${IMG_FOLDER.tiles}spider.png`,
        description: spider_description,
        tags: new TagList(),
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        telegraph: spider_telegraph
    }
}

/** @type {AIFunction} AI used by spiders and the Spider Queen.*/
function spider_ai(self, target, map){
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
    }
    else{
        // Otherwise, move closer.
        move_closer_ai(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function spider_telegraph(location, map, self){
    return ALL_DIRECTIONS.map(a => a.plus(location));
}
/** @type {TileGenerator} */
function spider_web_tile(){
    var spawn_timer = 2
    return{
        type: `enemy`,
        name: `Spider Web`,
        pic: `${IMG_FOLDER.tiles}spider_web.png`,
        description: `${spider_web_description[0]}${spawn_timer + 1}${spider_web_description[1]}`,
        tags:  new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 4,
        behavior: spider_web_ai,
        cycle: 0,
        spawn_timer
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function spider_web_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    else{
        // Attempts to spawn a spider nearby and resets cycle.
        spawn_nearby(map, spider_tile(), self.location);
        self.tile.cycle = 0;
        ++self.tile.spawn_timer;
    }
}
/** @type {TileGenerator} */
function strider_tile(){
    return{
        type: `enemy`,
        name: `Strider`,
        pic: `${IMG_FOLDER.tiles}strider.png`,
        description: strider_description,
        tags: new TagList(),
        health: 2,
        difficulty: 5,
        behavior: strider_ai,
        telegraph: strider_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function strider_ai(self, target, map){
    if(random_num(2) === 0){
        var moves = random_nearby();
    }
    else{
        var moves = order_nearby(target.difference);
    }
    moves = moves.map(move => move.times(2));
    for(let move of moves){
        if(point_equals(move, target.difference)){
            map.attack(self.location.plus(target.difference));
        }
    }
    var moved = false;
    for(var i = 0; i < moves.length && !moved; ++i){
        var destination = self.location.plus(moves[i]);
        if(map.check_empty(destination)){
            moved = map.move(self.location, destination);
        }
    }
}

/** @type {TelegraphFunction} */
function strider_telegraph(location, map, self){
    var attacks = random_nearby();
    return attacks.map(attack => location.plus(attack.times(2)));
}
/** @type {TileGenerator} */
function swaying_nettle_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}swaying_nettle_x.png`, `${IMG_FOLDER.tiles}swaying_nettle_+.png`];
    var starting_cycle = random_num(2);
    return{
        type: `enemy`,
        name: `Swaying Nettle`,
        pic: pic_arr[starting_cycle],
        description: swaying_nettle_description,
        tags: new TagList([TAGS.unmovable, TAGS.nettle_immune]),
        health: 1,
        difficulty: 1,
        behavior: swaying_nettle_ai,
        telegraph: swaying_nettle_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by swaying nettles.*/
function swaying_nettle_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var targets = self.tile.cycle === 0 ? DIAGONAL_DIRECTIONS : HORIZONTAL_DIRECTIONS;
    for(var target of targets){
        var target_space = self.location.plus(target);
        if(map.is_in_bounds(target_space) && !map.get_tile(target_space).tags.has(TAGS.nettle_immune)){
            map.attack(target_space);
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function swaying_nettle_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var targets = self.cycle === 0 ? DIAGONAL_DIRECTIONS : HORIZONTAL_DIRECTIONS;
    return targets.map(target => {
        return target.plus(location);
    })
}
/** @type {TileGenerator} */
function thorn_bush_tile(){
    return{
        type: `enemy`,
        name: `Thorn Bush`,
        pic: `${IMG_FOLDER.tiles}thorn_bush.png`,
        description: thorn_bush_description,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots]),
        health: 2,
        difficulty: 5,
        behavior: thorn_bush_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}

/** @type {AIFunction} AI used by thorn bushes.*/
function thorn_bush_ai(self, target, map){
    var current = self.location;
    for(var i = 0; i < 30 && !map.check_empty(current); ++i){
        var next = current.plus(random_nearby()[0]);
        if(map.is_in_bounds(next)){
            var space = map.get_tile(next);
            if(space.tags.has(TAGS.thorn_bush_roots) || (space.type === `empty` && random_num(4) === 0)){
                current = next;
            }
        }
    }
    if(map.check_empty(current)){
        map.add_tile(thorn_bramble_tile(), current);
    }
}
/** @type {TileGenerator} */
function moving_turret_d_tile(){
    var direction = DIAGONAL_DIRECTIONS[random_num(DIAGONAL_DIRECTIONS.length)].copy();
    var tile = {
        type: `enemy`,
        name: `Moving Turret`,
        pic: `${IMG_FOLDER.tiles}moving_turret_d.png`,
        description: moving_turret_description,
        tags: new TagList(),
        health: 2,
        difficulty: 4,
        behavior: moving_turret_d_ai,
        telegraph: moving_turret_d_telegraph,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction} AI used by moving turrets that shoot diagonally.*/
function moving_turret_d_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    // If the player is on the diagonal and not in the direction of travel, fire.
    if( 
        target.difference.on_diagonal() && 
        !point_equals(sign(target.difference), self.tile.direction) &&
        !point_equals(sign(target.difference), self.tile.direction.times(-1))
    ){
        turret_fire_ai(self, target, map);
    }
    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        self.tile.direction.times_equals(-1);
        set_rotation(self.tile);
    }
}

/** @type {TelegraphFunction} */
function moving_turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of [self.direction.rotate(90), self.direction.rotate(-90)]){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function moving_turret_h_tile(){
    var direction = HORIZONTAL_DIRECTIONS[random_num(HORIZONTAL_DIRECTIONS.length)].copy();
    var tile = {
        type: `enemy`,
        name: `Moving Turret`,
        pic: `${IMG_FOLDER.tiles}moving_turret_h.png`,
        description: moving_turret_description,
        tags: new TagList(),
        health: 2,
        difficulty: 4,
        behavior: moving_turret_h_ai,
        telegraph: moving_turret_h_telegraph,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction} AI used by moving turrets that shoot orthogonally.*/
function moving_turret_h_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    // If the player is on the axis and not in the direction of travel, fire.
    if( 
        target.difference.on_axis() && 
        !point_equals(sign(target.difference), self.tile.direction) &&
        !point_equals(sign(target.difference), self.tile.direction.times(-1))
    ){
        turret_fire_ai(self, target, map);
    }
    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        self.tile.direction.times_equals(-1);
        set_rotation(self.tile);
    }
}

/** @type {TelegraphFunction} */
function moving_turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of [self.direction.rotate(90), self.direction.rotate(-90)]){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {AIFunction} AI used by all turrets to fire towards the player.*/
function turret_fire_ai(self, target, map){
    // Fires a shot in the direction of the player.
    var direction = sign(target.difference)
    for(var space = self.location.plus(direction); !map.attack(space) && map.check_empty(space); space.plus_equals(direction)){}
}
/** @type {TileGenerator} */
function turret_d_tile(){
    return {
        type: `enemy`,
        name: `Turret`,
        pic: `${IMG_FOLDER.tiles}turret_d.png`,
        description: turret_d_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        telegraph: turret_d_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot diagonally.*/
function turret_d_ai(self, target, map){
    // Turret version that shoots diagonally.
    if(target.difference.on_diagonal()){
        turret_fire_ai(self, target, map);
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of DIAGONAL_DIRECTIONS){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function turret_h_tile(){
    return {
        type: `enemy`,
        name: `Turret`,
        pic: `${IMG_FOLDER.tiles}turret_h.png`,
        description: turret_h_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        telegraph: turret_h_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_h_ai(self, target, map){
    // Turret version that shoots orthogonally.
    if(target.difference.on_axis()){
        turret_fire_ai(self, target, map);
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of HORIZONTAL_DIRECTIONS){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function turret_r_tile(){
    var tile = {
        type: `enemy`,
        name: `Rotary Turret`,
        pic: ``,
        description: turret_r_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: turret_r_ai,
        telegraph: turret_r_telegraph,
        pic_arr: [
            `${IMG_FOLDER.tiles}turret_r_N_S_counterclockwise.png`,
            `${IMG_FOLDER.tiles}turret_r_NW_SE_counterclockwise.png`,
            `${IMG_FOLDER.tiles}turret_r_N_S.png`, 
            `${IMG_FOLDER.tiles}turret_r_NW_SE.png`
        ],
        rotate: 0,
        direction: random_nearby()[0],
        spin_direction: random_sign()
    }
    tile.pic = tile.pic_arr[1 + tile.spin_direction + set_rotation(tile)];
    return tile;
}

/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.pic_arr === undefined || 
        self.tile.direction === undefined || 
        self.tile.spin_direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if((target.difference.on_axis() || target.difference.on_diagonal())){
        // Shoot if player is along the line of the current direction or it's opposite.
        if(point_equals(self.tile.direction, sign(target.difference))){
            turret_fire_ai(self, target, map);
        }
        else if(point_equals(self.tile.direction.times(-1), sign(target.difference))){
            self.tile.direction = self.tile.direction.times(-1);
            turret_fire_ai(self, target, map);
            self.tile.direction = self.tile.direction.times(-1);
        }
    }
    // Rotate 45 degrees in the correct direction.
    self.tile.direction = sign(self.tile.direction.plus(self.tile.direction.rotate(90 * self.tile.spin_direction)));
    self.tile.pic = self.tile.pic_arr[1 + self.tile.spin_direction + set_rotation(self.tile)];

}

/** @type {TelegraphFunction} */
function turret_r_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = get_points_in_direction(location, self.direction, map);
    return attacks.concat(get_points_in_direction(location, self.direction.times(-1), map));
}
/** @type {TileGenerator} */
function unstable_wisp_tile(){
    return {
        type: `enemy`,
        name: `Unstable Wisp`,
        pic: `${IMG_FOLDER.tiles}unstable_wisp.png`, 
        description: unstable_wisp_description,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: unstable_wisp_ai,
        telegraph_other: spider_telegraph,
        on_death: unstable_wisp_death,
    }
}

/** @type {AIFunction}*/
function unstable_wisp_ai(self, target, map){
    var start = self.location.copy();
    var moved = undefined;
    var directions = random_nearby(target.difference);
    for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0) && !moved; ++i){
        // Moves a space randomly.
        for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
        if(i < directions.length && map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            moved = directions[i];
        }
    }
    if(moved && random_num(3) === 0){
        // Chance to shoot a fireball after moving.
        moved.times_equals(-1);
        var fireball = shoot_fireball(moved);
        map.add_tile(fireball, start);
    }
}

/** @type {AIFunction} Function used when unstable wisps die to explode and send out fireballs.*/
function unstable_wisp_death(self, target, map){
    var attacks = random_nearby();
    for(var dir of attacks){
        var spawnpoint = self.location.plus(dir)
        if(!map.attack(spawnpoint)){
            var fireball = shoot_fireball(dir);
            stun(fireball);
            map.add_tile(fireball, spawnpoint);
        }
    }
}
/** @type {TileGenerator} */
function vampire_tile(){
    return {
        type: `enemy`,
        name: `Vampire`,
        pic: `${IMG_FOLDER.tiles}vampire.png`,
        description: vampire_description,
        tags: new TagList(),
        health: 2,
        max_health: 2,
        difficulty: 5,
        behavior: vampire_ai,
        telegraph: vampire_telegraph,
        on_hit: vampire_hit
    }
}

/** @type {AIFunction} AI used by vampires.*/
function vampire_ai(self, target, map){
    if( self.tile.health === undefined || 
        self.tile.max_health === undefined){
        throw new Error(ERRORS.missing_property)
    }
    var player_pos = self.location.plus(target.difference);
    var target_spaces = [new Point(player_pos.x + 1, player_pos.y + 1), 
                        new Point(player_pos.x - 1, player_pos.y + 1), 
                        new Point(player_pos.x + 1, player_pos.y - 1), 
                        new Point(player_pos.x - 1, player_pos.y - 1)];
    target_spaces = randomize_arr(target_spaces);
    var moved = false;
    var health = self.tile.health;
    for(var i = 0; i < target_spaces.length && !moved && health === self.tile.health; ++i){
        // Tries to move to a nearby space from which it can attack the player.
        var space = target_spaces[i];
        var target_distance = space.minus(self.location);
        if(target_distance.taxicab_distance() === 1){
            moved = map.move(self.location, space);
        }
    }
    // If you moved into range, attack and heal.
    if(moved && map.attack(self.location.plus(target.difference))){
        map.heal(space, 1);
    } 
    if(!moved && health === self.tile.health){
        // If it hasn't moved yet, just moves closer to the player.
        var directions = order_nearby(target.difference);
        for(var i = 0; i < directions.length && !moved  && health === self.tile.health; ++i){
            var direction = directions[i]
            if(direction.on_axis()){
                moved = map.move(self.location, self.location.plus(direction));
            }
            
        }
    }
}
/** @type {AIFunction} Function used when a vampire is hit to teleport it away.*/
function vampire_hit(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        stun(self.tile);
        teleport_spell(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function vampire_telegraph(location, map, self){
    var attacks = [];
    for(var move_direction of HORIZONTAL_DIRECTIONS){
        var move = location.plus(move_direction);
        if(map.check_empty(move)){
            for(var attack_direction of DIAGONAL_DIRECTIONS){
                attacks.push(move.plus(attack_direction));
            }
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function vinesnare_bush_tile(){
    var range = 3;
    var pic_arr = [`${IMG_FOLDER.tiles}vinesnare_bush_lashing.png`, `${IMG_FOLDER.tiles}vinesnare_bush_rooted.png`];
    var starting_cycle = 1;
    return {
        type: `enemy`,
        name: `Vinesnare Bush`,
        pic: pic_arr[starting_cycle],
        description: `${vinesnare_bush_description[0]}${range}${vinesnare_bush_description[1]}`,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 2,
        behavior: vinesnare_bush_ai,
        telegraph: vinesnare_bush_telegraph,
        telegraph_other: vinesnare_bush_telegraph_other,
        pic_arr,
        cycle: starting_cycle,
        range
    }
}

/** @type {AIFunction} AI used by vinesnare bushes.*/
function vinesnare_bush_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined ||
        self.tile.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If 1 away, attack if not rooted, otherwise uproot.
        if(self.tile.cycle === 0){
            map.attack(self.location.plus(target.difference));
            return;
        }
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        return;
    }
    var moved = false;
    if(self.tile.cycle > 0 && target.difference.within_radius(self.tile.range) && !target.tile.tags.has(TAGS.unmovable)){
        var direction = sign(target.difference);
        if(target.difference.on_axis() || target.difference.on_diagonal()){
            // If the player is orthogonal or diagonal and within range, drag them closer.
            for(var i = Math.max(Math.abs(target.difference.x), Math.abs(target.difference.y));
                i > 1 && map.move(self.location.plus(direction.times(i)), self.location.plus(direction.times(i - 1)));
                --i){
                    moved = true;
                }
            
        }
    }
    if(moved){
        // If the player was moved, uproot and pass the turn to them.
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(ERRORS.pass_turn);
    }
    if(++self.tile.cycle > 0){
        // Otherwise, root.
        self.tile.pic = self.tile.pic_arr[1];
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph(location, map, self){
    if( self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph_other(location, map, self){
    if( self.cycle === undefined ||
        self.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var vines = []
    if(self.cycle === 0){
        return vines;
    }
    for(var direction of ALL_DIRECTIONS){
        for(var i = 2; i <= self.range; ++i){
            vines.push(location.plus(direction.times(i)));
        }
    }
    return vines;
}
/** @type {TileGenerator} */
function walking_prism_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}walking_prism_h.png`, `${IMG_FOLDER.tiles}walking_prism_d.png`];
    var description_arr = walking_prism_description;
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: `enemy`,
        name: `Walking Prism`,
        pic: pic_arr[starting_cycle],
        description: `${description_arr[0]}${description_arr[1 + starting_cycle]}`, 
        tags: new TagList(),
        health: 2,
        difficulty: 3,
        behavior: walking_prism_ai,
        on_hit: walking_prism_on_hit,
        telegraph_other: walking_prism_telegraph,
        pic_arr,
        description_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction}.*/
function walking_prism_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(!target.difference.within_radius(1)){
        // If not next to player, moves towards them.
        move_closer_ai(self, target, map);
    }
    else{
        // If near the player, moves randomly.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(self.location, self.location.plus(near_points[i])); ++i){}
    }
}

/** @type {AIFunction}.*/
function walking_prism_on_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var directions = HORIZONTAL_DIRECTIONS;
    }
    else{
        var directions = DIAGONAL_DIRECTIONS;
    }
    // Attacks in a + or x depending on the cycle.
    for(var direction of directions){
        for(var space = self.location.plus(direction); !map.attack(space) && map.check_empty(space); space.plus_equals(direction)){}
    }
    // Changes cycle.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[1 + self.tile.cycle]}`
}

/** @type {TelegraphFunction} */
function walking_prism_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return turret_h_telegraph(location, map, self);
    }
    return turret_d_telegraph(location, map, self);
}
/** @type {TileGenerator}.*/
function bookshelf_tile(){
    var health = random_num(2) + 2;
    var pic_arr = [
        `${IMG_FOLDER.tiles}bookshelf_empty.png`, 
        `${IMG_FOLDER.tiles}bookshelf_half.png`, 
        `${IMG_FOLDER.tiles}bookshelf_full.png`
    ];
    return {
        type: `terrain`,
        name: `Bookshelf`,
        pic: pic_arr[health - 1],
        description: bookshelf_description,
        tags: new TagList([TAGS.unmovable]),
        health,
        on_hit: bookshelf_on_hit,
        pic_arr
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/
function bookshelf_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health > 0){
        self.tile.pic = self.tile.pic_arr[Math.min(2, self.tile.health - 1)];
    }
    var boss_cards = get_boss_cards();
    var card_list = [...BASIC_CARDS, ...CONFUSION_CARDS, ...COMMON_CARDS, ...RARE_CARDS, ...boss_cards];
    var card = randomize_arr(card_list)[0]();
    GS.give_temp_card(card);
    GS.refresh_deck_display();
}

/** @type {TileGenerator} Like the normal chest, but it is invulnerable.*/
function armored_chest_tile(){
    return {
        type: `chest`,
        name: `Armored Chest`,
        pic: `${IMG_FOLDER.tiles}armored_chest.png`,
        description: armored_chest_description,
        tags: new TagList([TAGS.unmovable]),
        on_enter: chest_on_enter,
        contents: []
    }
}


/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: `chest`,
        name: `Chest`,
        pic: `${IMG_FOLDER.tiles}chest.png`,
        description: chest_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: chest_on_enter,
        contents: []
    }
}


/** @type {TileGenerator} Makes the correct type of chest*/
function appropriate_chest_tile(){
    if(GS.boons.has(boon_names.hoarder)){
        return armored_chest_tile();
    }
    return chest_tile();
}

/** @type {AIFunction} Function to open a chest when the player moves onto it.*/
function chest_on_enter(self, target, map){
    if(self.tile.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== `player`){
        return;
    }
    self.tile.health = 1;
    map.attack(self.location);
    var leave_chest = function(){
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        display.display_message(UIIDS.chest_instructions, ``);
        display.remove_children(UIIDS.chest_confirm_row);
        display.remove_children(UIIDS.contents);
        display.display_message(UIIDS.content_description, ``);
        GS.refresh_deck_display();
        display_map(map);
        if(GS.boons.has(boon_names.safe_passage)){
            GS.boons.lose(boon_names.safe_passage);
            GS.refresh_boon_display();
            GS.map.heal(GS.map.get_player_location());
            GS.map.display_stats(UIIDS.stats);
            GS.enter_shop();
        }
    }
    var abandon_button = {
        description: abandon_chest,
        on_click: leave_chest
    };
    var pick = function(on_choose){
        return function(){
            if(on_choose !== undefined){
                on_choose();
            }
            leave_chest();
        }
    }
    var content_row = [];
    for(var i = 0; i < self.tile.contents.length; ++i){
        let item = self.tile.contents[i];
        let make_on_click = function(position){
            return function(){
                let confirm_button = {
                    description: take_from_chest,
                    on_click: pick(item.on_choose)
                };
                display.display_message(UIIDS.content_description, item.description);
                display.remove_children(UIIDS.chest_confirm_row);
                display.add_button_row(UIIDS.chest_confirm_row, [abandon_button, confirm_button]);
                display.select(UIIDS.contents, 0, position);
            };
        }
        
        content_row.push({
            pic: item.pic,
            name: item.name,
            on_click: make_on_click(i)
        });
    }

    display.display_message(UIIDS.chest_instructions, chest_inner_discription);
    display.add_tb_row(UIIDS.contents, content_row, CHEST_CONTENTS_SIZE);
    display.add_button_row(UIIDS.chest_confirm_row, [abandon_button]);
    display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.chest);
    throw new Error(ERRORS.pass_turn);
}

/**
 * @typedef {Object} Content
 * @property {string} pic
 * @property {function} on_choose
 * @property {string} description
 */

/**
 * @param {Tile} chest 
 * @param {Card} card 
 */
function add_card_to_chest(chest, card){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var content = {
        pic: card.pic,
        name: card.name,
        on_choose: function(){
            GS.deck.add(card);
        },
        description: add_card_description
    }
    chest.contents.push(content);
}

/**
 * @param {Tile} chest 
 * @param {Card} card 
 */
function add_boon_to_chest(chest, boon){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var content = {
        pic: boon.pic,
        name: boon.name,
        on_choose: function(){
            if(GS.boons.total === 0){
                display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.boon_list, function(){
                    display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.boon_list);
                });
                display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.boon_list);
            }
            GS.boons.pick(boon.name);
            GS.refresh_boon_display();
        },
        description: `${boon.name}: ${boon.description}`
    }
    chest.contents.push(content);
}
/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function coffin_tile(){
    return {
        type: `terrain`,
        name: `Coffin`,
        pic: `${IMG_FOLDER.tiles}coffin.png`,
        description: coffin_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: decay_ai,
        on_death: coffin_tile_death,
        summons: [rat_tile, carrion_flies_tile, vampire_tile, appropriate_chest_tile],
        card_drops: RARE_CARDS
    }
}

/** @type {AIFunction} Function used when a coffin is disturbed to potentially spawn something.*/
function coffin_tile_death(self, target, map){
    if( self.tile.summons === undefined ||
        self.tile.card_drops === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var new_enemy = self.tile.summons[random_num(self.tile.summons.length)]();
    if(new_enemy.type === `chest`){
        var cards = rand_no_repeates(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.hoarder));
        for(let card of cards){
            add_card_to_chest(new_enemy, card());
        }
    }
    else{
        stun(new_enemy);
    }
    map.add_tile(new_enemy, self.location);
}
/** @type {TileGenerator} A hazardous pool of slime that can be cleared by attacking.*/
function corrosive_slime_tile(){
    return {
        type: `terrain`,
        name: `Corrosive Slime`,
        pic: `${IMG_FOLDER.tiles}corrosive_slime.png`,
        description: corrosive_slime_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: corrosive_slime_on_enter
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function corrosive_slime_on_enter(self, target, map){
    hazard(self, target, map);
    decay_ai(self, target, map);
}
/** @type {TileGenerator} A fireball that travels in a straight line until it hits something. Direction is not yet set.*/
function fireball_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}fireball_n.png`, `${IMG_FOLDER.tiles}fireball_nw.png`];
    return {
        type: `enemy`,
        name: `Fireball`,
        pic: `${IMG_FOLDER.tiles}fireball.png`,
        description: fireball_description,
        tags: new TagList(),
        behavior: fireball_ai,
        telegraph: fireball_telegraph,
        on_enter: fireball_on_enter,
        pic_arr,
        rotate: 0,
        direction: undefined
    }
}

/** @type {AIFunction}  AI used by fireballs.*/
function fireball_ai(self, target, map){
    if(self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        // When it hits something, explodes and damages it.
        map.attack(self.location.plus(self.tile.direction));
        self.tile.health = 1;
        map.attack(self.location);
    }
}
/** @type {AIFunction} Function used by fireballs to blow up when soemthing tries to move onto them.*/
function fireball_on_enter(self, target, map){
    hazard(self, target, map);
    self.tile.health = 1;
    map.attack(self.location);
}

/** @type {TelegraphFunction} */
function fireball_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return [location.plus(self.direction), ...hazard_telegraph(location, map, self)];
}

/**
 * Function to create a fireball and point it in the right direction.
 * @param {Point} direction Where it's headed.
 * @returns {Tile} The new fireball.
 */
function shoot_fireball(direction){
    var fireball = fireball_tile();
    fireball.direction = direction;
    fireball.pic = ifexists(fireball.pic_arr)[set_rotation(fireball)];
    return fireball;
}
/** @type {TileGenerator} */
function floating_barrier_tile(){
    var direction = ALL_DIRECTIONS[random_num(ALL_DIRECTIONS.length)].copy();
    var pic_arr = [`${IMG_FOLDER.tiles}floating_barrier_n.png`, `${IMG_FOLDER.tiles}floating_barrier_nw.png`];
    var tile = {
        type: `enemy`,
        name: `Floating Barrier`,
        pic: pic_arr[direction.on_axis() ? 0 : 1],
        description: floating_barrier_description,
        tags: new TagList(),
        behavior: floating_barrier_ai,
        pic_arr,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction}.*/
function floating_barrier_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        var directions = random_nearby();
        for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
        if(i < directions.length){
            self.tile.direction = directions[i];
            self.tile.pic = self.tile.pic_arr[self.tile.direction.on_axis() ? 0 : 1]
            set_rotation(self.tile);
        }
    }
}
/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function enticing_fruit_tree_tile(){
    return {
        type: `terrain`,
        name: `Enticing Fruit Tree`,
        pic: `${IMG_FOLDER.tiles}enticing_fruit_tree.png`,
        description: enticing_fruit_tree_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: enticing_fruit_tree_on_enter,
        summons: FRUIT_TREE_SUMMONS
    }
}

/** @type {AIFunction} AI used when the player moves onto the fruit tree.*/
function enticing_fruit_tree_on_enter(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== `player`){
        return;
    }
    map.heal(self.location.plus(target.difference), 1);
    var spawns = random_num(3);
    for(var i = 0; i < spawns; ++i){
        var new_spawn = self.tile.summons[random_num(self.tile.summons.length)]();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
    decay_ai(self, target, map);
}
const FRUIT_TREE_SUMMONS = [carrion_flies_tile, ram_tile, living_tree_tile, scythe_tile, scorpion_tile, 
    spider_tile];
/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function rotting_fruit_tree_tile(){
    return {
        type: `terrain`,
        name: `Rotting Fruit Tree`,
        pic: `${IMG_FOLDER.tiles}rotting_fruit_tree.png`,
        description: rotting_fruit_tree_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: decay_ai,
        on_death: rotting_fruit_tree_on_death,
        summons: FRUIT_TREE_SUMMONS
    }
}

/** @type {AIFunction} AI used when the fruit tree is moved on or destroyed.*/
function rotting_fruit_tree_on_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spawns = random_num(3);
    if(spawns !== 0){
        var new_spawn = self.tile.summons[random_num(self.tile.summons.length)]();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
}
/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `Lava Pool`,
        pic: `${IMG_FOLDER.tiles}lava_pool.png`,
        description: lava_pool_description,
        tags: new TagList([TAGS.unmovable]),
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}

/** @type {TileGenerator} A sturdy wall.*/
function magmatic_boulder_tile(){
    return {
        type: `terrain`,
        name: `Magmatic Boulder`,
        pic: `${IMG_FOLDER.tiles}magmatic_boulder.png`,
        description: magmatic_boulder_description,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} A fire which goes away over time. */
function raging_fire_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}raging_fire_weak.png`, `${IMG_FOLDER.tiles}raging_fire.png`];
    var health = 2;
    return {
        type: `enemy`,
        name: `Raging Fire`,
        pic: pic_arr[health - 1],
        description: raging_fire_description,
        tags: new TagList([TAGS.unmovable]),
        health,
        behavior: decay_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard,
        on_hit: raging_fire_hit,
        pic_arr
    }
}

/** @type {AIFunction}  AI used by fireballs.*/
function raging_fire_hit(self, target, map){
    if( self.tile.health === undefined ||
        self.tile.pic_arr === undefined
    ){
        throw new Error(ERRORS.missing_property);
    }
    var intensity = Math.min(self.tile.health - 1, self.tile.pic_arr.length);
    if(intensity >= 0){
        self.tile.pic = self.tile.pic_arr[intensity];
    }
}


/** @type {TileGenerator} Pushes things away.*/
function repulsor_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}repulsor.png`, `${IMG_FOLDER.tiles}repulsor_reloading.png`];
    var starting_cycle = 0;
    return {
        type: `enemy`,
        name: `Repulsor`,
        pic: pic_arr[starting_cycle],
        description: repulsor_description,
        tags: new TagList([TAGS.unmovable]),
        behavior: repulsor_ai,
        telegraph_other: repulsor_telegraph_other,
        on_enter: repulsor_push_ai,
        on_hit: repulsor_push_ai,
        pic_arr,
        cycle: starting_cycle,
    }
}

/** @type {AIFunction} Pushes nearby creatures away.*/
function repulsor_push_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        return;
    }
    var player_was_moved = false;
    var activated = false;
    var spaces = random_nearby();
    for(var space of spaces){
        var target_space = self.location.plus(space);
        if(map.is_in_bounds(target_space)){
            var target_tile = map.get_tile(target_space);
            if(!target_tile.tags.has(TAGS.unmovable)){
                if(target_tile.type === `player`){
                    player_was_moved = true;
                }
                activated = true;
                self.tile.cycle = 2;
                self.tile.pic = self.tile.pic_arr[1];
                try {
                    // Push the creature away.
                    for(var i = 0; i < 2 && map.move(target_space, target_space.plus(space)); ++i){
                        target_space.plus_equals(space);
                    }
                } catch (error) {
                    // Catches ERRORS.pass_turn errors to prevent ping pong between 2.
                    // Catches ERRORS.creature_died errors in case it moves a enemy into lava.
                    if(error.message !== ERRORS.pass_turn && error.message !== ERRORS.creature_died){
                        throw error;
                    }
                }
            }
        }
    }
    if(player_was_moved){
        throw new Error(ERRORS.pass_turn);
    }
}

/** @type {AIFunction} AI used by smoldering ashes.*/
function repulsor_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        --self.tile.cycle;
        if(self.tile.cycle === 0){
            self.tile.pic = self.tile.pic_arr[0];
        }
        return;
    }
    repulsor_push_ai(self, target, map);
}
/** @type {TelegraphFunction} */
function repulsor_telegraph_other(location, map, self){
    if( self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spaces = [];
    if(self.cycle === 0){
        spaces = random_nearby();
        spaces = spaces.map((space) => space.plus(location));
        spaces.push(location);
    }
    return spaces;
}

/** @type {TileGenerator} Spawns corrosive slime nearby.*/
function sewer_grate_tile(){
    return{
        type: `enemy`,
        name: `Sewer Grate`,
        pic: `${IMG_FOLDER.tiles}sewer_grate.png`,
        description: sewer_grate_description,
        tags: new TagList([TAGS.unmovable]),
        behavior: sewer_grate_ai,
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function sewer_grate_ai(self, target, map){
    spawn_nearby(map, corrosive_slime_tile(), self.location);
}
/** @type {TileGenerator} Dropped by Pheonixes to respawn them. */
function smoldering_ashes_tile(){
    var spawn_timer = 2;
    return {
        type: `enemy`,
        name: `Smoldering Ashes`,
        pic: `${IMG_FOLDER.tiles}smoldering_ashes.png`,
        description: `${smoldering_ashes_description[0]}${spawn_timer}${smoldering_ashes_description[1]}`,
        tags: new TagList(),
        health: 1,
        behavior: smoldering_ashes_ai,
        on_enter: decay_ai,
        description_arr: smoldering_ashes_description,
        cycle: 0,
        spawn_timer
    }
}

/** @type {AIFunction} AI used by smoldering ashes.*/
function smoldering_ashes_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined ||
        self.tile.description_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
        self.tile.description = `${self.tile.description_arr[0]}${self.tile.spawn_timer - self.tile.cycle}${self.tile.description_arr[1]}`
        throw new Error(ERRORS.skip_animation);
    }
    else{
        // Dies and spawns a pheonix.
        map.attack(self.location);
        map.add_tile(pheonix_tile(), self.location);
    }
}

/** @type {TileGenerator} */
function thorn_bramble_tile(){
    return{
        type: `terrain`,
        name: `Thorn Bramble`,
        pic: `${IMG_FOLDER.tiles}thorn_bramble.png`,
        description: thorn_bramble_description,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}

/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    var pic_arr = [`${IMG_FOLDER.tiles}very_damaged_wall.png`, `${IMG_FOLDER.tiles}damaged_wall.png`];
    return {
        type: `terrain`,
        name: `Damaged Wall`,
        pic: pic_arr[health - 1],
        description: damaged_wall_description,
        tags: new TagList([TAGS.unmovable]),
        health,
        on_hit: damaged_wall_on_hit,
        on_death: damaged_wall_death,
        pic_arr,
        summons: [spider_tile, acid_bug_tile, spider_web_tile, rat_tile, scythe_tile]
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/
function damaged_wall_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health > 0){
        self.tile.pic = self.tile.pic_arr[Math.min(1, self.tile.health - 1)];
    }}

/** @type {AIFunction} Function used when a damaged wall is destroyed to potentially spawn something.*/
function damaged_wall_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(random_num(10) < 7){
        var ran = random_num(self.tile.summons.length);
        var new_enemy = self.tile.summons[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, self.location);
    }
}
/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: `terrain`,
        name: `Wall`,
        pic: `${IMG_FOLDER.tiles}wall.png`,
        description: wall_description,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} Empty space.*/
function empty_tile(){
    return {
        type: `empty`,
        name: `Empty`,
        pic: `${IMG_FOLDER.tiles}empty.png`,
        description: empty_description,
        tags: new TagList([TAGS.unmovable])
    }
}
/** @type {TileGenerator} The player must move here to complete the floor.*/
function exit_tile(){
    return {
        type: `exit`,
        name: `Exit`,
        pic: `${IMG_FOLDER.tiles}stairs.png`,
        description: exit_description,
        tags: new TagList([TAGS.unmovable])
    }
}
/** @type {TileGenerator} Must be unlocked to reveal the exit.*/
function lock_tile(){
    return {
        type: `terrain`,
        name: `Lock`,
        pic: `${IMG_FOLDER.tiles}lock.png`,
        description: lock_description,
        tags: new TagList([TAGS.unmovable])
    }
}
/** @type {TileGenerator} The starting player.*/
function player_tile(){
    return {
        type: `player`,
        name: `Player`,
        pic: `${IMG_FOLDER.tiles}helmet.png`,
        description: player_description,
        tags: new TagList(),
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH
    }
}
// ----------------AIUtil.js----------------
// File for AI utility functions functions and jsdoc typedefs used by ai functions.

/**
 * @typedef {Object} AISelfParam Information passed into an ai function about the entity calling it.
 * @property {Tile} tile The tile of the entity.
 * @property {Point} location The location of the tile on the grid.
 */

/**
 * @typedef {Object} AITargetParam Information passed into an ai function about the entity it is targeting.
 * @property {Tile} tile The tile it is targeting.
 * @property {Point} difference The location of the tile it is targeting relative to the entity.
 */

/**
 * @callback AIFunction
 * @param {AISelfParam} self The entity performing this behavior.
 * @param {AITargetParam} target The entity being targeted.
 * @param {GameMap} map The gamemap where stuff should happen.
 */

/** @type {AIFunction} Function used when something moves onto this to harm that thing.*/
function hazard(self, target, map){
    // General on_enter function to retaliate if something tries to move onto it.
    map.attack(self.location.plus(target.difference));
}
/** @type {AIFunction}  AI used by entities that decay over time or when moved onto.*/
function decay_ai(self, target, map){
    map.attack(self.location);
    throw new Error(ERRORS.skip_animation);
}
/** @type {AIFunction} Attempts to move 1 space closer to the user until it succesfully moves or it dies.*/
function move_closer_ai(self, target, map){
    var directions = order_nearby(target.difference);
    for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0); ++i){
        if(map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            return;
        }
    }
}
/** @type {AIFunction} AI used when a entity should move and attack in a direction (the target's difference field).*/
function move_attack_ai(self, target, map){
    if(target.difference.within_radius(0)){
        throw new Error(ERRORS.invalid_value)
    }
    if(map.move(self.location, self.location.plus(target.difference))){
        self.location.plus_equals(target.difference);
    }
    map.attack(self.location.plus(target.difference));
}



/**
 * Function to create a function that delays an event function for a specified number of turns.
 * @param {number} turn_count How many turns to delay it.
 * @param {function} delayed_function The event to fire after the delay.
 * @returns {MapEventFunction} The event.
 */
function delay_event(turn_count, delayed_function){
    var delay = function(){
        return function(map_to_use){
            if(turn_count > 1){
                map_to_use.add_event({name: `Delay`, behavior: delay_event(turn_count - 1, delayed_function)});
            }
            else{
                delayed_function(map_to_use);
            }
        }
    }
    return delay();
}

/**
 * Function to create an event function representing an earthquake.
 * @param {number} amount The amount of falling debris that should be created.
 * @param {Point[]=} locations An optional grid of locations to pick from.
 * @returns {MapEventFunction} The event.
 */
function earthquake_event(amount, locations = undefined){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(amount){
        var falling_rubble_layer = {
            pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
            description: falling_rubble_description,
            telegraph: hazard_telegraph
        }
        return function(map_to_use){
            var rubble = [];
            var space;
            if(locations === undefined){
                for(var j = 0; j < amount; ++j){
                    space = map_to_use.random_empty();
                    map_to_use.mark_event(space, falling_rubble_layer);
                    rubble.push(space);
                }
            }
            else{
                var spaces = rand_no_repeates(locations, amount);
                for(var i = 0; i < amount; ++i){
                    space = spaces[i];
                    if(map_to_use.check_empty(space)){
                        map_to_use.mark_event(space, falling_rubble_layer);
                        rubble.push(space);
                    }
                }
            }
            map_to_use.add_event({name: `Falling Rubble`, behavior: falling_rubble(rubble)});
        }
    }
    return earthquake(amount);
}



/**
 * Function to create an event function representing hazardous growth.
 * @param {Point[]} points A grid of locations to grow things at.
 * @returns {MapEventFunction} The event.
 */
function growth_event(points, root, grown){
    var grow = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
                if(map_to_use.check_empty(location)){
                    map_to_use.add_tile(grown(), location);
                }
            }
        }
    }
    var plant = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.mark_event(location, root);
            }
            map_to_use.add_event({name: grown().name, behavior: grow(locations)});
        }
    }
    return plant(points);
}
// ----------------GeneralEnemyUtil.js----------------
// File for utility functions and jsdoc typedefs used by ai functions.

/**
 * @typedef {Object} Tile Information about the contents of a single square of a floor of the dungeon.
 * 
 * // Required properties //
 * @property {string} type The type of thing this tile is (player, enemy, exit, etc).
 * @property {string} name More specific than type. Used for mousover text.
 * @property {string} pic The picture of the tile's contents.
 * @property {string} description A description given when the tile is clicked on.
 * @property {TagList} tags Tags that group enemies together
 * 
 * // Misc //
 * @property {number=} health The amount of damage it can take before dying.
 * @property {number=} max_health It can never be healed above this.
 * @property {number=} difficulty Used to determine how many things can be spawned.
 * @property {string=} death_message Displayed on death.
 * 
 * // Functions controlling behavior. //
 * @property {AIFunction=} behavior What it does on it's turn. Targets the player.
 * @property {TelegraphFunction=} telegraph Used to show which squares it can attack on it's next turn.
 * @property {TelegraphFunction=} telegraph_other Used to show squares that can be affected by something other than an attack.
 * @property {AIFunction=} on_enter What it does when something tries to move onto it. Targets whatever touched it.
 * @property {AIFunction=} on_hit What it does when attacked. Targets what attacked it.
 * @property {AIFunction=} on_death What it does when killed. Targets the player.
 * 
 * // Properties used to determing aesthetics //
 * @property {string[]=} pic_arr Used when the tile sometimes changes images.
 * @property {string[]=} description_arr Used when the tile sometimes changes descriptions.
 * @property {TileGenerator[]=} look_arr Used when the tile sometimes is disguised as another tile.
 * @property {number=} rotate How much to rotate the image when displaying it. Must be in 90 degree increments.
 * @property {boolean=} flip If the image should be horizontally flipped.
 * 
 * // Properties used by AI functions to determine behavior. //
 * @property {number=} cycle Used when a tile's state must persist between turns.
 * @property {number=} spawn_timer How many turns between spawning things.
 * @property {number=} range How far away can it attack.
 * @property {Point=} direction The relative direction is it moving.
 * @property {(Point | undefined)[]=} segment_list A 2 element array with the relative positions of the two adjacent segments of this entity.
 * @property {number=} spin_direction The direction it is spinning.
 * @property {Spell[]=} spells A array of behavior functions it can call along with their own descriptions and pictures.
 * @property {TileGenerator[]=} summons A array of tiles it can spawn.
 * @property {Content[]=} contents The contents of a chest.
 * @property {CardGenerator[]=} card_drops The cards a boss can drop on death.
 * 
 * // Properties added later //
 * @property {number=} stun When the tile is stunned, it's turn will be skipped.
 * @property {number=} id Given a unique one when added to a EntityList.
 */

/**
 * @callback TileGenerator Function used to create a tile.
 * @returns {Tile}
 */


// This is a array of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [
    spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, shadow_knight_tile, 
    scythe_tile, spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, 
    acid_bug_tile, brightling_tile, corrosive_caterpillar_tile, noxious_toad_tile, vampire_tile,
    clay_golem_tile, vinesnare_bush_tile, rat_tile, shadow_scout_tile, darkling_tile,
    orb_of_insanity_tile, carrion_flies_tile, magma_spewer_tile, igneous_crab_tile, boulder_elemental_tile,
    pheonix_tile, strider_tile, swaying_nettle_tile, thorn_bush_tile, living_tree_tile,
    moving_turret_h_tile, moving_turret_d_tile, walking_prism_tile, unstable_wisp_tile, captive_void_tile,
    paper_construct_tile
];

// This is an array of all bosses.
const BOSS_LIST = [
    lich_tile, spider_queen_tile, two_headed_serpent_tile, velociphile_tile, young_dragon_tile
]

/**
 * Stuns a stunnable tile by incrementing it's stun property. Adds the property first if necessary.
 * @param {Tile} tile The tile to stun.
 * @param {number} [amount = 1] Optional parameter for the amount of stun to add. Default is 1.
 */
function stun(tile, amount = 1){
    if(tile.tags !== undefined && tile.tags.has(TAGS.unstunnable)){
        return;
    }
    // Increases a tile's stun.
    if(tile.stun === undefined){
        tile.stun = 0;
    }
    tile.stun += amount;
}
/**
 * @returns {Point[]} Returns a randomized array of points around (0, 0).
 */
function random_nearby(){
    // Returns an array of each point next to [0, 0] with it's order randomized.
    var cords = [
        new Point(-1, -1),
        new Point(-1, 0),
        new Point(-1, 1),
        new Point(0, -1),
        new Point(0, 1),
        new Point(1, -1),
        new Point(1, 0),
        new Point(1, 1)];
    return randomize_arr(cords);
}
/**
 * Gets a randomized array of points around (0, 0) ordered by how close they are to the given point.
 * @param {Point} direction The point to sort by.
 * @returns {Point[]} The resulting array.
 */
function order_nearby(direction){
    // Returns an array with points ordered from the nearest to the furthest from the given direction. 
    // Equal distance points are randomly ordered.
    var sign_dir = sign(direction);
    var ordering = [];
    ordering.push(sign_dir);
    if(sign_dir.x === 0){
        // Target is along the vertical line.
        var pair = randomize_arr([new Point(1, sign_dir.y), new Point(-1, sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(1, 0), new Point(-1, 0)])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(1, -1 * sign_dir.y), new Point(-1, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(sign_dir.y === 0){
        // Target is along the horizontal line.
        var pair = randomize_arr([new Point(sign_dir.x, 1), new Point(sign_dir.x, 1)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(0, 1), new Point(0, -1)])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 1), new Point(-1 * sign_dir.x, -1)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(Math.abs(direction.x) > Math.abs(direction.y)){  
        // Target is closer to the horizontal line than the vertical one.
        ordering.push(new Point(sign_dir.x, 0));
        ordering.push(new Point(0, sign_dir.y));
        ordering.push(new Point(sign_dir.x, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, sign_dir.y));
        ordering.push(new Point(0, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, 0));
    }
    else if(Math.abs(direction.x) < Math.abs(direction.y)){
        // Target is closer to the vertical line than the horizontal one one.
        ordering.push(new Point(0, sign_dir.y));
        ordering.push(new Point(sign_dir.x, 0));
        ordering.push(new Point(-1 * sign_dir.x, sign_dir.y));
        ordering.push(new Point(sign_dir.x, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, 0));
        ordering.push(new Point(0, -1 * sign_dir.y));
    }
    else{
        // Target is along the diagonal.
        var pair = randomize_arr([new Point(sign_dir.x, 0), new Point(0, sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, sign_dir.y), new Point(sign_dir.x, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 0), new Point(0, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    ordering.push(new Point(-1 * sign_dir.x, -1 * sign_dir.y));
    return ordering;

}
/**
 * Function to get the first non empty location near a given location.
 * @param {Point} location The point to search around.
 * @param {Point[]} nearby_arr The array of relative locations to search.
 * @param {GameMap} map The map to search on.
 * @returns {Point | undefined} Returns an empty location if one is found and undefined otherwise.
 */
function get_empty_nearby(location, nearby_arr, map){
    for(var near of nearby_arr){
        if(map.check_empty(location.plus(near))){
            return near;
        }
    }
    return undefined;
}
/**
 * Counts how many locations next to the given one are not empty.
 * @param {Point} location The point to search around.
 * @param {GameMap} map The map to search.
 * @returns {number} The number of nearby occupied locations.
 */
function count_nearby(location, map){
    var count = 0;
    var nearby = random_nearby();
    for(var near of nearby){
        if(!map.check_empty(location.plus(near))){
            ++count;
        }
    }
    return count;
}
/**
 * A function to add a Tile to the game map at a position next to this one.
 * @param {GameMap} map The map to add the tile to.
 * @param {Tile} tile The tile to add.
 * @param {Point} location The point to spawn near.
 * @param {Point[]=} nearby Array of relative locations to spawn from randomly.
 *                            If not provided, it will choose from a randomized array of locations next to the given one.
 * @returns {Point | undefined} Returns the location of the new tile if it was successfully added, or undefined if no spaces were available.
 */
function spawn_nearby(map, tile, location, nearby = random_nearby()){
    // Attempts to spawn a <tile> at a space next to to the given cords.
    // If it succeeds, returns the location, otherwise returns false.
    for(var near of nearby){
        if(map.add_tile(tile, location.plus(near))){
            return near;
        }
    }
    return undefined;
}
/**
 * Function to attack all spaces around the current location.
 * @param {Point} location The square to attack around.
 * @param {GameMap} map The map to make attacks using.
 */
function attack_around(location, map){
    for(var direction of ALL_DIRECTIONS){
        map.attack(location.plus(direction));
    }
}
/**
 * Function to let a tile disguise itself as another one.
 * @param {Tile} tile The tile to disguise.
 * @param {TileGenerator} tile_generator The generator for a default version of the tile to disguise as. 
 */
function shapeshift(tile, tile_generator){
    var look = tile_generator();
    tile.name = look.name;
    tile.description = look.description;
    tile.telegraph = look.telegraph;
    tile.pic = look.pic;
}

/**
 * Sets the rotation of a tile based on it's direction.
 * @param {Tile} tile The tile to set the direction of.
 * @returns {number} Returns 1 if the direction is diagonal, 0 if it's orthogonal.
 */
function set_rotation(tile){
    /*  
        NW = (-1, -1) -> 0
        N  = ( 0, -1) -> 0
        NE = ( 1, -1) -> 90
        E  = ( 1,  0) -> 90
        SE = ( 1,  1) -> 180
        S  = ( 0,  1) -> 180
        SW = (-1,  1) -> 270
        W  = (-1,  0) -> 270 
    */
    if( tile.direction === undefined ||
        tile.rotate === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var direction = tile.direction;
    if(direction.on_axis()){
        tile.rotate = 0;
        if(direction.x < 0 || direction.y > 0){
            tile.rotate = 2*90;
        }
        if(direction.y === 0){
            tile.rotate += 90;
        }
        var diagonal = 0;
    }
    else{
        tile.rotate= 90 * ((direction.x + direction.y) / 2 + 1);
        if(direction.x === -1 && direction.y === 1){
            tile.rotate = 90 * 3;
        }
        var diagonal = 1;
    }
    return diagonal;
}

/**
 * Creates an array of points around the edge of the rectangle created using the given points as corners.
 * @param {Point} p1 One corner of the rectangle.
 * @param {Point} p2 The opposite corner.
 * @returns {Point[]} An array of the points around the edge.
 */
function point_rectangle(p1, p2){
    if(p1.x === p2.x || p1.y === p2.y){
        // The rectangle can't be 1 dimensional.
        throw new Error(ERRORS.invalid_value);
    }
    var rectangle = [
        p1.copy(),
        p2.copy(),
        new Point(p1.x, p2.y),
        new Point(p2.x, p1.y)
    ];
    var x_min = Math.min(p1.x, p2.x);
    var x_max = Math.max(p1.x, p2.x);
    var y_min = Math.min(p1.y, p2.y);
    var y_max = Math.max(p1.y, p2.y);
    for(var x = x_min + 1; x < x_max; ++x){
        rectangle.push(new Point(x, y_min));
        rectangle.push(new Point(x, y_max));
    }
    for(var y = y_min + 1; y < y_max; ++y){
        rectangle.push(new Point(x_min, y));
        rectangle.push(new Point(x_max, y));
    }
    return rectangle;
}


/**
 * Function to make a square of points with a side length 5 centered on the origin.
 * @returns {Point[]} the points.
 */
function get_2_away(){
    var points = [];
    for(var x = -2; x <= 2; ++x){
        for(var y = -2; y <= 2; ++y){
            var p = new Point(x, y);
            if(p.within_radius(2) && !p.within_radius(1)){
                points.push(p);
            }
        }
    }
    return points;
}

/** @type {TileGenerator} Function to act as a starting point for making new enemies. */
function generic_tile(){
    return {
        // Required properties //
        type: ``,
        name: ``,
        pic: ``,
        description: ``,

        // Misc //
        health: 1,
        max_health: 1,
        difficulty: 1,
        death_message: ``,

        // Functions controlling behavior. //
        behavior: undefined,
        telegraph: undefined,
        telegraph_other: undefined,
        on_enter: undefined,
        on_hit: undefined,
        on_death: undefined,

        // Properties used to determing aesthetics //
        pic_arr: [],
        description_arr: [],
        look_arr: [],
        rotate: 0,
        flip: false,

        // Properties used by AI functions to determine behavior. //
        cycle: 0,
        spawn_timer: 0,
        range: 1,
        direction: new Point(0, 0),
        segment_list: [],
        spin_direction: 1,
        spells: [],
        summons: [],
        contents: [],
        card_drops: [],

        // Properties added later //
        stun: undefined,
        id: undefined,
        is_hit: undefined,
        event_happening: undefined
    }
}
/** @type {SpellGenerator} */
function forest_heart_rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph_other: rest_spell_telegraph,
        description: forest_heart_rest_description,
        pic: `${IMG_FOLDER.tiles}forest_heart.png`
    }
}
/** @type {SpellGenerator} */
function greater_thorn_bush_spell_generator(){
    return {
        behavior: greater_thorn_bush_spell,
        telegraph_other: thorn_bush_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree in two rings.*/
function greater_thorn_bush_spell(self, target, map){
    thorn_bush_spell(self, target, map);
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 3, FLOOR_HEIGHT / 2 - 3), 
        new Point(FLOOR_WIDTH / 2 + 2, FLOOR_HEIGHT / 2 + 2)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}thorn_roots.png`,
        description: thorn_root_description,
        telegraph: hazard_telegraph
    }
    var delayed_func = function(map_to_use){
        map_to_use.add_event({name: `Bramble Shield`, behavior: growth_event(points, root_layer, thorn_bramble_tile)});
    };
    map.add_event({name: `Delayed Bramble Shield`, behavior: delay_event(1, delayed_func)});
}
/** @type {SpellGenerator} */
function living_tree_spell_generator(){
    return {
        behavior: living_tree_spell,
        telegraph_other: living_tree_spell_telegraph,
        description: forest_heart_summon_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_summon.png`
    }
}

/** @type {AIFunction} Spawns a living tree along the diagonal of each corner.*/
function living_tree_spell(self, target, map){
    var nw = [];
    var ne = [];
    var se = [];
    var sw = [];
    for(var i = 0; i < Math.floor(FLOOR_HEIGHT / 2) && i < Math.floor(FLOOR_WIDTH / 2); ++i){
        nw.push(new Point(0 + i, 0 + i));
        ne.push(new Point(FLOOR_WIDTH - 1 - i, 0 + i));
        se.push(new Point(FLOOR_WIDTH - 1 - i, FLOOR_HEIGHT - 1 - i));
        sw.push(new Point(0 + i, FLOOR_HEIGHT - 1 - i));
    }
    for(var diagonal of [nw, ne, se, sw]){
        var spawned = false;
        for(var i = 0; i < diagonal.length && !spawned; ++i){
            if(map.check_empty(diagonal[i])){
                map.add_tile(living_tree_tile(), diagonal[i]);
                spawned = true;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function living_tree_spell_telegraph(location, map, self){
    var nw = [];
    var ne = [];
    var se = [];
    var sw = [];
    var points = [];
    for(var i = 0; i < Math.floor(FLOOR_HEIGHT / 2) && i < Math.floor(FLOOR_WIDTH / 2); ++i){
        nw.push(new Point(0 + i, 0 + i));
        ne.push(new Point(FLOOR_WIDTH - 1 - i, 0 + i));
        se.push(new Point(FLOOR_WIDTH - 1 - i, FLOOR_HEIGHT - 1 - i));
        sw.push(new Point(0 + i, FLOOR_HEIGHT - 1 - i));
    }
    for(var diagonal of [nw, ne, se, sw]){
        var added = false;
        for(var i = 0; i < diagonal.length && !added; ++i){
            if(map.check_empty(diagonal[i])){
                points.push(diagonal[i]);
                added = true;
            }
        }
    }
    return points;
}
/** @type {SpellGenerator} */
function rotting_fruit_spell_generator(){
    return {
        behavior: rotting_fruit_spell,
        telegraph_other: rotting_fruit_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree.*/
function rotting_fruit_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    for(var point of points){
        if(map.get_tile(point).tags.has(TAGS.thorn_bush_roots)){
            map.attack(point);
        }
        if(map.check_empty(point)){
            map.add_tile(rotting_fruit_tree_tile(), point);
        }
    }
}

/** @type {TelegraphFunction} */
function rotting_fruit_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
/** @type {SpellGenerator} */
function scorpion_spell_generator(){
    return {
        behavior: scorpion_spell,
        telegraph_other: scorpion_spell_telegraph,
        description: forest_heart_summon_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_summon.png`
    }
}

/** @type {AIFunction} Spawns a scorpion on each side.*/
function scorpion_spell(self, target, map){
    var width = [];
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        width.push(x);
    }
    var height = [];
    for(var y = 0; y < FLOOR_HEIGHT; ++y){
        height.push(y);
    }
    var top = randomize_arr(width).map(x => {return new Point(x, 0)});
    var bottom = randomize_arr(width).map(x => {return new Point(x, FLOOR_HEIGHT - 1)});
    var left = randomize_arr(height).map(y => {return new Point(0, y)});
    var right = randomize_arr(height).map(y => {return new Point(FLOOR_WIDTH - 1, y)});
    for(var side of [top, bottom, left, right]){
        var spawned = false;
        for(var i = 0; i < side.length && !spawned; ++i){
            if(map.check_empty(side[i])){
                map.add_tile(scorpion_tile(), side[i]);
                spawned = true;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function scorpion_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(0, 0), 
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1)
    );
}
/** @type {SpellGenerator} */
function swaying_nettle_spell_generator(){
    return {
        behavior: swaying_nettle_spell,
        telegraph_other: swaying_nettle_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Swaying Nettles around the tree.*/
function swaying_nettle_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}swaying_nettle_roots.png`,
        description: nettle_root_description,
        telegraph: hazard_telegraph
    }
    map.add_event({name: `Nettle Shield`, behavior: growth_event(points, root_layer, swaying_nettle_tile)});
}

/** @type {TelegraphFunction} */
function swaying_nettle_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}

/** @type {SpellGenerator} */
function thorn_bush_spell_generator(){
    return {
        behavior: thorn_bush_spell,
        telegraph_other: thorn_bush_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree.*/
function thorn_bush_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}thorn_roots.png`,
        description: thorn_root_description,
        telegraph: hazard_telegraph
    }
    map.add_event({name: `Bramble Shield`, behavior: growth_event(points, root_layer, thorn_bramble_tile)});
}

/** @type {TelegraphFunction} */
function thorn_bush_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
/** @type {SpellGenerator} */
function vinesnare_bush_spell_generator(){
    return {
        behavior: vinesnare_bush_spell,
        telegraph_other: vinesnare_bush_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns 3 vinesnare bushes in each corner.*/
function vinesnare_bush_spell(self, target, map){
    var points = [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),

        new Point(FLOOR_WIDTH - 1, 0),
        new Point(FLOOR_WIDTH - 2, 0),
        new Point(FLOOR_WIDTH - 1, 1),

        new Point(0, FLOOR_HEIGHT - 1),
        new Point(1, FLOOR_HEIGHT - 1),
        new Point(0, FLOOR_HEIGHT - 2),

        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 2),
    ];
    for(var space of points){
        if(map.check_empty(space)){
            map.add_tile(vinesnare_bush_tile(), space);
        }
    }
}

/** @type {TelegraphFunction} */
function vinesnare_bush_spell_telegraph(location, map, self){
    return [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),

        new Point(FLOOR_WIDTH - 1, 0),
        new Point(FLOOR_WIDTH - 2, 0),
        new Point(FLOOR_WIDTH - 1, 1),

        new Point(0, FLOOR_HEIGHT - 1),
        new Point(1, FLOOR_HEIGHT - 1),
        new Point(0, FLOOR_HEIGHT - 2),

        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 2),
    ];
}
/** @type {SpellGenerator} */
function confusion_spell_generator(){
    return {
        behavior: confusion_spell,
        telegraph_other: confusion_spell_telegraph,
        description: confusion_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_confusion.png`
    }
}

/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(self, target, map){
    for(var i = 0; i < 2; ++i){
        map.stun_tile(self.location.plus(target.difference));
    }
}

/** @type {TelegraphFunction} Shows that the player will be confused.*/
function confusion_spell_telegraph(location, map, self){
    return [map.get_player_location()];
}
/** @type {SpellGenerator} */
function earthquake_spell_generator(){
    return {
        behavior: earthquake_spell,
        description: earthquake_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_earthquake.png`
    }
}

/** @type {AIFunction} Spell which causes an earthquake causing debris to rain from the ceiling.*/
function earthquake_spell(self, target, map){
    var amount = random_num(9) + random_num(9) + random_num(9) + random_num(9);
    map.add_event({name: `Earthquake`, behavior: earthquake_event(amount)});
}
/** @type {SpellGenerator} */
function flame_wave_spell_generator(){
    return {
        behavior: flame_wave_spell,
        telegraph: flame_wave_spell_telegraph,
        description: flame_wave_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_flame_wave.png`
    }
}

/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(self, target, map){
    var direction = get_empty_nearby(self.location, order_nearby(target.difference), map);
    if(direction === undefined){
        return;
    }
    var spawnpoints = [];
    var wave = [-1, 0, 1];
    if(direction.x === 0){
        // Shooting vertically.
        spawnpoints = wave.map(x => new Point(x, direction.y));
    }
    else if(direction.y === 0){
        // Shooting horizontally.
        spawnpoints = wave.map(y => new Point(direction.x, y));
    }
    else{
        // Shooting diagonally.
        spawnpoints.push(new Point(direction.x, direction.y));
        spawnpoints.push(new Point(direction.x, 0));
        spawnpoints.push(new Point(0, direction.y));
    }
    spawnpoints = spawnpoints.map(s => self.location.plus(s));
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(direction);
        map.attack(spawnpoint);
        map.add_tile(fireball, spawnpoint);
    }
}

/** @type {TelegraphFunction} */
function flame_wave_spell_telegraph(location, map, self){
    return random_nearby().map(p => p.plus(location));
}

/** @type {SpellGenerator} */
function lava_moat_spell_generator(){
    return {
        behavior: lava_moat_spell,
        description: lava_moat_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_lava_moat.png`
    }
}

/** @type {AIFunction} Spell which creates several lava pools between the user and their target.*/
function lava_moat_spell(self, target, map){
    var nearby = order_nearby(target.difference);
    var amount = random_num(2) + 2;
    for(var i = 0; i < amount; ++i){
        var tile = lava_pool_tile();
        spawn_nearby(map, tile, self.location, nearby);
    }
}
/** @type {SpellGenerator} */
function piercing_beam_spell_generator(){
    return {
        behavior: piercing_beam_spell,
        telegraph: piercing_beam_spell_telegraph,
        description: piercing_beam_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_piercing_beam.png`
    }
}

/** @type {AIFunction} Spell which damages each tile in a single direction.*/
function piercing_beam_spell(self, target, map){
    var aim_direction = order_nearby(target.difference)[0];
    var beam_location = self.location.plus(aim_direction);
    while(map.is_in_bounds(beam_location)){
        map.attack(beam_location);
        beam_location.plus_equals(aim_direction);
    }
}

/** @type {TelegraphFunction} */
function piercing_beam_spell_telegraph(location, map, self){
    var attacks = [];
    var nearby = random_nearby();
    for(var direction of nearby){
        var beam_location = location.plus(direction);
        while(map.is_in_bounds(beam_location)){
            attacks.push(beam_location.copy());
            beam_location.plus_equals(direction);
        }
    }
    return attacks;
}
/** @type {SpellGenerator} */
function rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph: rest_spell_telegraph,
        description: rest_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_rest.png`
    }
}

/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(self, target, map){}

/** @type {TelegraphFunction} */
function rest_spell_telegraph(location, map, self){
    return [];
}
/** @type {SpellGenerator} */
function summon_spell_generator(){
    return {
        behavior: summon_spell,
        description: summon_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_summon.png`
    }
}

/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var tile = self.tile.summons[random_num(self.tile.summons.length)]();
    spawn_nearby(map, tile, self.location);
}
/** @type {SpellGenerator} */
function teleport_spell_generator(){
    return {
        behavior: teleport_spell,
        description: teleport_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_teleport.png`
    }
}

/** @type {AIFunction} Spell which teleports the user to a random location.*/
function teleport_spell(self, target, map){
    var space = map.random_empty();
    if(map.move(self.location, space)){
        self.location.x = space.x;
        self.location.y = space.y;
    }
}
// ----------------Spells.js----------------
// File for spell ai functions.

/**
 * @typedef {Object} Spell A set a behavior, description and pic used by the lich.
 * @property {AIFunction} behavior Function performing the spell.
 * @property {TelegraphFunction=} telegraph Function telegraphing the damaging effects of the spell.
 * @property {TelegraphFunction=} telegraph_other Function telegraphing the non damaging effects of the spell.
 * @property {string} description A description of what the spell does.
 * @property {string} pic A picture to help telegraph the spell.
 */

/**
 * @callback SpellGenerator
 * @returns {Spell}
 */

// ----------------TelegraphUtils.js----------------
// File for utility functions and jsdoc typedefs used to telegraph enemy attacks and abilities.

/**
 * @callback TelegraphFunction Function to get the points that a entity can attack on it's next turn.
 * @param {Point} location Where the entity currently is.
 * @param {GameMap} map The map it's in.
 * @param {Tile} self Info about the entity.
 * @returns {Point[]} An array of the points on the map it could currently attack.
 */

const HORIZONTAL_DIRECTIONS = [new Point(1, 0), new Point(-1, 0), new Point(0, -1), new Point(0, 1)];
const DIAGONAL_DIRECTIONS = [new Point(1, 1), new Point(-1, 1), new Point(1, -1), new Point(-1, -1)];
const ALL_DIRECTIONS = HORIZONTAL_DIRECTIONS.concat(DIAGONAL_DIRECTIONS);

/** @type {TelegraphFunction} */
function hazard_telegraph(location, map, self){
    return [location];
}
/**
 * Function to get all points from a location to and including the closest occupied space in a direction.
 * @param {Point} location The starting location which should not be included.
 * @param {Point} direction The relative direction to look from the starting location.
 * @param {GameMap} map The gamemap to look on.
 * @returns {Point[]} An array of the points in that direction up to the first occupied one.
 */
function get_points_in_direction(location, direction, map){
    location = location.copy();
    var points = [];
    while(map.check_empty(location.plus_equals(direction))){
        points.push(location.copy());
    }
    points.push(location);
    return points;
}
/**
 * Function that for an array of directions, attempts to move in a direction if possible, then attack in that direction.
 * @param {Point} location The starting location
 * @param {GameMap} map The map to look on.
 * @param {Point[]} directions The directions to attempt to move and attack in.
 * @returns {Point[]} Where moving then attacking in each of the chosen directions would hit.
 */
function move_attack_telegraph(location, map, directions){
    var attacks = [];
    for(var direction of directions){
        if(map.check_empty(location.plus(direction))){
            attacks.push(location.plus(direction.times(2)));
        }
        attacks.push(location.plus(direction));
    }
    return attacks;
}




class BoonTracker{
    #choices;
    #boons;
    #lost_boons;
    total;
    constructor(initial_choices){
        this.#choices = initial_choices.map(b => b());
        this.#boons = [];
        this.#lost_boons = [];
        this.total = 0;
    }
    get_choices(amount){
        var choice_list = randomize_arr(this.#choices);
        var picks = [];
        while(picks.length < amount && choice_list.length > 0){
            var boon = choice_list.pop();
            if(boon.prereq === undefined || boon.prereq()){
                picks.push(boon);
            }
        }
        return picks;
    }
    has(name){
        var count = 0;
        for(var boon of this.#boons){
            if(boon.name === name){
                ++count;
            }
        }
        return count;
    }
    pick(name){
        for(var i = 0; i < this.#choices.length; ++i){
            var boon = this.#choices[i];
            if(boon.name === name){
                this.#choices.splice(i, 1);
                if(boon.unlocks !== undefined){
                    this.#choices.push(...boon.unlocks.map(f => f()));
                }
                if(boon.on_pick !== undefined){
                    boon.on_pick();
                }
                this.#boons.push(boon);
                ++this.total;
                return true;
            }
        }
        return false;
    }
    lose(name){
        for(var i = 0; i < this.#boons.length; ++i){
            var boon = this.#boons[i];
            if(boon.name === name){
                this.#boons.splice(i, 1);
                this.#lost_boons.push(boon);
                return true;
            }
        }
        return false;
    }
    get_gained(){
        return this.#boons.map(b => {return {
            name: b.name,
            pic: b.pic,
            on_click: function(){say(b.description, false)}
        }});
    }
    get_lost(){
        return this.#lost_boons.map(b => {return {
            name: b.name,
            foreground: [`${IMG_FOLDER.other}lost.png`],
            pic: b.pic,
            on_click: function(){say(b.description, false)}
        }});
    }

}


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
                var t = telegraph_card(behavior, GS.map);
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
            grid.push(row.map(button => {return {
                description: button.description,
                alt_click: telegraph(button.behavior),
                on_click: click(button.behavior)
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
}
// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

/**
 * @typedef {Object} Tile_W_Pos An object containing a Tile and it's current position.
 * @property {Tile} enemy The tile.
 * @property {Point} location It's current location.
 */

class EntityList{
    /** @type {number} The number of nun empty tiles on the floor.*/
    count_non_empty;
    /** @type {Point | undefined} The position of the player, or undefined if they haven't been added yet.*/
    #player_pos;
    /** @type {Point | undefined} The position of the exit, or undefined if it hasn't been added yet.*/
    #exit_pos;
    /** @type {Tile_W_Pos[]} An array of each entity on the floor with a behavior as well as their location.*/
    #enemy_list;
    /** @type {number} Used to give a unique ID to each tile that is added.*/
    #id_count;

    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#enemy_list = [];
    }
    /**
     * Gets a unique id and increments the count.
     * @returns {number} The id.
     */
    next_id(){
        return ++this.#id_count;
    }
    /**
     * @param {Point} location Where the player's location should be set to.
     */
    set_player_pos(location){
        this.#player_pos = location;
    }
    /**
     * Returns the player's location. Throws an error if it's undefined.
     * @returns {Point} The player's location.
     */
    get_player_pos(){
        if(this.#player_pos === undefined){
            throw new Error(ERRORS.value_not_found);
        }
        return this.#player_pos.copy();
    }
    /**
     * @param {Point} location Where the exit's location should be set to
     */
    set_exit(location){
        this.#exit_pos = location;
    }
    /**
     * Returns the exit's location. Throws an error if it's undefined.
     * @returns {Point} The exit's location.
     */
    get_exit_pos(){
        if(this.#exit_pos === undefined){
            throw new Error(ERRORS.value_not_found);
        }
        return this.#exit_pos.copy();
    }
    /**
     * Adds a new enemy and it's location to the array of enemies.
     * @param {Point} location The location of the enemy.
     * @param {Tile} enemy The tile.
     */
    add_enemy(location, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({location: location.copy(), enemy});
        ++this.count_non_empty;
    }
    /**
     * Changes an enemy's location.
     * @param {Point} location The new location.
     * @param {number} id The id of the enemy whose location should be moved. Throws an error if none match.
     */
    move_enemy(location, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(ERRORS.missing_id);
        }
        this.#enemy_list[index].location = location;
    }
    /**
     * Removes an enemy.
     * @param {number} id The id of the enemy to be removed. Throws an error if none match.
     */
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(ERRORS.missing_id);
        }
        this.#enemy_list.splice(index, 1);
        --this.count_non_empty;
    }
    /**
     * Helper function to determine the location of an entity in the entity_list.
     * @param {number} id ID to search for.
     * @returns {number} Returns the index if found and -1 if not.
     */
    #find_by_id(id){
        for(var i = 0; i < this.#enemy_list.length; ++i){
            if(this.#enemy_list[i].enemy.id === id){
                return i;
            }
        }
        return -1;
    }
    /**
     * Moves a enemy or a player. Throws an error if the type is something else or the entity is not in the entity_list.
     * @param {Point} location The new location.
     * @param {Tile} entity The Tile to be moved
     */
    move_any(location, entity){
        if(entity.type === `player`){
            this.set_player_pos(location);
        }
        else if(entity.type === `enemy`){
            if(entity.id === undefined){
                throw new Error(ERRORS.missing_id);
            }
            this.move_enemy(location, entity.id);
        }
        else{
            throw new Error(ERRORS.invalid_type);
        }
    }
    /**
     * Each enemy takes a turn in order.
     * Throws an error if the player dies or is moved.
     * @param {GameMap} map The map object which their actions will be performed on.
     */
    async enemy_turn(map){
        // Triggers each enemy's behavior.
        // Displays the game map between each.
        var turn = [...this.#enemy_list];
        for(var e of turn){
            if(e.enemy.id === undefined){
                throw new Error(ERRORS.missing_id);
            }
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    var initial_health = GS.map.get_player().health;
                    if(e.enemy.stun !== undefined && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        var do_delay = true;
                        try{
                            if(e.enemy.behavior !== undefined){
                                var self = {
                                    tile: e.enemy,
                                    location: e.location.copy()
                                }
                                var target = {
                                    tile: map.get_player(),
                                    difference: this.get_player_pos().minus(e.location)
                                }
                                e.enemy.behavior(self, target, map);
                                proc_chilly_presence(e.enemy);
                            }
                        }
                        catch(error){
                            if(error.message === ERRORS.skip_animation){
                                do_delay = false;
                                proc_chilly_presence(e.enemy);
                            }
                            else if(!(error.message === ERRORS.creature_died)){
                                throw error
                            }
                        }
                        display_map(map);
                        if(do_delay){
                            await delay(ANIMATION_DELAY);
                        }
                    }
                    if(GS.boons.has(boon_names.pain_reflexes) && GS.map.get_player().health < initial_health){
                        throw new Error(ERRORS.pass_turn);
                    }
                }
                catch(error){
                    if(error.message === ERRORS.game_over){
                        throw new Error(ERRORS.game_over, {cause: new Error(e.enemy.name)});
                    }
                    throw error;
                }
            } 
        }
    }
    get_initiative(){
        var visible = this.#enemy_list.filter(e => !e.enemy.tags.has(TAGS.hidden));
        return visible.map(e => {
            return {
                name: e.enemy.name,
                pic: e.enemy.pic,
                health: e.enemy.health,
                max_health: e.enemy.max_health,
                stun: e.enemy.stun,
                location: e.location,
                rotate: e.enemy.rotate,
                flip: e.enemy.flip
            }
        });
    }
}

// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

/**
 * @callback MapEventFunction Function to execute an event on the map at the end of the enemies' turn.
 * @param {GameMap} map Function controlling behavior of the event.
 */
/**
 * @typedef {Object} MapEvent An object representing an event that will happen at the end of the enemies' turn.
 * @property {String} name The name of the event.
 * @property {MapEventFunction} behavior The event's behavior.
 */
/**
 * @typedef {Object} GridSpace
 * @property {GridSpaceLayer[]} foreground
 * @property {Tile} tile
 * @property {GridSpaceLayer[]} background
 * @property {GridSpaceLayer=} action
 * @property {GridSpaceLayer=} stunned
 * @property {GridSpaceLayer} floor
 */
/**
 * @typedef {Object} GridSpaceLayer
 * @property {string} pic
 * @property {string=} descrtiption
 * @property {TelegraphFunction=} telegraph
 * @property {TelegraphFunction=} telegraph_other
 */

class GameMap{
    /** @type {number} Size of the grid's x axis.*/
    #x_max;
    /** @type {number} Size of the grid's y axis.*/
    #y_max;
    /** @type {EntityList} Used to keep track of non player entity locations and perform their turns.*/
    #entity_list;
    /** @type {Tile[][]} Grid representing the floor layout.*/
    #grid;
    /** @type {number} Which number floor this is.*/
    #floor_num;
    /** @type {number} Total number of turns that have elapsed.*/
    #turn_count;
    /** @type {MapEvent[]} Events that will happen at the end of the turn.*/
    #events;
    /** @type {Area} The current area of the dungeon they are in.*/
    #area;
    /**
     * @param {number} x_max The x size of floors in this dungeon.
     * @param {number} y_max The y size of floors in this dungeon.
     * @param {Area} starting_area The starting area.
     */
    constructor(x_max, y_max, starting_area){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#entity_list = new EntityList();
        this.#floor_num = 0;
        this.#turn_count = 0;
        this.#events = [];
        this.#area = starting_area;
        this.erase()
    }
    /**
     * Function to reset the floor so the next one can be generated,
     * @returns {number} The updated floor number.
     */
    erase(){
        try{
            // Grabs the player tile from the current floor.
            var player = this.get_player();
        }
        catch(error){
            if(error.message === ERRORS.value_not_found){
                var player = player_tile();
            }
            else{
                throw error;
            }
        }
        this.#entity_list = new EntityList();
        this.#grid = [];
        // Fill the grid with blank spaces.
        for(var i = 0; i < this.#y_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#x_max; ++j){
                this.#grid[i].push(grid_space(this.#area));
            }
        }
        // Add the player and the exit.
        var exit_location = new Point(random_num(this.#y_max), 0);
        this.set_exit(exit_location);
        var player_location = new Point(random_num(this.#y_max), this.#x_max - 1);
        this.set_player(player_location, player);
        this.#events = [];
        return ++this.#floor_num;
    }
    /**
     * @returns {Point} A random space on the floor.
     */
    random_space(){
        return new Point(random_num(this.#x_max), random_num(this.#y_max));
    }
    /**
     * @returns {Point} A random empty space on the floor.
     */
    random_empty(){
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count_non_empty;
        var rand = random_num(num_empty);
        if(num_empty === 0){
            throw new Error(ERRORS.map_full);
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                var pos = new Point(x, y)
                if(this.get_tile(pos).type === `empty`){
                    if(rand === 0){
                        return pos;
                    }
                    --rand;
                }
            }
        }
        throw new Error(ERRORS.map_full);
    }
    /**
     * Thows an error if the provided point is out of bounds.
     * @param {Point} location The point to check.
     */
    check_bounds(location){
        if(location.x < 0 || location.x >= this.#x_max){
            throw new Error(ERRORS.out_of_bounds);
        }
        if(location.y < 0 || location.y >= this.#y_max){
            throw new Error(ERRORS.out_of_bounds);
        }
    }
    /**
     * Checks if a point is within bounds.
     * @param {Point} location The point to check.
     * @returns {boolean} If the point is in bounds.
     */
    is_in_bounds(location){
        if(location.x < 0 || location.x >= this.#x_max){
            return false;
        }
        if(location.y < 0 || location.y >= this.#y_max){
            return false;
        }
        return true;
    }
    /**
     * Checks if a location is in bounds and empty.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and empty and false otherwise.
     */
    check_empty(location){
        return this.is_in_bounds(location) && this.get_tile(location).type === `empty`;
    }
    /**
     * Checks if a location is in bounds and looks empty (could be something invisible).
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and looks empty and false otherwise.
     */
    looks_empty(location){
        return this.is_in_bounds(location) && this.get_tile(location).name === `Empty`;
    }
    /**
     * Places an exit tile at the given location
     * Throws an error if the location is out of bounds, the space is not empty or there is already an exit tile.
     * @param {Point} location The location to set the exit at.
     */
    set_exit(location){
        this.check_bounds(location);
        if(!this.check_empty(location)){
            throw new Error(ERRORS.space_full);
        }
        try{
            // If exit isn't undefined, throws error.
            this.#entity_list.get_exit_pos();
            throw new Error(ERRORS.already_exists)
        }
        catch(error) {
            if(error.message !== ERRORS.value_not_found){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_exit(location);
        this.#set_tile(location, exit_tile());
    }
    /**
     * Places the player at the given location.
     * Throws an error if player is not a player, the location is out of bounds, the space is not empty or there is already a player tile.
     * @param {Point} player_location The location to set the player at.
     * @param {Tile} player The player tile to be placed,
     */
    set_player(player_location, player){
        if(player.type !== `player`){
            throw new Error(ERRORS.invalid_value)
        }
        this.check_bounds(player_location);
        if(!this.check_empty(player_location)){
            throw new Error(ERRORS.space_full);
        }
        try{
            // If player isn't undefined, throws error.
            this.#entity_list.get_player_pos();
            throw new Error(ERRORS.already_exists)
        }
        catch(error) {
            if(error.message !== ERRORS.value_not_found){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_player_pos(player_location);
        this.#set_tile(player_location, player);
    }
    /**
     * Function to add a tile to the map.
     * @param {Tile} tile The tile to be added.
     * @param {Point} [location = undefined] Optional location to place the tile. If the location is not empty, an error will be thrown.
     *                                          If not provided, the location will be a random unoccupied one.
     * @returns {Point | void} If it successfully adds the tile, returns the location. Otherwise, returns void.
     */
    add_tile(tile, location = undefined){
        try{
            // Makes sure the location is valid and empty
            if(location === undefined){
                location = this.random_empty();
            }
            this.check_bounds(location);
            if(!this.check_empty(location)){
                throw new Error(ERRORS.space_full);
            }
        }
        catch(error){
            return;
        }
        this.#set_tile(location, tile);
        if(tile.type === `enemy`){
            this.#entity_list.add_enemy(location, tile);
        }
        else if(!(tile.type === `empty`)){
            ++this.#entity_list.count_non_empty;
        }
        return location.copy();
    }
    /**
     * Makes a number of attempts to spawn the given enemy at a location where it can't immediately attack the player.
     * @param {Tile} tile The tile to be added.
     * @param {number} tries The number of attempts
     * @param {boolean} force If true, the enemy will be spawned randomly using add_tile after all tries are exhausted. 
     * @returns {Point | void} If the tile is added, it returns the location. Otherwise it returns void.
     */
    spawn_safely(tile, tries, force){
        var attacks = [];
        var player_location = this.#entity_list.get_player_pos();
        if(!player_location){
            throw new Error(ERRORS.value_not_found);
        }
        for(var i = 0; i < tries; ++i){
            var location = this.random_empty();
            if(tile.telegraph){
                attacks = tile.telegraph(location, this, tile);
            }
            if(!attacks.find((element) => point_equals(element, player_location))){
                return this.add_tile(tile, location);
            }
        }
        if(force){
            return this.add_tile(tile);
        }
        return undefined;
    }
    /**
     * Function to display the gamemap and the player's health.
     * Clicking on a tile will give info about it.
     * Resets tiles marked as hit afterwards.
     * @returns {void}
     */
    display(){
        var make_on_click = function(space, location, gameMap){
            return function(){
                var description = grid_space_description(space);
                var tile = space.tile;
                say(description, false);
                gameMap.clear_telegraphs();
                var telegraph_spaces = [];
                var telegraph_other_spaces = [];
                for(var element of [...space.foreground, ...space.background]){
                    // Checks for upcoming attacks from the things in the foreground and background.
                    if(element.telegraph !== undefined){
                        telegraph_spaces.push(...element.telegraph(location, gameMap, element));
                    }
                    if(element.telegraph_other !== undefined){
                        telegraph_other_spaces.push(...element.telegraph_other(location, gameMap, element));
                    }
                }
                // Checks for upcoming attacks from the tile itself.
                if(tile.telegraph !== undefined && !tile.stun){
                    telegraph_spaces.push(...tile.telegraph(location, gameMap, tile));
                }
                if(tile.telegraph_other !== undefined && !tile.stun){
                    telegraph_other_spaces.push(...tile.telegraph_other(location, gameMap, tile));
                }
                // Telegraphs possible upcoming attacks and other things.
                gameMap.mark_telegraph(telegraph_spaces);
                gameMap.mark_telegraph(telegraph_other_spaces, `${IMG_FOLDER.actions}telegraph_other.png`);
                display_map(gameMap);
                display.add_class(`${UIIDS.map_display} ${location.y} ${location.x}`, `selected-tile`);
            }
        }
        var grid = [];
        for(var y = 0; y < this.#y_max; ++y){
            var row = this.#grid[y];
            var table_row = [];
            for(var x = 0; x < this.#x_max; ++x){
                let space = row[x];
                let stunned = [];
                if(space.tile.stun !== undefined && space.tile.stun > 0){
                    stunned.push(`${IMG_FOLDER.actions}confuse.png`);
                }
                let foreground_pics = space.foreground.map((fg) => fg.pic);
                let background_pics = space.background.map((fg) => fg.pic);
                table_row.push({
                    name: space.tile.name,
                    foreground: foreground_pics,
                    pic: space.tile.pic,
                    rotate: space.tile.rotate,
                    flip: space.tile.flip,
                    background: [...background_pics, space.action, ...stunned, this.#area.background],
                    on_click: make_on_click(space, new Point(x, y), this)
                });
            };
            grid.push(table_row);
        }
        return grid;
	}
    /**
     * Moves a tile.
     * Throws errors if the player reaches the end of the floor or if the tile (player or not) dies.
     * @param {Point} start_point The current location of the tile to be moved.
     * @param {Point} end_point Where you want to move the tile to.
     * @returns {boolean} Returns true if the tile is moved succesfully, false if it is not.
     */
    move(start_point, end_point){
        this.check_bounds(start_point);
        if(!this.is_in_bounds(end_point)){
            return false;
        }
        var start = this.get_tile(start_point);
        var end = this.get_tile(end_point);
        if(start.type === `player` && end.type === `exit`){
            ++this.#turn_count;
            throw new Error(ERRORS.floor_complete);
        }
        if(end.on_enter !== undefined){
            // If the destination does something if moved onto, call it.
            try{
                var entity_entered = {
                    tile: end,
                    location: end_point
                }
                var mover_info = {
                    tile: start,
                    difference: start_point.minus(end_point)
                }
                end.on_enter(entity_entered, mover_info, this);
            }
            catch(error){
                if(error.message === ERRORS.game_over){
                    throw new Error(ERRORS.game_over, {cause: new Error(end.name)});
                }
                if(error.message === ERRORS.skip_animation){
                    // Do nothing
                }
                else{
                    throw error;
                }
            }
            if(start.health !== undefined && start.health <= 0){
                throw new Error(ERRORS.creature_died);
            }
        }
        end = this.get_tile(end_point);
        if(end.type === `empty` && this.get_tile(start_point) === start){
            // Move.
            this.#entity_list.move_any(end_point, start);
            this.#set_tile(end_point, start);
            this.#set_tile(start_point, empty_tile());
            return true;
        }
        return false;
    }
    /**
     * Moves the player relative to their current location.
     * @param {Point} direction Relative movement.
     * @returns {boolean} Returns true if the player is moved, false otherwise.
     */
    player_move(direction){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        return this.move(player_pos, player_pos.plus(direction));
    }
    /**
     * Teleports something at a space relative to the player to a random location.
     * @param {Point} target Relative location.
     * @returns {boolean} Returns true if something was teleported, false otherwise.
     */
    player_teleport(target){
        var player_pos = this.#entity_list.get_player_pos();
        var destination = this.random_empty();
        return this.move(player_pos.plus(target), destination);
    }
    /**
     * Returns the player tile. Throws an error if there isn't one.
     * @returns {Tile} The player tile.
     */
    get_player(){
        var pos = this.#entity_list.get_player_pos();
        return this.get_tile(pos);
    }
    /**
     * Returns the player's location. Throws an error if there isn't one.
     * @returns {Point} The player's location.
     */
    get_player_location(){
        return this.#entity_list.get_player_pos();
    }
    /**
     * Attacks a point on the grid.
     * @param {Point} location Where to attack.
     * @returns {boolean} Returns true if the attack hit.
     */
    attack(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}hit.png`;
        var target = space.tile;
        if(target.health !== undefined){
            target.health -= 1;
            if(target.on_hit !== undefined){
                // Trigger on_hit.
                var player_pos = this.#entity_list.get_player_pos();
                var hit_entity = {
                    tile: target,
                    location: location
                }
                var aggressor_info = { // TODO: when damage source is implemented, use that instead.
                    tile: this.get_player(),
                    difference: player_pos.minus(location)
                }
                target.on_hit(hit_entity, aggressor_info, this);
            }
            if(target.health <= 0){
                // Player death.
                if(target.type === `player`){
                    if(GS.boons.has(boon_names.rebirth)){
                        this.player_heal(new Point(0, 0));
                        GS.boons.lose(boon_names.rebirth);
                        GS.refresh_boon_display();
                        say(rebirth_revival_message);
                        return true;
                    }
                    throw new Error(ERRORS.game_over);
                }
                // Non player death.
                this.#set_tile(location, empty_tile());
                if(target.type === `enemy`){
                    if(target.id === undefined){
                        throw new Error(ERRORS.missing_id);
                    }
                    this.#entity_list.remove_enemy(target.id);
                }
                else{
                    --this.#entity_list.count_non_empty;
                }
                if(target.on_death !== undefined){
                    // Trigger on_death/
                    var player_pos = this.#entity_list.get_player_pos();
                    var dying_entity = {
                        tile: target,
                        location: location
                    }
                    var player_info = {
                        tile: this.get_player(),
                        difference: player_pos.minus(location)
                    }
                    target.on_death(dying_entity, player_info, this);
                }
            }
            return true;
        }
        if(target.health === undefined && target.on_hit !== undefined){
            // Trigger on_hit
            var player_pos = this.#entity_list.get_player_pos();
            var hit_entity = {
                tile: target,
                location: location
            }
            var aggressor_info = { // TODO: when damage source is implemented, use that instead.
                tile: this.get_player(),
                difference: player_pos.minus(location)
            }
            target.on_hit(hit_entity, aggressor_info, this);
            return true;
        }
        return false;
    }
    /**
     * Attacks relative to the player's location.
     * @param {Point} direction Relative direction of attack.
     * @returns {boolean} Returns true if the attack hits and false otherwise.
     */
    player_attack(direction){
        var pos = this.#entity_list.get_player_pos().plus(direction);
        try{
            return this.attack(pos);
        }
        catch (error){
            if(error.message !== `game over`){
                throw error;
            }
            throw new Error(ERRORS.game_over, {cause: new Error(`player`)});
        }
    }
    /**
     * Each enemy takes their turn.
     * Throws an error if the player dies or is moved.
     * @returns {Promise<undefined>} Resolves when their turn is done.
     */
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        ++this.#turn_count;
        await this.#entity_list.enemy_turn(this);
    }
    /**
     * Displays the current floor number and turn count.
     * @param {string} location Where they should be displayed.
     */
    display_stats(location){
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    /**
     * Replaces the exit tile with a lock tile.
     * Throws an error if there is no exit.
     * @returns {void}
     */
    lock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_tile(pos, lock_tile())
    }
    /**
     * Replaces the lock tile with an exit one and heals the player to max.
     * Throws an error if there is no lock or exit.
     * @returns {void}
     */
    unlock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_tile(pos, exit_tile());
        this.player_heal(new Point(0, 0));
    }
    /**
     * Schedules an event to happen at end of turn.
     * @param {MapEvent} event The even to be added.
     */
    add_event(event){
        this.#events.push(event);
    }
    /**
     * Executes and removes each scheduled event.
     * Throws an error if one that isn't handled tries to happen or the player dies.
     * @returns {void}
     */
    resolve_events(){
        var current_events = this.#events;
        this.#events = [];
        for(var event of current_events){
            try{
                event.behavior(this);
            }
            catch(error){
                if(error.message === ERRORS.game_over){
                    throw new Error(ERRORS.game_over, {cause: new Error(event.name)});
                }
                throw error;
            }
            
        }
        
        
    }
    /**
     * Clears the current floor and goes to the next one then generates it based on the current area.
     * @returns {void}
     */
    next_floor(){
        this.erase();
        var player = this.get_player();
        if(player.health === 1 && GS.boons.has(boon_names.bitter_determination) > 0){
            // Bitter determination heals you if you are at exactly 1.
            this.player_heal(new Point(0, 0), 1);
        }
        if(GS.boons.has(boon_names.expend_vitality) > 0){
            // Expend Vitality always heals you.
            this.player_heal(new Point(0, 0), 1);
        }
        if(GS.boons.has(boon_names.pacifism) > 0){
            // Pacifism always fully heals you.
            this.player_heal(new Point(0, 0));
        }
        var floor_description = `${floor_message}${this.#floor_num}.`;
        if(this.#floor_num % AREA_SIZE === 1){
            // Reached the next area.
            var next_list = this.#area.next_area_list;
            this.#area = next_list[random_num(next_list.length)]();
            floor_description += `\n${this.#area.description}`;
        }
        if(this.#floor_num % AREA_SIZE === 0 && this.#area.boss_floor_list.length > 0){
            // Reached the boss.
            var boss_floor = this.#area.boss_floor_list[random_num(this.#area.boss_floor_list.length)];
            boss_floor_common(this.#floor_num, this.#area, this); 
            var boss_message = boss_floor(this.#floor_num, this.#area, this);
            floor_description += `\n${boss_message}`;
        }
        else{
            var extra_difficulty = 5 * GS.boons.has(boon_names.roar_of_challenge);
            this.#area.generate_floor(this.#floor_num + extra_difficulty, this.#area, this);
        }
        if(this.#floor_num % AREA_SIZE === CHEST_LOCATION){
            var chest = appropriate_chest_tile();
            var choices = GS.boons.get_choices(BOON_CHOICES + (2 * GS.boons.has(boon_names.hoarder)));
            for(var boon of choices){
                add_boon_to_chest(chest, boon);
            }
            this.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        say(floor_description);
    }
    /**
     * Gets a GridSpace from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_grid(location){
        this.check_bounds(location);
        return this.#grid[location.y][location.x];
    }
    /**
     * Gets a tile from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_tile(location){
        var space = this.get_grid(location);
        return space.tile;
    }
    /**
     * Puts a tile at the given location.
     * Throws an error if the location is out of bounds.
     * @param {Point} location Where to put the tile.
     * @param {Tile} value The tile to place.
     */
    #set_tile(location, value){
        this.check_bounds(location);
        this.#grid[location.y][location.x].tile = value;
    }
    /**
     * Marks which positions an entity can attack during it's next turn.
     * @param {Point[]} positions A list of positions to mark.
     * @param {string=} pic If provided, it will telegraph that rather than a hit.
     */
    mark_telegraph(positions, pic = `${IMG_FOLDER.actions}hit_telegraph.png`){
        for(var position of positions){
            if(this.is_in_bounds(position)){
                this.get_grid(position).action = pic;
            }
        }
    }
    /**
     * Clears all hits and other alternate pics from empty tiles in the grid.
     * @returns {void}
     */
    clear_telegraphs(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                this.get_grid(new Point(x, y)).action = `${IMG_FOLDER.tiles}empty.png`;
            }
        }
    }
    /**
     * Function to mark a tile with a specific name, description and background.
     * @param {Point} location The location of the tile to mark.
     * @param {TileGenerator} mark Contains the fields to use.
     * @param {boolean} foreground Controls if the image will be in the foreground or background. Defaults to foregroung.
     */
    mark_event(location, mark, foreground = true){
        var space = this.get_grid(location);
        if(foreground){
            space.foreground.push(mark);
        }
        else{
            space.background.push(mark);
        }
    }
    /**
     * Function to clear all marked empty tiles.
     * @returns {void}
     */
    clear_marked(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var space = this.get_grid(new Point(x, y));
                space.foreground = [];
                space.background = [];
            }
        }
    }
    /**
     * Function to stun the enemy at a given location.
     * @param {Point} location The location of the tile to stun.
     * @returns {boolean} If something was stunned.
     */
    stun_tile(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}confuse.png`;
        var tile = space.tile;
        if(tile.type === `enemy`){
            stun(tile);
            return true;
        }
        if(tile.type === `player`){
            confuse_player();
            return true;
        }
        return false;
    }
    /**
     * Function to stun the enemy at a place releative to the player.
     * @param {Point} direction The location of the tile to stun relative to the player.
     * @returns {boolean} If something was stunned.
     */
    player_stun(direction){
        var pos = this.#entity_list.get_player_pos();
        return this.stun_tile(pos.plus(direction));
    }
    /**
     * Function to heal the tile at the given location.
     * @param {Point} location The location of the tile to heal.
     * @param {number=} amount Provides the amount to heal for. If not given, instead heals to max.
     * @returns {boolean} if healing was performed.
     */
    heal(location, amount=undefined){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}heal.png`;
        var tile = space.tile;
        if(tile.health === undefined){
            // No health to heal.
            return false;
        }
        if(amount === undefined){
            // If no amount is specified, sets health to max.
            if(tile.max_health === undefined){
                throw new Error(ERRORS.value_not_found);
            }
            var healed = tile.health < tile.max_health;
            tile.health = tile.max_health;
            return healed;
        }
        if(tile.max_health === undefined){
            // If no max health is specified, heals by the given amount.
            tile.health += amount;
            return true;
        }
        if(tile.health === tile.max_health){
            // Otherwise, only heals up to the max.
            return false;
        }
        if(amount > 0){
            ++tile.health;
            this.heal(location, amount - 1)
            return true;
        }
        return false;
    }
    /**
     * Function to heal a tile at a location relative to the player.
     * @param {Point} difference The relative location of the tile to heal.
     * @param {number=} amount Provides the amount to heal for. If not given, instead heals to max.
     * @returns {boolean} if healing was performed.
     */
    player_heal(difference, amount=undefined){
        if(amount === undefined && this.get_player().max_health === undefined){
            amount = 1;
        }
        var pos = this.#entity_list.get_player_pos();
        return this.heal(pos.plus(difference), amount);
    }
    /**
     * @returns {number} The number of turns that have elapsed.
     */
    get_turn_count(){
        return this.#turn_count;
    }
    /**
     * Checks if a location is in bounds and looks empty, or has a on_enter function.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the tile fits the criteria, false otherwise.
     */
    looks_movable(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var tile = this.get_tile(location);
        return (tile.name === `Empty` || tile.on_enter !== undefined || tile.name === `Exit`);
    }
    get_initiative(){
        return this.#entity_list.get_initiative();
    }
}

/**
 * Creates an empty space to add to the game map's grid.
 * @param {}
 * @returns {GridSpace} The resulting array.
 */
function grid_space(area){
    return {
        foreground: [],
        tile: empty_tile(),
        background: [],
        action: `${IMG_FOLDER.tiles}empty.png`
    }
}
// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.


class GameState{
    /** @type {GameMap} The map of the current floor.*/
    map;
    /** @type {MoveDeck} The player's deck of cards.*/
    deck;
    boons;
    #player_turn_lock;
    #text_log;
    constructor(){
        // Starts the game on load.
        this.setup();
    }
    /** 
     * Function to set up or reset the game.
     * @returns {void} 
     */
    setup(){
        // Function ran on page load or on restart to set up the game.
        this.#text_log = [];
        this.boons = new BoonTracker(BOON_LIST);
        var start = randomize_arr(STARTING_AREA)[0]();
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start);
        this.deck = STARTING_DECK();

        var starting_text = `${start.description}\n${welcome_message}`;
        say(starting_text, false);
        this.record_message(starting_text);
        display.display_message(UIIDS.hand_label, `${hand_label_text}`);
        display.display_message(UIIDS.move_label, `${move_label_text}`);
        create_sidebar();

        // Prep map
        for(var i = 0; i < STARTING_ENEMY_AMOUNT; ++i){
            this.map.spawn_safely(STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        }
        for(var i = 0; i < SECOND_STARTING_ENEMY_AMOUNT; ++i){
            this.map.spawn_safely(SECOND_STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        }
        for(var i = 0; i < STARTING_CHEST_AMOUNT; ++i){
            var chest = chest_tile();
            add_boon_to_chest(chest, STARTING_CHEST_CONTENTS());
            this.map.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        display_map(this.map);
        this.map.display_stats(UIIDS.stats);

        this.refresh_deck_display();
        display.display_message(UIIDS.shop_instructions, mod_deck);
        display.swap_screen(DISPLAY_DIVISIONS, UIIDS.game_screen);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        this.#player_turn_lock = true;
    }
    /** 
     * Handles the effects of using a card, then passes to the enemies' turn.
     * Takes the appropriate actions if
     *      -The floor is completed
     *      -The player dies
     *      -The enemies' turn ends early
     * @param {PlayerCommand[]} behavior A set of commands to be executed one by one.
     * @param {number} hand_pos The position of the card that the player used in their hand.
     */
    async player_turn(behavior, hand_pos){
        // Function to execute the outcome of the player's turn.
        if(!this.lock_player_turn()){
            return;
        }
        display.remove_children(UIIDS.move_buttons);
        this.map.clear_marked();
        say(``, false);
        try{
            // The repetition boon will double movements one in every 3 turns.
            var repetition_count = GS.boons.has(boon_names.repetition);
            var repeat = (repetition_count > 0 && GS.map.get_turn_count() % 3 < repetition_count) ? 2 : 1;
            for(var i = 0; i < repeat; ++i){
                for(var action of behavior){
                    // Does each valid command in the behavior array.
                    this.player_action(action);
                }
            }
            var is_instant = this.deck.is_instant(hand_pos);
            if(this.boons.has(boon_names.spontaneous) > 0 && !is_instant){
                this.deck.discard_all();
            }
            else{
                this.deck.discard(hand_pos);
            }
            display_map(this.map);
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.refresh_deck_display();
                this.unlock_player_turn();
                this.map.display_stats(UIIDS.stats);
                display_map(this.map);
                this.unlock_player_turn();
                return;
            }
            await this.map.enemy_turn();
            await this.prep_turn();
        }
        catch (error){
            var m = error.message;
            if(m === ERRORS.floor_complete){
                // If the player has reached the end of the floor.
                this.map.display_stats(UIIDS.stats);
                this.enter_shop();
            }
            else if(m === ERRORS.game_over){
                // If the player's health reached 0
                this.game_over(error.cause.message);
            }
            else if(m === ERRORS.pass_turn){
                // If the enemies' turn was interrupted,
                // prep for player's next turn.
                this.prep_turn();
            }
            else{
                throw error;
            }
        }
    }
    /**
     * Handles an individual action of the player.
     * Throws an error if a command of the wrong type is sent in.
     * @param {PlayerCommand} action The command to be followed.
     * @returns {boolean} returns true if the action was instant, false otherwise.
     */
    player_action(action){
        switch(action.type){
            case `attack`:
                var target = this.map.get_player_location().plus(action.change);
                if( // Dazing Blows
                    this.boons.has(boon_names.dazing_blows) && 
                    !point_equals(action.change, new Point(0, 0)) &&
                    this.map.is_in_bounds(target) &&
                    !this.map.get_tile(target).tags.has(TAGS.boss)
                ){
                    this.map.player_stun(action.change);
                }
                if( // Pacifism
                    this.boons.has(boon_names.pacifism) && 
                    !point_equals(action.change, new Point(0, 0))
                ){
                    this.map.player_stun(action.change);
                    this.map.player_stun(action.change);
                }
                else{
                    this.map.player_attack(action.change);
                }
                break;
            case `move`:
                var moved = this.map.player_move(action.change);
                if(!moved && GS.boons.has(boon_names.spiked_shoes)){
                    this.map.player_attack(action.change);
                }
                
                break;
            case `teleport`:
                try{
                    this.map.player_teleport(action.change);
                }
                catch(error){
                    if(error.message !== ERRORS.map_full){
                        throw error;
                    }
                }
                break;
            case `stun`:
                this.map.player_stun(action.change);
                break;
            case `move_until`:
                var spiked_shoes = GS.boons.has(boon_names.spiked_shoes);
                while(this.map.player_move(action.change)){};
                if(spiked_shoes){
                    this.map.player_attack(action.change);
                }
                break;
            case `heal`:
                this.map.player_heal(action.change, 1);
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
        return false;
    }
    /** 
     * Sets up the next floor then leaves the shop.
     * @returns {void} 
     */
    async new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(UIIDS.stats);
        display_map(this.map);
        this.deck.deal();
        this.refresh_deck_display();
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        await delay(ANIMATION_DELAY);
        display_map(this.map);
        this.unlock_player_turn();
    }
    /** 
     * Preps and swaps to the shop screen.
     * @returns {void} 
     */
    enter_shop(){
        // Gives the player the option to add or remove a card from their deck.
        // Their deck contents are also displayed.
        // Options to remove cards will not be displayed if the deck is at the minimum size already.
        display.remove_children(UIIDS.move_buttons);
        display.remove_children(UIIDS.add_card);
        display.remove_children(UIIDS.remove_card);
        display.remove_children(UIIDS.display_deck);
        display_entire_deck(this.deck);
        this.#generate_add_row(UIIDS.add_card);
        this.#generate_remove_row(UIIDS.remove_card);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.shop);
    }
    /** 
     * Creates the row of cards that can be added to the deck.
     * @param {string} table The table where it should be displayed.
    */
    #generate_add_row(table){
        // Get card choices
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        var add_list_generators = rand_no_repeates(COMMON_CARDS, amount);
        var chance_of_rare = random_num(4);
        if(chance_of_rare < add_list_generators.length){
            var rare = rand_no_repeates(RARE_CARDS, 1);
            add_list_generators[chance_of_rare] = rare[0];
        }
        var add_list = add_list_generators.map(g => g());
        add_list.unshift(add_card_symbol())
        // Display cards
        var make_add_card = function(card, position, gamestate){
            return function(){
                if(position > 0){
                    gamestate.deck.add(card);
                    gamestate.new_floor();
                }
            }
        }
        var row = [];
        for(var i = 0; i < add_list.length; ++i){
            let card = add_list[i];
            row.push({
                name: card.name,
                pic: card.pic,
                on_click: make_add_card(card, i, this)
            })
        }
        display.add_tb_row(table, row, CARD_SCALE);
    }
    /** 
     * Creates the row of cards that can be removed from the deck.
     * @param {string} table The table where it should be displayed.
     * */
    #generate_remove_row(table){
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        var remove_list = this.deck.get_rand_cards(amount);
        if(remove_list.length > 0){
            remove_list.unshift(remove_card_symbol());
        }
        else{
            remove_list.unshift(deck_at_minimum_symbol());
        }
        var make_remove_card = function(card, position, gamestate){
            return function(){
                if(position > 0){
                    gamestate.deck.remove(card.id);
                    gamestate.new_floor();
                }
            }
        }
        var row = [];
        for(var i = 0; i < remove_list.length; ++i){
            let card = remove_list[i];
            row.push({
                name: card.name,
                pic: card.pic,
                on_click: make_remove_card(card, i, this)
            });
        }
        display.add_tb_row(table, row, CARD_SCALE);
    }
    /**
     * Called when the player dies. Gives the option to restart.
     * @param {string} cause Cause of death.
     */
    game_over(cause){
        // Tells the user the game is over, prevents them fro m continuing, tells them the cause
        // and gives them the chance to retry.
        display_map(this.map);
        display.remove_children(UIIDS.hand_display);
        display.remove_children(UIIDS.move_buttons);
        say(`${game_over_message}${cause.toLowerCase()}.`);
        display.remove_children(UIIDS.move_buttons);
        var restart = function(game){
            return function(message, position){
                display.remove_children(UIIDS.retry_button);
                game.setup();
            };
        }
        var restart_message = [{
            description: retry_message,
            on_click: restart(this)
        }]
        display.add_button_row(UIIDS.retry_button, restart_message);
    }
    /**
     * Adds a temporary card to the player's deck.
     * @param {Card} card The card to be added.
     */
    give_temp_card(card){
        if(GS.boons.has(boon_names.fleeting_thoughts)){
            card.options.make_instant();
        }
        this.deck.add_temp(card);
    }
    /** 
     * Sets up the player's turn.
     * @returns {Promise<void>}
     */
    async prep_turn(){
        this.map.resolve_events();
        display_map(this.map);
        await delay(ANIMATION_DELAY);
        display_map(this.map);
        this.refresh_deck_display();
        this.map.display_stats(UIIDS.stats);
        this.unlock_player_turn();
    }
    /** 
     * Ensures the player can't make moves during the enemies' turn using a lock.
     * @returns {Boolean} True if the lock hasn't been used yet, false otherwise.
     */
    lock_player_turn(){
        if(this.#player_turn_lock){
            this.#player_turn_lock = false;
            return true;
        }
        return false;
    }
    /** 
     * Returns the lock so the player can take their turn.
     */
    unlock_player_turn(){
        this.#player_turn_lock = true;
    }
    /** 
     * Ensures the player can't make moves during the enemies' turn.
     * @returns {Boolean} True if the lock hasn't been used yet, false otherwise.
     */
    check_lock_player_turn(){
        return this.#player_turn_lock;
    }
    /**
     * Records a message in the text log, then displays the text log.
     * @param {string} msg The message to record.
     */
    record_message(msg){
        this.#text_log.push(msg);
        this.display_messages(UIIDS.text_scroll);
    }
    /**
     * Displays all messages in the text log.
     * @param {string} location Where to display to.
     */
    display_messages(location){
        display.remove_children(location);
        display.create_stacked_p(location, reverse_arr(this.#text_log));
    }
    /**
     * Displays the hand, discard pile, and deck to their proper locations.
     */
    refresh_deck_display(){
        refresh_hand_display(this.deck);
        refresh_discard_display(this.deck);
        refresh_deck_order_display(this.deck);
        if(this.boons !== undefined){
            var repetition_count = this.boons.has(boon_names.repetition);
            var repeat = repetition_count > 0 && this.map.get_turn_count() % 3 < repetition_count;
            telegraph_repetition_boon(repeat);
        }
    }
    /**
     * Displays the boons to their proper location.
     */
    refresh_boon_display(){
        display_boons(this.boons);
    }
}



// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    /** @type {Card[]} The array of all cards they have.*/
    #decklist; // .
    /** @type {Card[]} The array of cards in their draw pile.*/
    #library; // 
    /** @type {Card[]} The array of cards curently usable.*/
    #hand; // 
    /** @type {Card[]} The array of cards they have used since they reshuffled.*/
    #discard_pile;
    /** @type {number} Used to give each card a unique id.*/
    #id_count;
    #hand_size;
    #min_deck_size;
    constructor(hand_size, minimum){
        this.#decklist = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
        this.#hand_size = hand_size;
        this.#min_deck_size = minimum;
    }
    /**
     * Resets the deck to the decklist then deals a new hand.
     * @returns {void}
     */
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var card of this.#decklist){
            if(card.per_floor !== undefined){
                card = card.per_floor();
                this.add_temp(card);
            }
            else{
                this.#library.push(card);
            }
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < this.#hand_size; ++i){
            var top_card = this.#library.pop();
            if(top_card !== undefined){
                this.#hand.push(top_card);
            }
        }
    }
    /**
     * Discards the card at the given position in the hand, then draws a new one.
     * @param {number} hand_pos The position of the card which should be discarded.
     */
    discard(hand_pos){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(hand_pos >= this.#hand.length || hand_pos < 0){
            throw new Error(ERRORS.invalid_value);
        }
        if(!(this.#hand[hand_pos].temp !== undefined && this.#hand[hand_pos].temp === true)){
            this.#discard_pile.push(this.#hand[hand_pos]);
        }
        if(this.#library.length === 0){
            var top_discard = this.#discard_pile.pop();
            while(top_discard !== undefined){
                this.#library.push(top_discard);
                top_discard = this.#discard_pile.pop();
            }
            this.#library = randomize_arr(this.#library);
        }
        var top_card = this.#library.pop();
        if(top_card !== undefined){
            this.#hand[hand_pos] = top_card;
        }
    }
    /**
     * Discards all cards then draws up to max hand size.
     */
    discard_all(){
        for(var card of this.#hand){
            if(this.#hand.temp === undefined || this.#hand.temp === false){
                this.#discard_pile.push(card);
            }
        }
        this.#hand = [];
        while(this.#hand.length < this.#hand_size){
            if(this.#library.length === 0){
                var top_discard = this.#discard_pile.pop();
                while(top_discard !== undefined){
                    this.#library.push(top_discard);
                    top_discard = this.#discard_pile.pop();
                }
                this.#library = randomize_arr(this.#library);
            }
            var top_card = this.#library.pop();
            if(top_card !== undefined){
                this.#hand.push(top_card);
            }
        }

        
    }
    /**
     * Adds a new card to the decklist.
     * @param {Card} new_card Card to add.
     */
    add(new_card){
        new_card.id = this.#id_count;
        this.#id_count++;
        this.#decklist.push(new_card);
        if(new_card.per_floor !== undefined){
            // If the card can only be used once per floor, add a temp copy instead.
            var temp_card = new_card.per_floor();
            this.add_temp(temp_card);
        }
        else{
            this.#library.push(new_card);
        }
        this.#library = randomize_arr(this.#library);
    }
    /**
     * Adds a new card to the library after giving it a temp tag.
     * Temp cards are removed when deal is called (at the end of the floor) or when used.
     * @param {Card} new_card Card to add.
     */
    add_temp(new_card){
        new_card.id = this.#id_count;
        new_card.temp = true;
        this.#id_count++;
        this.#library.push(new_card);
        this.#library = randomize_arr(this.#library);
    }
    /**
     * Displays the hand.
     * @param {string} table Where it should be dispalyed.
     */
    get_hand_info(){
        var make_prep_move = function(card, hand_pos){
            return function(){
                if(!GS.check_lock_player_turn()){
                    return;
                }
                display.select(UIIDS.hand_display, 0, hand_pos);
                say(``, false);
                display_move_buttons(card, hand_pos);
            }
        }
        var card_row = [];
        for(var i = 0; i < this.#hand.length; ++i){
            let card = this.#hand[i];
            let background = [];
            if(card.temp){
                background.push(`${IMG_FOLDER.other}temporary_background.png`)
            }
            else{
                background.push(`${IMG_FOLDER.other}default_card_background.png`)
            }
            card_row.push({
                pic: card.pic,
                name: card.name,
                background,
                card: card,
                on_click: make_prep_move(card, i)
            });
        }
        return card_row;
    }
    /**
     * Function to count the number of cards remaining in your library.
     * @returns {number} cards remaining.
     */
    get_deck_count(){
        return this.#library.length;
    }
    /**
     * Returns the whole decklist.
     */
    get_deck_info(){
        return [...this.#decklist];
    }
    /**
     * Displays the whole discard pile.
     */
    get_discard_info(table){
        return [...this.#discard_pile];
    }
    /**
     * Displays the cards in your draw pile in order.
     */
    get_library_info(table){
        return reverse_arr(this.#library);
    }
    /**
     * Gets a random array of cards from the decklist with no repeats.
     * If the decklist is at minimum size, returns an empty array instead.
     * @param {number} size number of cards to get.
     * @returns {Card[]} The array of random cards.
     */
    get_rand_cards(size){
        if(this.#decklist.length <= this.#min_deck_size){
            return [];
        }
        return rand_no_repeates(this.#decklist, size);
    }
    /**
     * Removes a card from the decklist.
     * @param {number} id The ID of the card to remove.
     * @returns {boolean} Returns true if the card was removed and false otherwise.
     */
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#decklist.length; ++i){
            if(this.#decklist[i].id === id){
                var card = this.#decklist[i];
                this.#decklist[i] = this.#decklist[this.#decklist.length - 1];
                this.#decklist.pop()
                if(card.evolutions !== undefined){
                    this.add(randomize_arr(card.evolutions)[0]());
                }
                return true;
            }
        }
        return false;
    }
    /**
     * @returns {number} The number of cards in the deck.
     */
    deck_size(){
        return this.#decklist.length;
    }
    /**
     * @returns {number} The minimum number of cards allowed in your deck.
     */
    deck_min(){
        return this.#min_deck_size;
    }
    /**
     * @param {number} change How much to add or remove from the minimum deck size.
     */
    alter_min(change){
        this.#min_deck_size += change;
    }
    /**
     *  @param {number} change How much to add or remove from the hand size.
     */
    alter_hand_size(change){
        this.#hand_size += change;
    }
    /**
     * Function to check if a card in the hand is an instant.
     * @param {number} hand_position The position of the card to check.
     * @returns {boolean} If it is an instant. 
     */
    is_instant(hand_position){
        if(this.#hand.length <= hand_position || hand_position < 0){
            throw new Error(ERRORS.invalid_value);
        }
        return this.#hand[hand_position].options.is_instant();
    }
}
// ----------------TagList.js----------------
// Class to contain a list of tags for true or false questions about a tile.


class TagList{
    #tags;
    constructor(list=[]){
        for(var element of list){
            if(typeof element !== `string`){
                throw new Error(ERRORS.invalid_type);
            }
        }
        this.#tags = [...list]
    }
    add(tag){
        if(!this.has(tag)){
            this.#tags.push(tag)
        }
    }
    remove(tag){
        if(typeof tag !== `string`){
            throw new Error(ERRORS.invalid_type);
        }
        var start_len = this.#tags.length;
        this.#tags = this.#tags.filter(t => t !== tag);
        return start_len > this.#tags.length;
    }
    has(tag){
        if(typeof tag !== `string`){
            throw new Error(ERRORS.invalid_type);
        }
        return this.#tags.indexOf(tag) !== -1;
    }

}
/** @type {AreaGenerator}*/
function generate_basement_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}basement.png`,
        generate_floor: generate_basement_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, scythe_tile, 
                    spider_web_tile, clay_golem_tile, rat_tile, shadow_knight_tile, brightling_tile],
        boss_floor_list: [spider_queen_floor],
        next_area_list: area3,
        description: basement_description
    }
}

/** @type {FloorGenerator}*/
function generate_basement_floor(floor_num, area, map){
    wall_terrain(floor_num, area, map)
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function wall_terrain(floor_num, area, map){
    var wall_amount = Math.min(random_num(8), random_num(8));
    for(var i = 0; i < wall_amount; ++i){
        map.spawn_safely(damaged_wall_tile(), SAFE_SPAWN_ATTEMPTS, false)
        map.spawn_safely(wall_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
}
/** @type {AreaGenerator}*/
function generate_crypt_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}crypt.png`,
        generate_floor: generate_crypt_floor,
        enemy_list: [shadow_knight_tile, vampire_tile, clay_golem_tile, turret_r_tile, shadow_scout_tile, 
                    darkling_tile, orb_of_insanity_tile],
        boss_floor_list: [lich_floor],
        next_area_list: area4,
        description: crypt_description
    }
}

/** @type {FloorGenerator}*/
function generate_crypt_floor(floor_num, area, map){
    coffin_terrain(floor_num, area, map);
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function coffin_terrain(floor_num, area, map){
    var coffin_amount = Math.min(random_num(4), random_num(4));
    for(var i = 0; i < coffin_amount; ++i){
        map.spawn_safely(coffin_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
}
/** @type {AreaGenerator}*/
function generate_forest_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}forest.png`,
        generate_floor: generate_forest_floor,
        enemy_list: [vinesnare_bush_tile, carrion_flies_tile, ram_tile, swaying_nettle_tile, living_tree_tile, 
                    scythe_tile, scorpion_tile, thorn_bush_tile],
        boss_floor_list: [forest_heart_floor],
        next_area_list: area5,
        description: forest_description
    }
}

/** @type {FloorGenerator}*/
function generate_forest_floor(floor_num, area, map){
    if(random_num(16) === 0 && floor_num % AREA_SIZE !== CHEST_LOCATION){
        swaying_nettle_terrain(floor_num, area, map);
        generate_normal_floor(floor_num / 2, area, map);
    }
    else{
        enticing_fruit_tree_terrain(floor_num, area, map);
        generate_normal_floor(floor_num, area, map);
    }
}
/** @type {FloorGenerator}*/
function enticing_fruit_tree_terrain(floor_num, area, map){
    if(random_num(5) > 2){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

/** @type {FloorGenerator}*/
function swaying_nettle_terrain(floor_num, area, map){
    var amount = 15 + random_num(8);
    for(var i = 0; i < amount; ++i){
        map.spawn_safely(swaying_nettle_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {AreaGenerator}*/
function generate_magma_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}magma.png`,
        generate_floor: generate_magma_floor,
        enemy_list: [magma_spewer_tile, turret_r_tile, brightling_tile, igneous_crab_tile, strider_tile,
                    pheonix_tile],
        boss_floor_list: [young_dragon_floor],
        next_area_list: area4,
        description: magma_description
    }
}
/** @type {FloorGenerator}*/
function generate_magma_floor(floor_num, area, map){
    if(random_num(4) === 0){
        magma_border_terrain(floor_num, area, map);
    }
    else{
        magma_terrain(floor_num, area, map);
    }
    repulsor_terrain(floor_num, area, map);
    boulder_terrain(floor_num, area, map)
    generate_normal_floor(floor_num - 3, area, map);
}
/** @type {FloorGenerator}*/
function magma_border_terrain(floor_num, area, map){
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        try{map.add_tile(lava_pool_tile(), new Point(x, 0))}
        catch{}
    }
    for(var y = 0; y < FLOOR_HEIGHT; ++y){
        try{map.add_tile(lava_pool_tile(), new Point(0, y))}
        catch{}
        try{map.add_tile(lava_pool_tile(), new Point(FLOOR_WIDTH - 1, y))}
        catch{}
    }
}
/** @type {FloorGenerator}*/
function magma_terrain(floor_num, area, map){
    var magma_amount = random_num(20) + 5;
    for(var i = 0; i < magma_amount; ++i){
        map.spawn_safely(lava_pool_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
}
/** @type {FloorGenerator}*/
function repulsor_terrain(floor_num, area, map){
    var repulsor_amount = 0;
    for(var i = 0; i < 3; ++i){
        if(random_num(4) === 0){
            ++repulsor_amount;
        }
    }
    for(var i = 0; i < repulsor_amount; ++i){
        map.spawn_safely(repulsor_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
}
/** @type {FloorGenerator}*/
function boulder_terrain(floor_num, area, map){
    var boulder_amount = random_num(6) - 2;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(magmatic_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
    boulder_amount = random_num(6) - 2;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(boulder_elemental_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }

}
/** @type {AreaGenerator}*/
function generate_ruins_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}ruins.png`,
        generate_floor: generate_ruins_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, vinesnare_bush_tile, 
                    ram_tile, rat_tile, shadow_knight_tile],
        boss_floor_list: [velociphile_floor],
        next_area_list: area2,
        description: ruins_description
    }
}

/** @type {FloorGenerator}*/
function generate_ruins_floor(floor_num, area, map){
    // gives a little extra difficulty since it's the first area and there isn't any terrain.
    generate_normal_floor(floor_num + 1, area, map);
}
/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_h_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, 
                    corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile, carrion_flies_tile],
        boss_floor_list: [two_headed_serpent_floor],
        next_area_list: area3,
        description: sewers_description
    }
}

/** @type {FloorGenerator}*/
function generate_sewers_floor(floor_num, area, map){
    var terrains = [slime_terrain, grate_terrain];
    terrains[random_num(terrains.length)](floor_num, area, map);
    generate_normal_floor(floor_num, area, map);
}

/** @type {FloorGenerator}*/
function slime_terrain(floor_num, area, map){
    var slime_amount = random_num(4);
    for(var i = 0; i < slime_amount; ++i){
        map.spawn_safely(corrosive_slime_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function grate_terrain(floor_num, area, map){
    var grate_amount = random_num(3);
    for(var i = 0; i < grate_amount; ++i){
        map.spawn_safely(sewer_grate_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
// ----------------Areas.js----------------
// File containing functions used by areas.

// The structure of the dungeon. Each area can lead to a random one in the next numbered array.
const area_end = [generate_default_area]; // Once they have finished the completed areas, they go here.
const area1 = STARTING_AREA;
const area2 = [generate_sewers_area, generate_basement_area];
const area3 = [generate_magma_area, generate_crypt_area];
const area4 = [generate_forest_area];//, generate_library_area];
const area5 = area_end;//[generate_sanctum_area];

/**
 * @typedef {Object} Area A section of the dungeon that ends with a boss fight.
 * @property {string} background The picture used as a background for this area.
 * @property {FloorGenerator} generate_floor A function to generate a normal floor of the dungeon.
 * @property {TileGenerator[]} enemy_list An array of which enemies can spawn here.
 * @property {FloorGenerator[]} boss_floor_list An array of functions that can create a boss floor at the end of the area.
 * @property {AreaGenerator[]} next_area_list An array of the areas that can follow this one.
 * @property {string} description A description given when entering this area.
 */

/**
 * @callback AreaGenerator A function to create 
 * @returns {Area}         and return an area object.
 */

// ---Unfinished Areas---

/** @type {AreaGenerator}*/
function generate_library_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}library.png`,
        generate_floor: generate_library_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area5,
        description: ruins_description
    }
}
/** @type {AreaGenerator}*/
function generate_sanctum_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}sanctum.png`,
        generate_floor: generate_sanctum_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: sanctum_description
    }
}

/** @type {AreaGenerator}*/
function generate_default_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}default.png`,
        generate_floor: floor_generator,
        enemy_list: ENEMY_LIST,
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: default_area_description
    }
}
/** @type {FloorGenerator} Generates the floor where the Forest Heart appears.*/
function forest_heart_floor(floor_num,  area, map){
    var mid_width = Math.floor(FLOOR_WIDTH / 2) - 1;
    var mid_height = Math.floor(FLOOR_HEIGHT / 2) - 1;

    var locations = [
        new Point(mid_width, mid_height),
        new Point(mid_width + 1, mid_height),
        new Point(mid_width + 1, mid_height + 1),
        new Point(mid_width, mid_height + 1),
    ]
    var sections = [
        [undefined, new Point(1, 0)],
        [new Point(-1, 0), new Point(0, 1)],
        [new Point(0, -1), new Point(-1, 0)],
        [new Point(1, 0), undefined]
    ]
    for(var i = 0; i < locations.length; ++i){
        var section = forest_heart_tile();
        if(i !== 0){
            section.behavior = undefined;
            section.tags.add(TAGS.hidden);
        }
        section.rotate = 90 * i;
        section.segment_list = sections[i];
        map.add_tile(section, locations[i]);
    }
    map.add_tile(living_tree_rooted_tile(), new Point(mid_width - 1, mid_height));
    map.add_tile(living_tree_rooted_tile(), new Point(mid_width + 2, mid_height));
    map.add_tile(vinesnare_bush_tile(), new Point(mid_width - 2, mid_height));
    map.add_tile(vinesnare_bush_tile(), new Point(mid_width + 3, mid_height));
    return forest_heart_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Lich appears.*/
function lich_floor(floor_num,  area, map){
    var locations = [
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2),
        new Point(1, FLOOR_HEIGHT - 2),
        new Point(FLOOR_WIDTH - 2, 1),
        new Point(1, 1)
    ]
    for(var location of locations){
        map.add_tile(damaged_wall_tile(), location);
    }
    map.spawn_safely(lich_tile(), SAFE_SPAWN_ATTEMPTS, true);
    return lich_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Spider Queen appears.*/
function spider_queen_floor(floor_num, area, map){
    map.spawn_safely(spider_queen_tile(), SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 4; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    return spider_queen_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Two Headed Serpent appears.*/
function two_headed_serpent_floor(floor_num, area, map){
    var serpent_length = 8;
    if(GS.boons.has(boon_names.boss_slayer)){
        serpent_length -= 2;
    }
    var finished = false;
    // Finds enough adjacent empty spaces to spawn the serpent in.
    do{
        finished = true;
        var locations = [];
        var current = map.random_empty();
        if(current.y >= 2){
            finished = false;
        }
        var position = current.copy();
        var dirs = [new Point(random_sign(), 0), new Point(0, random_sign())];
        for(var i = 1; i < serpent_length; ++i){
            var next = rand_no_repeates(dirs, 1)[0];
            position.plus_equals(next);
            if(map.check_empty(position)){
                locations.push(next);
            }
            else{
                finished = false;
            }
        }
    }while(!finished)
    // Add sleeping head.
    var head = two_headed_serpent_tile();
    if(head.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    head.segment_list[0] = locations[0].copy();
    serpent_rotate(head);
    map.add_tile(head, current);
    var start = current.copy();
    // Add body segments.
    for(var i = 0; i < locations.length - 1; ++i){
        var segment = two_headed_serpent_body_tile();
        if(segment.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        segment.segment_list[0] = locations[i + 1];
        segment.segment_list[1] = locations[i].times(-1);
        serpent_rotate(segment);
        current.plus_equals(locations[i]);
        map.add_tile(segment, current);
    }
    // Add awake head.
    var tail = two_headed_serpent_tile();
    if(tail.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    tail.segment_list[1] = locations[locations.length - 1].times(-1);
    serpent_rotate(tail);
    current.plus_equals(locations[locations.length - 1]);
    map.add_tile(tail, current);
    serpent_wake({tile: head, location: start}, map);
    // Add terrain.
    for(var i = 0; i < 8; ++i){
        var position = map.random_empty();
        map.add_tile(wall_tile(), position);
        map.add_tile(damaged_wall_tile(), position.plus(rand_no_repeates(ALL_DIRECTIONS, 1)[0]));
    }
    return two_headed_serpent_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Velociphile appears.*/
function velociphile_floor(floor_num,  area, map){
    map.spawn_safely(velociphile_tile(), SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return velociphile_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Young Dragon appears.*/
function young_dragon_floor(floor_num,  area, map){
    map.spawn_safely(young_dragon_tile(), SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 22; ++i){
        map.add_tile(lava_pool_tile());
    }
    return young_dragon_floor_message;
}
// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor, spider_queen_floor, lich_floor];

/**
 * @callback FloorGenerator Function to populate a floor.
 * @param {number} floor_number How many floors have they entered. Used to determine the combined difficulty of spawned enemies.
 * @param {Area} area Which area of the dungeon are we in.
 * @param {GameMap} map The gamemap which holds the floor.
 */
/** @type {FloorGenerator} The generator ONLY used by the default area if they have finished all the content.*/
function floor_generator(floor_num, area, map){
    if(!(floor_num % AREA_SIZE === 0) || Math.floor(floor_num / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / AREA_SIZE) - 1](floor_num, area, map);
    }
}
/** @type {FloorGenerator} The standard generator to add random enemies from the area whose combined difficulty scales based on the floor number.*/
function generate_normal_floor(floor_num, area, map){
    var enemy_list = area.enemy_list;
    for(var i = floor_num * 2; i > 0;){
        var choice = random_num(enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty !== undefined){
            var spawned = map.spawn_safely(new_enemy, SAFE_SPAWN_ATTEMPTS, false);
            if(spawned !== undefined){
                i -= new_enemy.difficulty;
                for(var j = 0; j < 2 * GS.boons.has(boon_names.stealthy); ++j){
                    map.stun_tile(spawned);
                }
            }
            else{
                --i;
            }
        }
    }
    if(GS.boons.has(boon_names.frugivore) > random_num(2)){
        var spawned = map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

function boss_floor_common(floor_num,  area, map){
    if(GS.boons.has(boon_names.pacifism) === 0){
        map.lock();
    }
}

/** @type {FloorGenerator}*/
function generate_library_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}

/** @type {FloorGenerator}*/
function generate_sanctum_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}



/** @type {CardGenerator}*/
function lost_technique(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: `lost technique`,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        options,
        evolutions: [chipped_split_second, chipped_execution, chipped_superweapon]
    }
}

/** @type {CardGenerator}*/
function chipped_split_second(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    options.add_button(SPIN, spin);
    return{
        name: `chipped split second`,
        pic: `${IMG_FOLDER.cards}chipped_split_second.png`,
        options,
        evolutions: [split_second]
    }
}

/** @type {CardGenerator}*/
function split_second(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1)
    ];
    options.add_button(SPIN, spin);
    options.make_instant();
    return{
        name: `split second`,
        pic: `${IMG_FOLDER.cards}split_second.png`,
        options
    }
}

/** @type {CardGenerator}*/
function chipped_execution(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    options.add_button(SPIN, spin);
    return{
        name: `chipped execution`,
        pic: `${IMG_FOLDER.cards}chipped_execution.png`,
        options,
        evolutions: [unpolished_execution]
    }
}

/** @type {CardGenerator}*/
function unpolished_execution(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    spin = [...spin, ...spin];
    options.add_button(SPIN, spin);
    return{
        name: `unpolished execution`,
        pic: `${IMG_FOLDER.cards}unpolished_execution.png`,
        options,
        evolutions: [execution]
    }
}

/** @type {CardGenerator}*/
function execution(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    spin = [...spin, ...spin, ...spin];
    options.add_button(SPIN, spin);
    return{
        name: `execution`,
        pic: `${IMG_FOLDER.cards}execution.png`,
        options
    }
}

/** @type {CardGenerator}*/
function chipped_superweapon(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    options.add_button(SPIN, spin);
    return{
        name: `chipped superweapon`,
        pic: `${IMG_FOLDER.cards}chipped_superweapon.png`,
        options
    }
}

/** @type {CardGenerator}*/
function superweapon(){
    var options = new ButtonGrid();
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            if(i !== 0 || j !== 0){
                area.push(pattack(i, j));
            }
        }
    }
    options.add_button(SPIN, area);
    return{
        name: `superweapon`,
        pic: `${IMG_FOLDER.cards}superweapon.png`,
        options
    }
}
// ----------------two_headed_serpent_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the forest heart.

/** @type {CardGenerator} Dropped by the forest heart*/
function snack(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0), pstun(0, 0)]);
    options.make_instant();
    return{
        name: `snack`,
        pic: `${IMG_FOLDER.cards}snack.png`,
        options,
        per_floor: snack
    }
}

/** @type {CardGenerator} Dropped by the forest heart*/
function branch_strike(){
    var options = new ButtonGrid();
    var targets = get_2_away().map(p => {
        return pattack(p.x, p.y);
    });
    options.add_button(SPIN, targets);
    return{
        name: `branch strike`,
        pic: `${IMG_FOLDER.cards}branch_strike.png`,
        options
    }
}
// ----------------lich_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the lich.

/** @type {CardGenerator} Dropped by the lich*/
function instant_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    options.make_instant();
    return{
        name: `instant teleport`,
        pic: `${IMG_FOLDER.cards}instant_teleport.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the lich*/
function debilitating_confusion(){
    var options = new ButtonGrid();
    var spin = [pstun(1, 1),
                pstun(1, 0),
                pstun(1, -1),
                pstun(0, 1),
                pstun(0, -1),
                pstun(-1, 1),
                pstun(-1, 0),
                pstun(-1, -1)];
    options.add_button(SPIN, spin.concat(spin));
    return{
        name: `debilitating confusion`,
        pic: `${IMG_FOLDER.cards}debilitating_confusion.png`,
        options
    }
}
// ----------------spider_queen_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the spider queen.

/** @type {CardGenerator} Dropped by the spider queen*/
function bite(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0)]);
    options.add_button(NE, [pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1)]);
    options.make_instant();
    return{
        name: `bite`,
        pic: `${IMG_FOLDER.cards}bite.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the spider queen*/
function skitter(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `skitter`,
        pic: `${IMG_FOLDER.cards}skitter.png`,
        options
    }
}
// ----------------two_headed_serpent_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the two headed serpent.

/** @type {CardGenerator} Dropped by the two headed serpent*/
function regenerate(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0)]);
    return{
        name: `regenerate`,
        pic: `${IMG_FOLDER.cards}regenerate.png`,
        options,
        per_floor: regenerate
    }
}

/** @type {CardGenerator} Dropped by the two headed serpent*/
function fangs(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `fangs`,
        pic: `${IMG_FOLDER.cards}fangs.png`,
        options
    }
}
// ----------------velociphile_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the velociphile.

/** @type {CardGenerator} Dropped by the velociphile*/
function roll_nesw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove_until(1, -1), pattack(1, -1)]);
    options.add_button(SW, [pmove_until(-1, 1), pattack(-1, 1)]);
    return{
        name: `roll NE SW`,
        pic: `${IMG_FOLDER.cards}roll_nesw.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the velociphile*/
function roll_nwse(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove_until(1, 1), pattack(1, 1)]);
    options.add_button(NW, [pmove_until(-1, -1), pattack(-1, -1)]);
    return{
        name: `roll NW SE`,
        pic: `${IMG_FOLDER.cards}roll_nwse.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the velociphile*/
function roll_ew(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove_until(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove_until(-1, 0), pattack(-1, 0)]);
    return{
        name: `roll E W`,
        pic: `${IMG_FOLDER.cards}roll_ew.png`,
        options
    }
}
// ----------------young_dragon_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the young dragon.

/** @type {CardGenerator}*/
function firebreathing_horizontal(){
    var options = new ButtonGrid();

    var e_cone_points = create_orthogonal_cone(90, 3);
    var e_cone = e_cone_points.map((p) => pattack(p.x, p.y));
    var w_cone_points = create_orthogonal_cone(270, 3);
    var w_cone = w_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(E, e_cone);
    options.add_button(W, w_cone);
    return{
        name: `firebreathing horizontal`,
        pic: `${IMG_FOLDER.cards}firebreathing_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_vertical(){
    var options = new ButtonGrid();

    var n_cone_points = create_orthogonal_cone(0, 3);
    var n_cone = n_cone_points.map((p) => pattack(p.x, p.y));
    var s_cone_points = create_orthogonal_cone(180, 3);
    var s_cone = s_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(N, n_cone);
    options.add_button(S, s_cone);
    return{
        name: `firebreathing vertical`,
        pic: `${IMG_FOLDER.cards}firebreathing_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_ne(){
    var options = new ButtonGrid();

    var ne_cone_points = create_diagonal_cone(90, 3);
    var ne_cone = ne_cone_points.map((p) => pattack(p.x, p.y));
    var sw_cone_points = create_diagonal_cone(270, 3);
    var sw_cone = sw_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(NE, ne_cone);
    options.add_button(SW, sw_cone);
    return{
        name: `firebreathing ne`,
        pic: `${IMG_FOLDER.cards}firebreathing_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_nw(){
    var options = new ButtonGrid();

    var nw_cone_points = create_diagonal_cone(0, 3);
    var nw_cone = nw_cone_points.map((p) => pattack(p.x, p.y));
    var se_cone_points = create_diagonal_cone(180, 3);
    var se_cone = se_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(NW, nw_cone);
    options.add_button(SE, se_cone);
    return{
        name: `firebreathing nw`,
        pic: `${IMG_FOLDER.cards}firebreathing_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function glide(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(E, [pmove(3, 0)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    options.add_button(W, [pmove(-3, 0)]);
    options.add_button(SW, [pmove(-2, 1)]);
    return{
        name: `glide`,
        pic: `${IMG_FOLDER.cards}glide.png`,
        options
    }
}
/** @type {CardGenerator}*/
function soar(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(3, -1)]);
    options.add_button(SE, [pmove(3, 1)]);
    options.add_button(NW, [pmove(-3, -1)]);
    options.add_button(SW, [pmove(-3, 1)]);
    return{
        name: `soar`,
        pic: `${IMG_FOLDER.cards}soar.png`,
        options
    }
}

// ----------------CardUtils.js----------------
// File containing utility functions used by cards.

const BASIC_CARDS = [
    basic_horizontal, basic_diagonal, basic_slice
]

// Cards that can be given on level up.
const COMMON_CARDS = [
    short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, spin_attack, butterfly, fork,
    retreat, force, side_attack, clear_behind, clear_in_front, 
    jab, overcome, hit_and_run, push_back, breakthrough_side,
    explosion, breakthrough, flanking_diagonal, flanking_sideways, flanking_straight,
    pike, combat_diagonal, combat_horizontal, stunning_punch_orthogonal, stunning_punch_diagonal,
    thwack, overcome_sideways, y_leap, diamond_slice, spearhead,
    alt_diagonal_left, alt_diagonal_right, alt_horizontal, alt_vertical, jab_diagonal,
    diamond_attack, slice_twice, advance, dash_ne, dash_nw,
    bounding_retreat, leap_left, leap_right, short_charge_diagonal, side_sprint,
    slash_step_forwards, slash_step_left, slash_step_right, slip_through_ne, slip_through_nw,
    stunning_leap, stunning_side_leap, stunning_slice,
];

const RARE_CARDS = [
    teleport, sidestep_w, sidestep_e, sidestep_n, sidestep_s, 
    sidestep_nw, sidestep_ne, sidestep_se, sidestep_sw, punch_orthogonal, 
    punch_diagonal, reckless_attack_left, reckless_attack_right, reckless_sprint, reckless_teleport,
    reckless_horizontal, reckless_diagonal, 
]

// Cards that can be given as a debuff.
const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out,
    lightheaded
]


/**
 * @typedef {Object} PlayerCommand A object used to give a command for a single action the player should do.
 * @property {string} type What type of action it is (move, attack, etc.).
 * @property {Point} change The location the action should be performed at relative to the current one.
 */

/**
 * @callback PlayerCommandGenerator Creates a PlayerCommand Object.
 * @param {number} x The relative x location
 * @param {number} y The relative y location
 * @returns {PlayerCommand} The resulting command.
 */

/** @type {PlayerCommandGenerator} Function to create a move command.*/
function pmove(x, y){
    return {
        type: `move`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a attack command.*/
function pattack(x, y){
    return {
        type: `attack`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a teleport command.*/
function pteleport(x, y){
    return {
        type: `teleport`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to stun any enemies at the given location.*/
function pstun(x, y){
    return {
        type: `stun`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to move in a direction until you hit something.*/
function pmove_until(x, y){
    return {
        type: `move_until`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to heal the thing at the specified spot by 1.*/
function pheal(x, y){
    return {
        type: `heal`,
        change: new Point(x, y)
    }
}

// Cards
/**
 * @typedef {Object} Card A card used by the player to perform actions on their turn.
 * @property {string} name The name of the card which will be displayed as mouseover text.
 * @property {string} pic The card's image.
 * @property {ButtonGrid} options A button grid object which determines what actions the player can use the card to perform.
 * @property {CardGenerator[]=} evolutions A list of cards to be added once this is removed.
 * 
 * @property {number=} id A unique id that will be added to the card when it is added to the deck.
 * @property {boolean=} temp Given true when the card is temporary and will be removed on use or on end of floor.
 * @property {CardGenerator=} per_floor Provided to make temporary copies of a card if it can only be used once per floor.
 */
/**
 * @callback CardGenerator A function that creates a card.
 * @returns {Card} The resulting card.
 */



/**
 * Function to explain an individual player action.
 * @param {PlayerCommand} action The command to explain.
 * @returns {String} An explanation for the player of what the action does.
 */
function explain_action(action){
    var target = explain_point(action.change);
    switch(action.type){
        case `attack`:
            return `${move_types.attack}: ${target}`;
        case `move`:
            return `${move_types.move}: ${target}`;
        case `teleport`:
            return move_types.teleport;
        case `stun`:
            if(point_equals(action.change, new Point(0, 0))){
                return move_types.confuse;
            }
            return `${move_types.stun}: ${target}`
        case `move_until`:
            return `${move_types.move_until}: ${target}`
        case `heal`:
            return `${move_types.heal}: ${target}`;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * Converts a point to an explanation of where it is relative to the player.
 * @param {Point} p The point to explain.
 * @returns {String} The location of the point explained in relation to the player.
 */
function explain_point(p){
    var direction = sign(p);
    var vertical = [four_directions.up, undefined, four_directions.down][direction.y + 1];
    var horizontal = [four_directions.left, undefined, four_directions.right][direction.x + 1];
    if(vertical === undefined && horizontal === undefined){
        return move_types.you;
    }
    else if(vertical === undefined){
        return `${horizontal} ${Math.abs(p.x)}`;
    }
    else if(horizontal === undefined){
        return `${vertical} ${Math.abs(p.y)}`;
    }
    else{
        return `${horizontal} ${Math.abs(p.x)}, ${vertical} ${Math.abs(p.y)}`;
    }
}

/**
 * 
 */
function telegraph_card(behavior, map){
    var start_position = map.get_player_location(); 
    var telegraphs = {
        moves: [],
        attacks: [],
        stun: [],
        healing: [],
        teleport: []
    }
    if(behavior === undefined){
        return telegraphs;
    }
    for(var action of behavior){
        var next_position = start_position.plus(action.change);
        switch(action.type){
            case `attack`:
                telegraphs.attacks.push(next_position);
                break;
            case `move`:
                if(map.looks_movable(next_position)){
                    telegraphs.moves.push(next_position);
                }
                if(map.looks_empty(next_position)){
                    start_position = next_position;
                }
                break;
            case `teleport`:
                for(var p of get_all_points()){
                    if(map.looks_empty(p)){
                        telegraphs.teleport.push(p);
                    }
                }
                break;
            case `stun`:
                telegraphs.stun.push(next_position);
                break;
            case `move_until`:
                while(map.looks_empty(next_position)){
                    telegraphs.moves.push(next_position);
                    start_position = next_position;
                    next_position = start_position.plus(action.change);
                }
                if(map.looks_movable(next_position)){
                    telegraphs.moves.push(next_position);
                }
                break;
            case `heal`:
                telegraphs.healing.push(next_position);
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
    }
    return telegraphs;
}
function get_all_points(){
    var points = [];
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        for(var y = 0; y < FLOOR_HEIGHT; ++y){
            points.push(new Point(x, y));
        }
    }
    return points;
}

function get_boss_cards(){
    var boss_cards = [];
    for(var boss of BOSS_LIST){
        boss_cards = [...boss_cards, ...boss().card_drops];
    }
    return boss_cards;
}
// ----------------ConfusionCards.js----------------
// File containing cards that can be given to the player as a debuff.

/** @type {CardGenerator}*/
function stumble_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `stumble west`,
        pic: `${IMG_FOLDER.cards}stumble_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    return{
        name: `stumble east`,
        pic: `${IMG_FOLDER.cards}stumble_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    return{
        name: `stumble north`,
        pic: `${IMG_FOLDER.cards}stumble_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: `stumble south`,
        pic: `${IMG_FOLDER.cards}stumble_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `stumble nw`,
        pic: `${IMG_FOLDER.cards}stumble_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: `stumble ne`,
        pic: `${IMG_FOLDER.cards}stumble_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    return{
        name: `stumble se`,
        pic: `${IMG_FOLDER.cards}stumble_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `stumble sw`,
        pic: `${IMG_FOLDER.cards}stumble_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function freeze_up(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: `freeze up`,
        pic: `${IMG_FOLDER.cards}freeze_up.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lash_out(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, 0),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)]
    options.add_button(SPIN, spin, 5);
    return{
        name: `lash out`,
        pic: `${IMG_FOLDER.cards}lash_out.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lightheaded(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0)], 5);
    options.make_instant();
    return{
        name: `lightheaded`,
        pic: `${IMG_FOLDER.cards}lightheaded.png`,
        options
    }
}


// ----------------NormalCards.js----------------
// File containing both basic cards and all cards that can be gained from the shop.

// basic_horizontal,  basic_diagonal, and basic_slice are unique to the starting deck.
/** @type {CardGenerator}*/
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `basic horizontal`,
        pic: `${IMG_FOLDER.cards}basic_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `basic diagonal`,
        pic: `${IMG_FOLDER.cards}basic_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function basic_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1)]);
    return{
        name: `basic slice`,
        pic: `${IMG_FOLDER.cards}basic_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function short_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: `short charge`,
        pic: `${IMG_FOLDER.cards}short_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: `jump`,
        pic: `${IMG_FOLDER.cards}jump.png`,
        options
    }
}

/** @type {CardGenerator}*/
function straight_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pattack(0, 1)]);
    return{
        name: `straight charge`,
        pic: `${IMG_FOLDER.cards}straight_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_charge(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: `side charge`,
        pic: `${IMG_FOLDER.cards}side_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `step left`,
        pic: `${IMG_FOLDER.cards}step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: `step right`,
        pic: `${IMG_FOLDER.cards}step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -2), pmove(1, -2)]);
    options.add_button(NW, [pattack(-1, -2), pmove(-1, -2)]);
    options.add_button(S, [pattack(0, 2), pmove(0, 2)]);
    return{
        name: `trample`,
        pic: `${IMG_FOLDER.cards}trample.png`,
        options
    }
}
/** @type {CardGenerator}*/
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    return{
        name: `horsemanship`,
        pic: `${IMG_FOLDER.cards}horsemanship.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: `lunge left`,
        pic: `${IMG_FOLDER.cards}lunge_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1), pmove(-1, 1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1), pattack(1, -1)]);
    return{
        name: `lunge right`,
        pic: `${IMG_FOLDER.cards}lunge_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    return{
        name: `sprint`,
        pic: `${IMG_FOLDER.cards}sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(2, 1), pattack(2, 0), pattack(2, -1)]);
    options.add_button(W, [pattack(-2, 1), pattack(-2, 0), pattack(-2, -1)]);
    options.add_button(S, [pattack(1, 2), pattack(0, 2), pattack(-1, 2)]);
    return{
        name: `trident`,
        pic: `${IMG_FOLDER.cards}trident.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spin_attack(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(SPIN, spin);
    return{
        name: `spin attack`,
        pic: `${IMG_FOLDER.cards}spin_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: `butterfly`,
        pic: `${IMG_FOLDER.cards}butterfly.png`,
        options
    }
}
/** @type {CardGenerator}*/
function retreat(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `retreat`,
        pic: `${IMG_FOLDER.cards}retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1), pattack(0, -1), pmove(0, -1)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1), pattack(0, 1), pmove(0, 1)]);
    return{
        name: `force`,
        pic: `${IMG_FOLDER.cards}force.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_attack(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(3, 0)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-3, 0)]);
    return{
        name: `side attack`,
        pic: `${IMG_FOLDER.cards}side_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(2, 1), pattack(1, 1), pattack(0, 1), pattack(-1, 1), pattack(-2, 1), 
                           pattack(2, 2), pattack(1, 2), pattack(0, 2), pattack(-1, 2), pattack(-2, 2)]);
    return{
        name: `clear behind`,
        pic: `${IMG_FOLDER.cards}clear_behind.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_in_front(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), 
                           pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    return{
        name: `clear in front`,
        pic: `${IMG_FOLDER.cards}clear_in_front.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -2), pattack(0, -1), pattack(0, -2)]);
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(1, 0), pattack(2, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 2), pattack(0, 1), pattack(0, 2)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-1, 0), pattack(-2, 0)]);
    return{
        name: `jab`,
        pic: `${IMG_FOLDER.cards}jab.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pmove(0, -2)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1), pmove(0, 2)]);
    return{
        name: `overcome`,
        pic: `${IMG_FOLDER.cards}overcome.png`,
        options
    }
}
/** @type {CardGenerator}*/
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0), pmove(0, 1)]);
    return{
        name: `hit and run`,
        pic: `${IMG_FOLDER.cards}hit_and_run.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1), pmove(-1, -1)]);
    return{
        name: `combat diagonal`,
        pic: `${IMG_FOLDER.cards}combat_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1)]);
    options.add_button(E, [pattack(1, 0), pmove(1, 0)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pmove(-1, 0)]);
    return{
        name: `combat horizontal`,
        pic: `${IMG_FOLDER.cards}combat_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack(-1, -1), pmove(1, 1)]);
    options.add_button(S, [pattack(0, -1), pmove(0, 1)]);
    options.add_button(SW, [pattack(1, -1), pmove(-1, 1)]);
    return{
        name: `push back`,
        pic: `${IMG_FOLDER.cards}push_back.png`,
        options
    }
}
/** @type {CardGenerator}*/
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(-1, -1), pattack(1, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(1, 1), pattack(1, -1), pattack(2, 1), pattack(2, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(-1, 1), pattack(1, 2), pattack(-1, 2)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, -1), pattack(-2, 1), pattack(-2, -1)]);
    return{
        name: `fork`,
        pic: `${IMG_FOLDER.cards}fork.png`,
        options
    }
}
/** @type {CardGenerator}*/
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(pattack(i, j));
        }
    }
    var options = new ButtonGrid();
    options.add_button(SPIN, area, 5);
    return{
        name: `explosion`,
        pic: `${IMG_FOLDER.cards}explosion.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    return{
        name: `breakthrough`,
        pic: `${IMG_FOLDER.cards}breakthrough.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(0, 1), pattack(-1, 0), pmove(1, -1), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1), pattack(0, 1), pattack(1, 0), pmove(-1, -1), pattack(0, 1), pattack(1, 0)]);
    return{
        name: `flanking diagonal`,
        pic: `${IMG_FOLDER.cards}flanking_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(0, 1), pattack(0, -1), pmove(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(0, 1), pattack(0, -1), pmove(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `flanking sideways`,
        pic: `${IMG_FOLDER.cards}flanking_sideways.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_straight(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pmove(0, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pmove(0, 1), pattack(1, 0), pattack(-1, 0)]);
    return{
        name: `flanking straight`,
        pic: `${IMG_FOLDER.cards}flanking_straight.png`,
        options
    }
}
/** @type {CardGenerator}*/
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -2), pattack(1, -3), pattack(0, -3), pattack(-1, -3)]);
    options.add_button(E, [pattack(2, 0), pattack(3, 1), pattack(3, 0), pattack(3, -1)]);
    options.add_button(W, [pattack(-2, 0), pattack(-3, 1), pattack(-3, 0), pattack(-3, -1)]);
    options.add_button(S, [pattack(0, 2), pattack(1, 3), pattack(0, 3), pattack(-1, 3)]);

    return{
        name: `pike`,
        pic: `${IMG_FOLDER.cards}pike.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough_side(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `breakthrough side`,
        pic: `${IMG_FOLDER.cards}breakthrough_side.png`,
        options
    }
}
/** @type {CardGenerator}*/
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1), pattack(0, -1)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1), pattack(0, 1)]);
    return{
        name: `thwack`,
        pic: `${IMG_FOLDER.cards}thwack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1), pmove(2, 0)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1), pmove(-2, 0)]);
    return{
        name: `overcome sideways`,
        pic: `${IMG_FOLDER.cards}overcome_sideways.png`,
        options
    }
}
/** @type {CardGenerator}*/
function y_leap(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(S, [pmove(0, 2)]);
    return{
        name: `Y leap`,
        pic: `${IMG_FOLDER.cards}y_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_slice(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(2, 0),
                pattack(1, -1),
                pattack(0, 2),
                pattack(0, -2),
                pattack(-1, 1),
                pattack(-2, 0),
                pattack(-1, -1)]
    options.add_button(SPIN, spin);
    return{
        name: `diamond slice`,
        pic: `${IMG_FOLDER.cards}diamond_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    return{
        name: `spearhead`,
        pic: `${IMG_FOLDER.cards}spearhead.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_diagonal_left(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, 0), pattack(1, -1), pattack(2, -2), pattack(0, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 0), pattack(-1, 1), pattack(-2, 2), pattack(0, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `alternating diagonal left`,
        pic: `${IMG_FOLDER.cards}alt_diagonal_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_diagonal_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 0), pattack(1, 1), pattack(2, 2), pattack(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, 0), pattack(-1, -1), pattack(-2, -2), pattack(0, -1)]);
    return{
        name: `alternating diagonal right`,
        pic: `${IMG_FOLDER.cards}alt_diagonal_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(0, -2), pattack(-1, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(0, 2), pattack(-1, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `alternating horizontal`,
        pic: `${IMG_FOLDER.cards}alt_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(2, 0), pattack(1, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-2, 0), pattack(-1, -1)]);
    return{
        name: `alternating vertical`,
        pic: `${IMG_FOLDER.cards}alt_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pattack(2, -2), pattack(1, -1), pattack(2, -2)]);
    options.add_button(SE, [pattack(1, 1), pattack(2, 2), pattack(1, 1), pattack(2, 2)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-2, 2), pattack(-1, 1), pattack(-2, 2)]);
    options.add_button(NW, [pattack(-1, -1), pattack(-2, -2), pattack(-1, -1), pattack(-2, -2)]);
    return{
        name: `jab_diagonal`,
        pic: `${IMG_FOLDER.cards}jab_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_attack(){
    var options = new ButtonGrid();
    options.add_button(SPIN, [pattack(0, -1), pattack(1, 0), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `diamond attack`,
        pic: `${IMG_FOLDER.cards}diamond_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slice_twice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(1, -1), pattack(0, -1), pattack(0, -1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: `slice twice`,
        pic: `${IMG_FOLDER.cards}slice_twice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function advance(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `advance`,
        pic: `${IMG_FOLDER.cards}advance.png`,
        options
    }
}
/** @type {CardGenerator}*/
function bounding_retreat(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(SE, [pmove(2, 2), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2), pmove(-1, 1)]);
    return{
        name: `bounding retreat`,
        pic: `${IMG_FOLDER.cards}bounding_retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function leap_left(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(W, [pmove(-2, 0)]);
    options.add_button(SW, [pmove(-2, 2)]);

    return{
        name: `leap left`,
        pic: `${IMG_FOLDER.cards}leap_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function leap_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(SE, [pmove(2, 2)]);
    return{
        name: `leap right`,
        pic: `${IMG_FOLDER.cards}leap_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function short_charge_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pmove(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pmove(-1, 1), pattack(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: `short charge diagonal`,
        pic: `${IMG_FOLDER.cards}short_charge_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_sprint(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: `side sprint`,
        pic: `${IMG_FOLDER.cards}side_sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_forwards(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1), pattack(1, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: `slash step forwards`,
        pic: `${IMG_FOLDER.cards}slash_step_forwards.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, -1), pattack(0, 1), 
                           pattack(0, -1), pattack(1, 1), pattack(1, -1),]);
    return{
        name: `slash step left`,
        pic: `${IMG_FOLDER.cards}slash_step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_right(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(1, 1), pattack(1, -1), pattack(0, 1), 
                           pattack(0, -1), pattack(-1, 1), pattack(-1, -1)]);
    return{
        name: `slash step right`,
        pic: `${IMG_FOLDER.cards}slash_step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slip_through_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pattack(0, 1), pattack(1, 0), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pattack(0, -1), pattack(-1, 0), pmove(-1, -1)]);
    return{
        name: `slip through ne`,
        pic: `${IMG_FOLDER.cards}slip_through_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slip_through_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(0, -1), pattack(1, 0), pmove(1, -1)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pattack(0, 1), pattack(-1, 0), pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: `slip through nw`,
        pic: `${IMG_FOLDER.cards}slip_through_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function dash_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, -0)]);
    return{
        name: `dash ne`,
        pic: `${IMG_FOLDER.cards}dash_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function dash_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, -0)]);
    return{
        name: `dash nw`,
        pic: `${IMG_FOLDER.cards}dash_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(1, -1), pattack(1, -1), pstun(0, -1), pattack(0, -1), pstun(-1, -1), pattack(-1, -1)]);
    options.add_button(E, [pstun(1, 1), pattack(1, 1), pstun(1, 0), pattack(1, 0), pstun(1, -1), pattack(1, -1)]);
    options.add_button(S, [pstun(1, 1), pattack(1, 1), pstun(0, 1), pattack(0, 1), pstun(-1, 1), pattack(-1, 1)]);
    options.add_button(W, [pstun(-1, 1), pattack(-1, 1), pstun(-1, 0), pattack(-1, 0), pstun(-1, -1), pattack(-1, -1)]);
    return{
        name: `stunning_slice`,
        pic: `${IMG_FOLDER.cards}stunning_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_leap(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2), ...spin]);
    options.add_button(S, [pmove(0, 2), ...spin]);
    return{
        name: `stunning_leap`,
        pic: `${IMG_FOLDER.cards}stunning_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_side_leap(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(E, [pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-2, 0), ...spin]);
    return{
        name: `stunning_side_leap`,
        pic: `${IMG_FOLDER.cards}stunning_side_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    return{
        name: `teleport`,
        pic: `${IMG_FOLDER.cards}teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0), pteleport(0, 0)]);
    options.make_instant();
    return{
        name: `reckless teleport`,
        pic: `${IMG_FOLDER.cards}reckless_teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    options.make_instant();
    return{
        name: `sidestep west`,
        pic: `${IMG_FOLDER.cards}sidestep_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    options.make_instant();
    return{
        name: `sidestep east`,
        pic: `${IMG_FOLDER.cards}sidestep_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.make_instant();
    return{
        name: `sidestep north`,
        pic: `${IMG_FOLDER.cards}sidestep_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    options.make_instant();
    return{
        name: `sidestep south`,
        pic: `${IMG_FOLDER.cards}sidestep_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1)]);
    options.make_instant();
    return{
        name: `sidestep nw`,
        pic: `${IMG_FOLDER.cards}sidestep_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.make_instant();
    return{
        name: `sidestep ne`,
        pic: `${IMG_FOLDER.cards}sidestep_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.make_instant();
    return{
        name: `sidestep se`,
        pic: `${IMG_FOLDER.cards}sidestep_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.make_instant();
    return{
        name: `sidestep sw`,
        pic: `${IMG_FOLDER.cards}sidestep_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0)]);
    options.make_instant();
    return{
        name: `punch orthogonal`,
        pic: `${IMG_FOLDER.cards}punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1)]);
    options.make_instant();
    return{
        name: `punch diagonal`,
        pic: `${IMG_FOLDER.cards}punch_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_attack_right(){
    var options = new ButtonGrid();
    options.add_button(E, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(1, 0), pattack(1, 0), pattack(1, 1), pattack(1, 1), pattack(1, -1), pattack(1, -1)]);
    return{
        name: `reckless attack right`,
        pic: `${IMG_FOLDER.cards}reckless_attack_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_attack_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, 1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: `reckless attack left`,
        pic: `${IMG_FOLDER.cards}reckless_attack_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pstun(0, 0), pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pstun(0, 0), pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pstun(0, 0), pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pstun(0, 0), pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: `reckless sprint`,
        pic: `${IMG_FOLDER.cards}reckless_sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pmove(-1, 0)]);
    options.make_instant();
    return{
        name: `reckless horizontal`,
        pic: `${IMG_FOLDER.cards}reckless_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(0, 0), pmove(1, -1)]);
    options.add_button(SE, [pstun(0, 0), pmove(1, 1)]);
    options.add_button(SW, [pstun(0, 0), pmove(-1, 1)]);
    options.add_button(NW, [pstun(0, 0), pmove(-1, -1)]);
    options.make_instant();
    return{
        name: `reckless diagonal`,
        pic: `${IMG_FOLDER.cards}reckless_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(0, -1)]);
    options.add_button(E, [pstun(1, 0), pstun(1, 0)]);
    options.add_button(S, [pstun(0, 1), pstun(0, 1)]);
    options.add_button(W, [pstun(-1, 0), pstun(-1, 0)]);
    options.make_instant();
    return{
        name: `stunning punch orthogonal`,
        pic: `${IMG_FOLDER.cards}stunning_punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(1, -1), pstun(1, -1)]);
    options.add_button(SE, [pstun(1, 1), pstun(1, 1)]);
    options.add_button(SW, [pstun(-1, 1), pstun(-1, 1)]);
    options.add_button(NW, [pstun(-1, -1), pstun(-1, -1)]);
    options.make_instant();
    return{
        name: `stunning punch diagonal`,
        pic: `${IMG_FOLDER.cards}stunning_punch_diagonal.png`,
        options
    }
}
// ----------------ShopImages.js----------------
// File containing cards used soley to display images in card rows of the shop.

/** @type {CardGenerator} Shown in shop to denote adding a card to your deck.*/
function add_card_symbol(){
    return{
        name: `Add a card to your deck`,
        pic: `${IMG_FOLDER.other}plus.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in show to denote removing a card from your deck.*/
function remove_card_symbol(){
    return{
        name: `Remove a card from your deck`,
        pic: `${IMG_FOLDER.other}minus.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in shop ind=stead of the remove symbol when your deck is at the minimum size.*/
function deck_at_minimum_symbol(){
    return{
        name: `Your deck is at the minimum size`,
        pic: `${IMG_FOLDER.other}x.png`,
        options: new ButtonGrid()
    }
}

function adrenaline_rush(){
    return {
        name: boon_names.adrenaline_rush,
        pic: `${IMG_FOLDER.boons}adrenaline_rush.png`,
        description: adrenaline_rush_description,
    }
}

// Hitting more than 1 enemy gives an extra turn.

BOON_LIST = [
    ancient_card, bitter_determination, boss_slayer, brag_and_boast, chilly_presence, 
    creative, dazing_blows, escape_artist, expend_vitality, fleeting_thoughts, 
    fortitude, frugivore, future_sight, hoarder, limitless, 
    pacifism, pain_reflexes, picky_shopper, rebirth, repetition, 
    roar_of_challenge, safe_passage, serenity, spiked_shoes, spontaneous, 
    stable_mind, stealthy
];

/**
 * Checks to make sure there is no previous player on_hit function since they are mutually exclusive.
 * @returns 
 */
function no_player_on_hit(){
    return GS.map.get_player().on_hit === undefined;
}

function change_max_health(amount){
    if(GS.map.get_player().max_health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    GS.map.get_player().max_health += amount;
    GS.map.get_player().health = Math.min(GS.map.get_player().max_health, GS.map.get_player().health)
}

function max_health_at_least(amount){
    var max_health = GS.map.get_player().max_health;
    return max_health !== undefined && max_health > amount;
}

function ancient_card(){
    return {
        name: boon_names.ancient_card,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        description: add_card_description,
        on_pick: pick_ancient_card,
        unlocks: [ancient_card]
    }
}

function pick_ancient_card(){
    GS.deck.add(lost_technique());
}


function bitter_determination(){
    return {
        name: boon_names.bitter_determination,
        pic: `${IMG_FOLDER.boons}bitter_determination.png`,
        description: bitter_determination_description,
    }
}

function boss_slayer(){
    return {
        name: boon_names.boss_slayer,
        pic: `${IMG_FOLDER.boons}boss_slayer.png`,
        description: boss_slayer_description,
    }
}


function brag_and_boast(){
    return {
        name: boon_names.brag_and_boast,
        pic: `${IMG_FOLDER.boons}brag_and_boast.png`,
        description: brag_and_boast_description,
        on_pick: pick_brag_and_boast,
        unlocks: [brag_and_boast]
    }
}

function pick_brag_and_boast(){
    for(var i = 0; i < 2; ++i){
        var boss = rand_no_repeates(BOSS_LIST, 1)[0]();
        var card = rand_no_repeates(boss.card_drops, 1)[0]();
        GS.deck.add(card);
    }
    var card = rand_no_repeates(CONFUSION_CARDS, 1)[0]();
    GS.deck.add(card);
}


function chilly_presence(){
    return {
        name: boon_names.chilly_presence,
        pic: `${IMG_FOLDER.boons}chilly_presence.png`,
        description: chilly_presence_description,
        prereq: prereq_chilly_presence,
        unlocks: [chilly_presence]
    }
}

function prereq_chilly_presence(){
    return GS.boons.has(boon_names.chilly_presence) < 5;
}

function proc_chilly_presence(tile){
    if(!tile.tags.has(TAGS.boss) && GS.boons.has(boon_names.chilly_presence) > random_num(6)){
        stun(tile);
    }
}

function creative(){
    return {
        name: boon_names.creative,
        pic: `${IMG_FOLDER.boons}creative.png`,
        description: creative_description,
        prereq: prereq_creative,
        on_pick: pick_creative
    }
}

function prereq_creative(){
    return GS.deck.deck_size() >= 10;
}

function pick_creative(){
    GS.deck.alter_min(5);
    GS.deck.alter_hand_size(1);
    GS.deck.deal();
    GS.refresh_deck_display();
}

function dazing_blows(){
    return {
        name: boon_names.dazing_blows,
        pic: `${IMG_FOLDER.boons}dazing_blows.png`,
        description: dazing_blows_description,
    }
}

function escape_artist(){
    return {
        name: boon_names.escape_artist,
        pic: `${IMG_FOLDER.boons}escape_artist.png`,
        description: escape_artist_description,
        prereq: no_player_on_hit,
        on_pick: pick_escape_artist
    }
}

function pick_escape_artist(){
    GS.map.get_player().on_hit = escape_artist_behavior;
}

/** @type {AIFunction}*/
function escape_artist_behavior(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        teleport_spell(self, target, map);
    }
}

function expend_vitality(){
    return {
        name: boon_names.expend_vitality,
        pic: `${IMG_FOLDER.boons}expend_vitality.png`,
        description: expend_vitality_description,
        prereq: prereq_expend_vitality,
        on_pick: pick_expend_vitality
    }
}

function prereq_expend_vitality(){
    return max_health_at_least(1);
}

function pick_expend_vitality(){
    change_max_health(-1);
}

function fleeting_thoughts(){
    return {
        name: boon_names.fleeting_thoughts,
        pic: `${IMG_FOLDER.boons}fleeting_thoughts.png`,
        description: fleeting_thoughts_description,
    }
}

function fortitude(){
    return {
        name: boon_names.fortitude,
        pic: `${IMG_FOLDER.boons}fortitude.png`,
        description: fortitude_description,
        prereq: prereq_fortitude,
        on_pick: pick_fortitude,
        unlocks: [fortitude]
    }
}

function prereq_fortitude(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_fortitude(){
    change_max_health(1);
}

function frugivore(){
    return {
        name: boon_names.frugivore,
        pic: `${IMG_FOLDER.boons}frugivore.png`,
        description: frugivore_description,
        prereq: prereq_frugivore,
        unlocks: [frugivore]
    }
}
function prereq_frugivore(){
    return GS.boons.has(boon_names.frugivore) < 2;
}

function future_sight(){
    return {
        name: boon_names.future_sight,
        pic: `${IMG_FOLDER.boons}future_sight.png`,
        description: future_sight_description,
        on_pick: pick_future_sight
    }
}

function pick_future_sight(){
    display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.deck_order, function(){
        display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.deck_order);
    });
    display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.deck_order);
}

function hoarder(){
    return {
        name: boon_names.hoarder,
        pic: `${IMG_FOLDER.boons}hoarder.png`,
        description: hoarder_description
    }
}
function limitless(){
    return {
        name: boon_names.limitless,
        pic: `${IMG_FOLDER.boons}limitless.png`,
        description: limitless_description,
        on_pick: on_pick_limitless
    }
}

function on_pick_limitless(){
    GS.map.get_player().max_health = undefined;
    GS.map.player_heal(new Point(0, 0), 2);
}
function pacifism(){
    return {
        name: boon_names.pacifism,
        pic: `${IMG_FOLDER.boons}pacifism.png`,
        description: pacifism_description,
    }
}


function pain_reflexes(){
    return {
        name: boon_names.pain_reflexes,
        pic: `${IMG_FOLDER.boons}pain_reflexes.png`,
        description: pain_reflexes_description,
    }
}

function picky_shopper(){
    return {
        name: boon_names.picky_shopper,
        pic: `${IMG_FOLDER.boons}picky_shopper.png`,
        description: picky_shopper_description,
        unlocks: [picky_shopper]
    }
}

function rebirth(){
    return {
        name: boon_names.rebirth,
        pic: `${IMG_FOLDER.boons}rebirth.png`,
        description: rebirth_description,
        unlocks: [rebirth]    
    }
}

function repetition(){
    return {
        name: boon_names.repetition,
        pic: `${IMG_FOLDER.boons}repetition.png`,
        description: repetition_description,
        prereq: prereq_repetition,
        unlocks: [repetition]
    }
}

function prereq_repetition(){
    return GS.boons.has(boon_names.repetition) < 3;
}

function roar_of_challenge(){
    return {
        name: boon_names.roar_of_challenge,
        pic: `${IMG_FOLDER.boons}roar_of_challenge.png`,
        description: roar_of_challenge_description,
        prereq: prereq_roar_of_challenge,
        on_pick: pick_roar_of_challenge,
        unlocks: [roar_of_challenge]
    }
}

function prereq_roar_of_challenge(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_roar_of_challenge(){
    change_max_health(2);
}

function safe_passage(){
    return {
        name: boon_names.safe_passage,
        pic: `${IMG_FOLDER.boons}safe_passage.png`,
        description: safe_passage_description,
        prereq: prereq_safe_passage,
        unlocks: [safe_passage]
    }
}

function prereq_safe_passage(){
    var player = GS.map.get_player();
    return player.max_health === undefined || player.health < player.max_health;
}

function serenity(){
    return {
        name: boon_names.serenity,
        pic: `${IMG_FOLDER.boons}serenity.png`,
        description: serenity_description,
        prereq: prereq_serenity,
        on_pick: pick_serenity,
        unlocks: [serenity]
    }
}

function prereq_serenity(){
    return GS.deck.deck_min() > 4;
}

function pick_serenity(){
    while(GS.deck.deck_min() > 4){
        GS.deck.alter_min(-1);
    }
}

function spiked_shoes(){
    return {
        name: boon_names.spiked_shoes,
        pic: `${IMG_FOLDER.boons}spiked_shoes.png`,
        description: spiked_shoes_description,
        prereq: prereq_spiked_shoes,
        on_pick: pick_spiked_shoes
    }
}

function prereq_spiked_shoes(){
    return max_health_at_least(1);
}

function pick_spiked_shoes(){
    change_max_health(-1);
}


function spontaneous(){
    return {
        name: boon_names.spontaneous,
        pic: `${IMG_FOLDER.boons}spontaneous.png`,
        description: spontaneous_description,
        prereq: prereq_spontaneous,
        on_pick: pick_spontaneous
    }
}

function prereq_spontaneous(){
    return GS.deck.deck_size() >= 10;
}

function pick_spontaneous(){
    GS.deck.alter_min(5);
}

function stable_mind(){
    return {
        name: boon_names.stable_mind,
        pic: `${IMG_FOLDER.boons}stable_mind.png`,
        description: stable_mind_description,
    }
}

function stealthy(){
    return {
        name: boon_names.stealthy,
        pic: `${IMG_FOLDER.boons}stealthy.png`,
        description: stealthy_description,
    }
}

function frenzy(){
    return {
        name: boon_names.frenzy,
        pic: `${IMG_FOLDER.boons}frenzy.png`,
        description: frenzy_description,
    }
}


function learn_from_mistakes(){
    return {
        name: boon_names.learn_from_mistakes,
        pic: `${IMG_FOLDER.boons}learn_from_mistakes.png`,
        description: learn_from_mistakes_description,
        on_pick: pick_learn_from_mistakes,
        unlocks: [learn_from_mistakes]
    }
}
// Not Finished
// Todo:
//  description
//  implement on_pick

function practice_makes_perfect(){
    return {
        name: boon_names.practice_makes_perfect,
        pic: `${IMG_FOLDER.boons}practice_makes_perfect.png`,
        description: practice_makes_perfect_description,
    }
}


function pressure_points(){
    return {
        name: boon_names.pressure_points,
        pic: `${IMG_FOLDER.boons}pressure_points.png`,
        description: pressure_points_description,
    }
}

function shattered_glass(){
    return {
        name: boon_names.shattered_glass,
        pic: `${IMG_FOLDER.boons}shattered_glass.png`,
        description: shattered_glass_description,
        prereq: prereq_shattered_glass,
        on_pick: on_pick_shattered_glass
    }
}

function prereq_shattered_glass(){
    return max_health_at_least(1);
}

function on_pick_shattered_glass(){
    change_max_health(-1);
}

function skill_trading(){
    return {
        name: boon_names.skill_trading,
        pic: `${IMG_FOLDER.boons}skill_trading.png`,
        description: skill_trading_description,
    }
}


function spined_armor(){
    return {
        name: boon_names.spined_armor,
        pic: `${IMG_FOLDER.boons}spined_armor.png`,
        description: spined_armor_description,
        on_pick: pick_spined_armor
    }
}
// Todo:
//  description
//  implement

function stubborn(){
    return {
        name: boon_names.stubborn,
        pic: `${IMG_FOLDER.boons}stubborn.png`,
        description: stubborn_description,
    }
}
// Todo:
//  description
//  implement

function thick_soles(){
    return {
        name: boon_names.thick_soles,
        pic: `${IMG_FOLDER.boons}thick_soles.png`,
        description: thick_soles_description,
    }
}
// Todo:
//  description
//  implement
