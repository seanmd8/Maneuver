
/** @type {CardGenerator}*/
function chipped_superweapon(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1)
    ];
    options.add_button(SPIN, spin);
    return{
        name: `chipped superweapon`,
        pic: `${IMG_FOLDER.cards}chipped_superweapon.png`,
        options
    }
}

/** @type {CardGenerator}*/
function superweapon(){
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
    options.add_button(SPIN, area);
    return{
        name: `superweapon`,
        pic: `${IMG_FOLDER.cards}superweapon.png`,
        options
    }
}