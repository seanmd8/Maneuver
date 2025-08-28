
/** @type {CardGenerator}*/
function slash_step_forwards(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1), pattack(1, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.slash_step_forwards,
        pic: `${IMG_FOLDER.cards}slash_step_forwards.png`,
        options
    }
}