/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack_until(0, 1), pattack_until(1, 0)]);
    options.add_button(NW, [pmove(-1, -1), pattack(1, -1), pattack(-1, 1), pattack(-1, -1)]);
    return{
        name: card_names.beam_se,
        pic: `${IMG_FOLDER.cards}beam_se.png`,
        options
    }
}