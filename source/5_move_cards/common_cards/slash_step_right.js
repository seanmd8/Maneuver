
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