
/** @type {CardGenerator}*/
function lightheaded(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0)], 5);
    options.make_instant();
    return{
        name: card_names.lightheaded,
        pic: `${IMG_FOLDER.cards}lightheaded.png`,
        options
    }
}