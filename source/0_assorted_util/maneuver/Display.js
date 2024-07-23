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
            DisplayHTML.get_element(divisions[i], HTMLDivElement).style.display = `none`;
        }
        if(screen !== undefined){
            DisplayHTML.get_element(screen, HTMLDivElement).style.display = `block`;
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