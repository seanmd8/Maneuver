/** @type {CardGenerator}*/
function slice_twice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(1, -1), pattack(0, -1), pattack(0, -1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.slice_twice,
        pic: `${IMG_FOLDER.cards}slice_twice.png`,
        options
    }
}