// ----------------Display.js----------------
// File containing the display class which interacts with wherever the game is being displayed. 
// Currently the only way to display is via HTML, but if I wanted to port the game, this should
// make it easier to do without too much editing outside of this file and the uiid file. This also
// Standardizes how information is displayed making it easier to create new display elements.

/**
 * @typedef {Object} CellInfo
 * @property {string} pic
 * @property {string=} name
 * @property {number=} rotate
 * @property {boolean=} flip
 */

/**
 * @typedef {Object} ButtonInfo
 * @property {string} description
 */

/**
 * @callback OnClickFunction
 * @param {CellInfo} tile
 * @param {number} position
 */

/**
 * @callback add_tb_row
 * @param {string} location
 * @param {CellInfo[]} row_contents
 * @param {number} scale
 * @param {OnClickFunction} [on_click = undefined]
 * @param {string} [background = undefined]
 */

/**
 * @callback add_button_row
 * @param {string} location
 * @param {ButtonInfo[]} row_contents
 * @param {OnClickFunction} [on_click = undefined]
 */

/**
 * @callback display_message
 * @param {string} location
 * @param {string} message
 */

/**
 * @callback clear_tb
 * @param {string} location
 */

/**
 * @callback swap_screen
 * @param {string} screen
 */

/**
 * @callback select
 * @param {string} location
 * @param {number} row_num
 * @param {number} column_num
 * @param {number} [border = 3]
 * @param {number} [color = 555]
 */

/**
 * @callback press
 * @param {KeyboardEvent} key_press
 */

/**
 * @typedef {Object} DisplayLibrary
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {clear_tb} clear_tb
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
 */


/**
 * @param {string} language 
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
 * @callback get_transformation
 * @param {CellInfo} to_display
 * @returns {string}
 */

/**
 * 
 * @callback html_constructor
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
 * @callback get_element
 * @param {string} location
 * @param {function} [type = undefined]
 * @returns {*}
 */

/**
 * @typedef HTML_Helpers
 * @property {get_transformation} get_transformation
 * @property {get_element} get_element
 */


/**
 * @type {DisplayLibrary & HTML_Helpers}
 * 
 */
const DisplayHTML = {
    // Required
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

    // Not Required helper function
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

const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;