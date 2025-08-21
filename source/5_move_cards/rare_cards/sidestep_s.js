
/** @type {CardGenerator}*/
function sidestep_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    options.make_instant();
    return{
        name: `sidestep south`,
        pic: `${IMG_FOLDER.cards}sidestep_s.png`,
        options
    }
}