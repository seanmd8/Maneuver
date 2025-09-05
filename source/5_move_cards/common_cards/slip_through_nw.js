/** @type {CardGenerator}*/
function slip_through_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(0, -1), pattack(1, 0), pmove(1, -1)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pattack(0, 1), pattack(-1, 0), pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.slip_through_nw,
        pic: `${IMG_FOLDER.cards}slip_through_nw.png`,
        options
    }
}