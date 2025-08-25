
/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pattack_until(0, -1), pattack_until(-1, 0)]);
    options.add_button(SE, [pmove(1, 1)]);
    return{
        name: card_names.beam_nw,
        pic: `${IMG_FOLDER.cards}beam_nw.png`,
        options
    }
}