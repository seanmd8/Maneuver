/** @type {CardGenerator} Dropped by the lich*/
function debilitating_confusion(){
    var options = new ButtonGrid();
    var spin = [pstun(1, 1),
                pstun(1, 0),
                pstun(1, -1),
                pstun(0, 1),
                pstun(0, -1),
                pstun(-1, 1),
                pstun(-1, 0),
                pstun(-1, -1)];
    options.add_button(C, [...spin, ...spin, ...spin]);
    return{
        name: card_names.debilitating_confusion,
        pic: `${IMG_FOLDER.cards}debilitating_confusion.png`,
        options
    }
}