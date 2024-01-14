// ----------------Display.js----------------
// File containing the display class which interacts with wherever the game is being displayed. 
// Currently the only way to display is via HTML, but if I wanted to port the game, this should
// make it easier to do without too much editing outside of this file and the uiid file. This also
// Standardizes how information is displayed making it easier to create new display elements.

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
 */

/**
 * @callback OnClickFunction A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {number} position The column number of the element.
 */

/**
 * @callback add_tb_row A function to add a row of images to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {CellInfo[]} row_contents The objects used to construct the row's contents.
 * @param {number} scale The size of the images.
 * @param {OnClickFunction} [on_click = undefined] Optional parameter which is used to give onclick functionality to the images.
 * @param {string} [background = undefined] Optional parameter which specifies a image to be layered underneath each other one.
 */

/**
 * @callback add_button_row A function to add a row of buttons to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {ButtonInfo[]} row_contents The objects used to construct the row's contents.
 * @param {OnClickFunction} [on_click = undefined] Optional parameter which is used to give onclick functionality to the buttons.
 */

/**
 * @callback display_message A function to display a message to an element.
 * @param {string} location The ID of the element to display the message to.
 * @param {string} message The message to be displayed.
 */

/**
 * @callback clear_tb A function to remove all rows from a table.
 * @param {string} location The ID of the table to remove rows from.
 */

/**
 * @callback swap_screen A function to swap which div from a group is visible
 * @param {string} screen The ID of the div to swap to.
 */

/**
 * @callback select A function to outline one image from a row of images in a table.
 * @param {string} location The ID of the table.
 * @param {number} row_num The row number of the image.
 * @param {number} column_num The column number of the image.
 * @param {number} [border = 3] Optional parameter to specify border thickness
 * @param {number} [color = 555] Optional parameter to specify border color.
 */

/**
 * @callback press A function to handle keyboard controls.
 * @param {KeyboardEvent} key_press The keystroke to handle.
 */

/**
 * @typedef {Object} DisplayLibrary The library of functions used to handle displaying things in a specific language.
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {clear_tb} clear_tb
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
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
            throw new Error(`invalid display language`);
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
 * @typedef HTML_Helpers A list of which helper functions are used by the DisplayHTML library.
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
    add_tb_row: function(location, row_contents, scale, on_click, background = undefined){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position, click){
            return function(){
                return click(tile, position);
            }
        }
        for(var i = 0; i < row_contents.length; ++i){
            var to_display = row_contents[i];
            var cell = document.createElement(`td`);
            cell.id = `${location} ${row_num} ${i}`;
            cell.style.height = `${scale}px`;
            cell.style.width = `${scale}px`;
            cell.classList.add(`relative`);
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(to_display, i, on_click);
            }
            if(to_display.name !== undefined){
                cell.title = to_display.name;
            }
            if(!(background === undefined)){
                var bottom_img = document.createElement(`img`);
                bottom_img.id = `${location} ${row_num} ${i} background img`;
                bottom_img.src = `${img_folder.src}${background}`;
                bottom_img.height = scale;
                bottom_img.width = scale;
                bottom_img.classList.add(`absolute`);
                bottom_img.style.position = `absolute`;
                cell.append(bottom_img);
            }
            var top_img = document.createElement(`img`);
            top_img.id = `${location} ${row_num} ${i} img`;
            top_img.src = `${img_folder.src}${to_display.pic}`;
            top_img.height = scale;
            top_img.width = scale;
            top_img.classList.add(`absolute`);
            top_img.style.transform = DisplayHTML.get_transformation(to_display);
            cell.append(top_img);
            row.append(cell);
        }
        table.append(row);
    },
    add_button_row: function(location, row_contents, on_click = undefined){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position, click){
            return function(){
                return click(tile, position);
            }
        }
        for(var i = 0; i < row_contents.length; ++i){
            var cell = document.createElement(`input`);
            cell.type = `button`;
            cell.id = `${location} ${row_num} ${i}`;
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(row_contents[i], i, on_click);
            }
            cell.value = row_contents[i].description;
            row.append(cell);
        }
        table.append(row);
    },
    display_message: function(location, message){
        var output = wrap_str(message, TEXT_WRAP_WIDTH, ` `);
        DisplayHTML.get_element(location).innerText = output;
    },
    clear_tb: function(location){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        while(table.rows.length > 0){
            table.deleteRow(0);
        }
    },
    swap_screen: function(screen){
        switch(screen){
            case ui_id.game_screen:
                DisplayHTML.get_element(ui_id.tutorial, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.game_screen, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.stage:
                DisplayHTML.get_element(ui_id.shop, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.chest, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.stage, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.shop:
                DisplayHTML.get_element(ui_id.stage, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.chest, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.shop, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.chest:
                DisplayHTML.get_element(ui_id.stage, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.shop, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.chest, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.tutorial:
                DisplayHTML.get_element(ui_id.game_screen, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.tutorial, HTMLDivElement).style.display = `block`;
                break;
            default:
                throw new Error(`invalid screen swap`);
        }
        return;
    },
    select: function(location, row_num, column_num, border = 3, color = 555){
        var row = DisplayHTML.get_element(`${location} row ${row_num}`, HTMLTableRowElement);
        var column_count = row.cells.length;
        for(var i = 0; i < column_count; ++i){
            DisplayHTML.get_element(`${location} ${row_num} ${i} img`, HTMLImageElement).border = ``;
        }
        DisplayHTML.get_element(`${location} ${row_num} ${column_num} img`, HTMLImageElement).border = `${border}px solid #${color}`;
    },
    press: function(key_press){
        // Pick direction via keyboard.
        var key_num = search(key_press.key, controls.directional);
        if(key_num >= 0){
            try{
                DisplayHTML.get_element(`${ui_id.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`).click();
            }
            catch(error){
                if(error.message !== `failed to retrieve html element`){
                    throw error;
                }
            }
            
        }
        // Select card via keyboard.
        key_num = search(key_press.key, controls.card);
        if(key_num >= 0){
            var element = DisplayHTML.get_element(`${ui_id.hand_display} 0 ${key_num}`);
            element && element.click();
        }
    },

    // Non Required helper functions.
    get_transformation: function(to_display){
        var transformation = ``;
        if(to_display.rotate !== undefined){
            transformation = `${transformation}rotate(${to_display.rotate}deg) `;
        }
        if(to_display.flip){
            transformation = `${transformation}scaleX(-1) `;
        }
        return transformation;   
    },
    get_element: function(location, type = undefined){
        var element = document.getElementById(location);
        if(element === null){
            throw new Error(`failed to retrieve html element`);
        }
        if(type !== undefined && !(element instanceof type)){
            throw new Error(`html element is the wrong type`);
        }
        return element
    }
}
Object.freeze(DisplayHTML);

// Set up the display library and the onkeydown function.
const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;