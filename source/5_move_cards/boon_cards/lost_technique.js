/** @type {CardGenerator}*/
function lost_technique(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: `lost technique`,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        options,
        evolutions: [chipped_split_second, chipped_execution, chipped_superweapon]
    }
}

/** @type {CardGenerator}*/
function chipped_split_second(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    options.add_button(SPIN, spin);
    return{
        name: `chipped split second`,
        pic: `${IMG_FOLDER.cards}chipped_split_second.png`,
        options,
        evolutions: [split_second]
    }
}

/** @type {CardGenerator}*/
function split_second(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1),
                pinstant(0, 0)];
    options.add_button(SPIN, spin);
    return{
        name: `split second`,
        pic: `${IMG_FOLDER.cards}split_second.png`,
        options
    }
}

/** @type {CardGenerator}*/
function chipped_execution(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    options.add_button(SPIN, spin);
    return{
        name: `chipped execution`,
        pic: `${IMG_FOLDER.cards}chipped_execution.png`,
        options,
        evolutions: [unpolished_execution]
    }
}

/** @type {CardGenerator}*/
function unpolished_execution(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    spin = [...spin, ...spin];
    options.add_button(SPIN, spin);
    return{
        name: `unpolished execution`,
        pic: `${IMG_FOLDER.cards}unpolished_execution.png`,
        options,
        evolutions: [execution]
    }
}

/** @type {CardGenerator}*/
function execution(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
    spin = [...spin, ...spin, ...spin];
    options.add_button(SPIN, spin);
    return{
        name: `execution`,
        pic: `${IMG_FOLDER.cards}execution.png`,
        options
    }
}

/** @type {CardGenerator}*/
function chipped_superweapon(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)];
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