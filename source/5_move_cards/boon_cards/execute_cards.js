
/** @type {CardGenerator}*/
function chipped_execution(){
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
        name: `chipped execution`,
        pic: `${IMG_FOLDER.cards}chipped_execution.png`,
        options,
        evolutions: [unpolished_execution]
    }
}

/** @type {CardGenerator}*/
function unpolished_execution(){
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
    spin = [...spin, ...spin, ...spin];
    options.add_button(SPIN, spin);
    return{
        name: `execution`,
        pic: `${IMG_FOLDER.cards}execution.png`,
        options
    }
}