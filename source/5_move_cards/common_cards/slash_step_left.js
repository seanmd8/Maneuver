
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