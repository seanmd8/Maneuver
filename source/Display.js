
function get_display(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return DisplayHTML;
        default:
            throw exception(`invalid display language`);
    }
}

class DisplayHTML{
    static add_tb_row(location, row_contents, scale, on_click){
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
            var cell = document.createElement(`td`);
            cell.id = `${location} ${row_num} ${i}`;
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(row_contents[i], i);
            }
            var img = document.createElement(`img`);
            img.id = `${location} ${row_num} ${i} img`;
            img.src = `${img_folder.src}${row_contents[i].pic}`;
            img.height = scale;
            img.width = scale;
            cell.append(img);
            row.append(cell);
        }
        table.append(row);
    }
    static display_buttons(location, row_contents, on_click){
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
    static display_message(location, to_display){
        document.getElementById(location).innerText = to_display;
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
                throw Error(`invalid screen swap`);
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
}
const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;