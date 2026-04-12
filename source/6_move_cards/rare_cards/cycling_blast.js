/** @type {CardGenerator} */
function cycling_blast(){
    var options = new ButtonGrid();
    options.add_button(N, [
        pattack(0, -1), pattack(1, -1), pattack(-1, -1), 
        pattack(0, -2), pattack(1, -2), pattack(-1, -2), 
        pattack(0, -3), pattack(1, -3), pattack(-1, -3), 
    ]);
    options.make_cycling();
    return{
        name: card_names.cycling_blast,
        pic: `${IMG_FOLDER.cards}cycling_blast.png`,
        options
    }
}