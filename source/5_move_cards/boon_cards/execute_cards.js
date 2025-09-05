/** @type {CardGenerator}*/
function execution_1(){
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
        name: card_names.execution_1,
        pic: `${IMG_FOLDER.cards}execution_1.png`,
        options,
        evolutions: [execution_2]
    }
}

/** @type {CardGenerator}*/
function execution_2(){
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
        name: card_names.execution_2,
        pic: `${IMG_FOLDER.cards}execution_2.png`,
        options,
        evolutions: [execution_3]
    }
}

/** @type {CardGenerator}*/
function execution_3(){
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
        name: card_names.execution_3,
        pic: `${IMG_FOLDER.cards}execution_3.png`,
        options
    }
}