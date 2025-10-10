/** @type {CardGenerator}*/
function superweapon_1(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    options.add_button(C, spin);
    return{
        name: card_names.superweapon_1,
        pic: `${IMG_FOLDER.cards}superweapon_1.png`,
        options,
        evolutions: [superweapon_2]
    }
}

/** @type {CardGenerator}*/
function superweapon_2(){
    var options = new ButtonGrid();
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            if(i !== 0 || j !== 0){
                area.push(pattack(i, j));
            }
        }
    }
    options.add_button(C, area);
    return{
        name: card_names.superweapon_2,
        pic: `${IMG_FOLDER.cards}superweapon_2.png`,
        options
    }
}