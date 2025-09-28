/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pattack_until(0, 1), pattack_until(-1, 0)]);
    options.add_button(NE, [pmove(1, -1), pattack(-1, -1), pattack(1, 1), pattack(1, -1)]);
    return{
        name: card_names.beam_sw,
        pic: `${IMG_FOLDER.cards}beam_sw.png`,
        options
    }
}