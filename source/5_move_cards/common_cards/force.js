
/** @type {CardGenerator}*/
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1), pattack(0, -1), pmove(0, -1)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1), pattack(0, 1), pmove(0, 1)]);
    return{
        name: `force`,
        pic: `${IMG_FOLDER.cards}force.png`,
        options
    }
}