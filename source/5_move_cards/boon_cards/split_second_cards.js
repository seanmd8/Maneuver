
/** @type {CardGenerator}*/
function chipped_split_second(){
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
        name: `chipped split second`,
        pic: `${IMG_FOLDER.cards}chipped_split_second.png`,
        options,
        evolutions: [split_second]
    }
}

/** @type {CardGenerator}*/
function split_second(){
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
        name: `split second`,
        pic: `${IMG_FOLDER.cards}split_second.png`,
        options
    }
}