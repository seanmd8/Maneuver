
function get_display(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return DisplayHTML;
        default:
            throw new Error(`invalid display language`);
    }
}

class DisplayHTML{
    static add_tb_row(location, row_contents, scale, on_click, background){
        var table = document.getElementById(location);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position){
            return function(){
                return on_click(tile, position);
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
                cell.onclick = make_on_click(to_display, i);
            }
            if(to_display.hasOwnProperty(`name`)){
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
            top_img.style.transform = this.#get_transformation(to_display);
            cell.append(top_img);
            row.append(cell);
        }
        table.append(row);
    }
    static add_button_row(location, row_contents, on_click){
        var table = document.getElementById(location);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position){
            return function(){
                return on_click(tile, position);
            }
        }
        for(var i = 0; i < row_contents.length; ++i){
            var cell = document.createElement(`input`);
            cell.type = `button`;
            cell.id = `${location} ${row_num} ${i}`;
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(row_contents[i], i);
            }
            cell.value = row_contents[i].description;
            row.append(cell);
        }
        table.append(row);
    }
    static display_message(location, message){
        var output = wrap_str(message, TEXT_WRAP_WIDTH, ` `);
        document.getElementById(location).innerText = output;
    }
    static clear_tb(location){
        while(document.getElementById(location).rows.length > 0){
            document.getElementById(location).deleteRow(0);
        }
    }
    static swap_screen(screen){
        switch(screen){
            case ui_id.game_screen:
                document.getElementById(ui_id.tutorial).style.display = `none`;
                document.getElementById(ui_id.game_screen).style.display = `block`;
                break;
            case ui_id.stage:
                document.getElementById(ui_id.shop).style.display = `none`;
                document.getElementById(ui_id.chest).style.display = `none`;
                document.getElementById(ui_id.stage).style.display = `block`;
                break;
            case ui_id.shop:
                document.getElementById(ui_id.stage).style.display = `none`;
                document.getElementById(ui_id.chest).style.display = `none`;
                document.getElementById(ui_id.shop).style.display = `block`;
                break;
            case ui_id.chest:
                document.getElementById(ui_id.stage).style.display = `none`;
                document.getElementById(ui_id.shop).style.display = `none`;
                document.getElementById(ui_id.chest).style.display = `block`;
                break;
            case ui_id.tutorial:
                document.getElementById(ui_id.game_screen).style.display = `none`;
                document.getElementById(ui_id.tutorial).style.display = `block`;
                break;
            default:
                throw new Error(`invalid screen swap`);
        }
        return;
    }
    static select(location, row_num, column_num, border = 3, color = 555){
        var row = document.getElementById(`${location} row ${row_num}`);
        var column_count = row.cells.length;
        for(var i = 0; i < column_count; ++i){
            document.getElementById(`${location} ${row_num} ${i} img`).border = ``;
        }
        document.getElementById(`${location} ${row_num} ${column_num} img`).border = `${border}px solid #${color}`;
    }
    static press(key_press){
        // Pick direction via keyboard.
        var key_num = search(key_press.key, controls.directional);
        if(key_num >= 0){
            var element = document.getElementById(`${ui_id.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`);
            element && element.click();
        }
        // Select card via keyboard.
        key_num = search(key_press.key, controls.card);
        if(key_num >= 0){
            var element = document.getElementById(`${ui_id.hand_display} 0 ${key_num}`);
            element && element.click();
        }
    }
    static #get_transformation(to_display){
        var transformation = ``;
        if(to_display.hasOwnProperty(`rotate`)){
            transformation = `${transformation}rotate(${to_display.rotate}deg) `;
        }
        if(to_display.hasOwnProperty(`flip`) && to_display.flip){
            transformation = `${transformation}scaleX(-1) `;
        }
        return transformation;   
    }
}
const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;