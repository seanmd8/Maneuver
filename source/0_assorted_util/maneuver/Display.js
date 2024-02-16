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
 */

/**
 * @callback OnClickFunction A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {Point} position The row and column of the element.
 */

/**
 * @callback BackgroundCreator A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {Point} position The row and column of the element.
 * @returns {string[]} An array of the pictures to layer in the background.
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
 * @param {OnClickFunction} [on_click = undefined] Optional parameter which is used to give onclick functionality to the images.
 * @param {BackgroundCreator} [background = undefined] Optional parameter which specifies a image to be layered underneath each other one.
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
 * @param {string[]} divisions An array of div names to set to invisible.
 * @param {string} [screen = undefined] Optional parameter for the ID of a div to set to visible.
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
 * @param {string} header The header to give the section. The div id will be of the form `${header} section`.
 * @param {string[]} par_arr An array of the strings which other elements should be placed between.
 * @param {HTMLElement[]} inline_arr An array of other elements to be added inline inbetween the strings. 
 *                                  It's length should be 1 or 0 less than par_arr's.
 * @returns {HTMLDivElement} The div including the mix of text and other elements.
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
 * @typedef {Object} DisplayLibrary The library of functions used to handle displaying things in a specific language.
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {clear_tb} clear_tb
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
 * @property {create_visibility_toggle} create_visibility_toggle
 * @property {create_dropdown} create_dropdown
 * @property {create_alternating_text_section} create_alternating_text_section
 * @property {create_button} create_button
 * @property {create_image} create_image
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
 * @typedef HTML_Helpers A collection of the helper functions used by the DisplayHTML library.
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
            if(on_click !== undefined){
                cell.onclick = make_on_click(to_display, new Point(i, row_num), on_click);
            }
            if(to_display.name !== undefined){
                cell.title = to_display.name;
            }
            if(background !== undefined){
                var background_arr = background(to_display, new Point(i, row_num));
                for(var j = 0; j < background_arr.length; ++j){
                    var bottom_img = document.createElement(`img`);
                    bottom_img.id = `${location} ${row_num} ${i} background ${j} img`;
                    bottom_img.src = `${IMG_FOLDER.src}${background_arr[j]}`;
                    bottom_img.height = scale;
                    bottom_img.width = scale;
                    bottom_img.classList.add(`absolute`);
                    bottom_img.style.position = `absolute`;
                    cell.append(bottom_img);
                }
                
            }
            var top_img = document.createElement(`img`);
            top_img.id = `${location} ${row_num} ${i} img`;
            top_img.src = `${IMG_FOLDER.src}${to_display.pic}`;
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
            var button_on_click = undefined;
            if(on_click !== undefined){
                button_on_click = make_on_click(row_contents[i], new Point(i, row_num), on_click);
            }
            row.append(DisplayHTML.create_button(row_contents[i].description, `${location} ${row_num} ${i}`, button_on_click));
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
    swap_screen: function(divisions, screen = undefined){
        for(var i = 0; i < divisions.length; ++i){
            DisplayHTML.get_element(divisions[i], HTMLDivElement).style.display = `none`;
        }
        if(screen !== undefined){
            DisplayHTML.get_element(screen, HTMLDivElement).style.display = `block`;
        }
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
        var key_num = search(key_press.key, CONTROLS.directional);
        if(key_num >= 0){
            try{
                DisplayHTML.get_element(`${UIIDS.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`).click();
            }
            catch(error){
                if(error.message !== `failed to retrieve html element`){
                    throw error;
                }
            }
            
        }
        // Select card via keyboard.
        key_num = search(key_press.key, CONTROLS.card);
        if(key_num >= 0){
            var element = DisplayHTML.get_element(`${UIIDS.hand_display} 0 ${key_num}`);
            element && element.click();
        }
    },
    create_visibility_toggle: function(location, header, body_element){
        var toggle_visible = function(button_table_id, body_id, header_txt, visible){
            return function(tile, position){
                var vis_str = visible ? `Hide` : `Show`;
                var callback = toggle_visible(tb_id, body_id, header_txt, !visible);
                DisplayHTML.clear_tb(button_table_id);
                DisplayHTML.add_button_row(button_table_id, [{description: `${vis_str} ${header_txt}`}], callback);
                var vis_style = visible ? `block` : `none`;
                DisplayHTML.get_element(body_id).style.display = vis_style;
            }
        }

        var section = DisplayHTML.get_element(location);
        var table = document.createElement(`table`);
        var tb_id = `${header} button table`;
        table.id = tb_id;
        section.append(table);

        body_element.style.display = `none`;
        section.append(body_element);
        DisplayHTML.add_button_row(tb_id, [{description: `Show ${header}`}], toggle_visible(tb_id, body_element.id, header, true));
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
    create_alternating_text_section: function(header, par_arr, inline_arr){
        if(par_arr.length !== inline_arr.length && par_arr.length !== inline_arr.length + 1){
            throw new Error(`array size mismatch`);
        }
        var body_div = document.createElement(`div`);
        var body_div_id = `${header} section`;
        body_div.id = body_div_id;
        body_div.style.display = `none`;


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
        
        return body_div;
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