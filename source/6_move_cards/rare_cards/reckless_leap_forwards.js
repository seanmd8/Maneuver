/** @type {CardGenerator}*/
function reckless_leap_forwards (){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(N, [pstun(0, 0), pmove(0, -2), ...spin]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.reckless_leap_forwards,
        pic: `${IMG_FOLDER.cards}reckless_leap_forwards.png`,
        options
    }
}