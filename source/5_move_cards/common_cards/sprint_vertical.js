
/** @type {CardGenerator}*/
function sprint_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    return{
        name: card_names.sprint_vertical,
        pic: `${IMG_FOLDER.cards}sprint_vertical.png`,
        options
    }
}