
/** @type {CardGenerator}*/
function split_second_1(){
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
        name: `split second 1`,
        pic: `${IMG_FOLDER.cards}split_second_1.png`,
        options,
        evolutions: [split_second_2]
    }
}

/** @type {CardGenerator}*/
function split_second_2(){
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
    options.make_instant();
    return{
        name: `split second 2`,
        pic: `${IMG_FOLDER.cards}split_second_2.png`,
        options
    }
}