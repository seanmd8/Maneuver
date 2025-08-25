
/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack_until(0, -1), pattack_until(1, 0)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: card_names.beam_ne,
        pic: `${IMG_FOLDER.cards}beam_ne.png`,
        options
    }
}