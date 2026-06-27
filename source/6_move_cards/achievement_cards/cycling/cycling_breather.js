
/** @type {CardGenerator} */
function cycling_breather(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0)], 5);
    options.make_cycling();
    options.make_instant();
    return{
        name: card_names.cycling_breather,
        pic: `${IMG_FOLDER.cards}cycling_breather.png`,
        options
    }
}