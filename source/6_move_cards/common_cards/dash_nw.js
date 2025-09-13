/** @type {CardGenerator}*/
function dash_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, -0)]);
    return{
        name: card_names.da,
        pic: `${IMG_FOLDER.cards}dash_nw.png`,
        options
    }
}