
/** @type {CardGenerator} */
function hodgepodge(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pstun(0, 0), pstun(0, 0), pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.make_cycling();
    options.make_instant()
    return{
        name: card_names.hodgepodge,
        pic: `${IMG_FOLDER.cards}hodgepodge.png`,
        options
    }
}