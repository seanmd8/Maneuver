/** @type {CardGenerator}*/
function sprint_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.sprint_horizontal,
        pic: `${IMG_FOLDER.cards}sprint_horizontal.png`,
        options
    }
}