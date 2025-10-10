/** @type {CardGenerator}*/
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(pattack(i, j));
        }
    }
    var options = new ButtonGrid();
    options.add_button(C, area, 5);
    return{
        name: card_names.explosion,
        pic: `${IMG_FOLDER.cards}explosion.png`,
        options
    }
}