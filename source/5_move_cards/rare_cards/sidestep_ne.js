
/** @type {CardGenerator}*/
function sidestep_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.make_instant();
    return{
        name: `sidestep ne`,
        pic: `${IMG_FOLDER.cards}sidestep_ne.png`,
        options
    }
}