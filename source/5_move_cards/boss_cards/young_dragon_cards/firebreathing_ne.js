
/** @type {CardGenerator}*/
function firebreathing_ne(){
    var options = new ButtonGrid();

    var ne_cone_points = create_diagonal_cone(90, 3);
    var ne_cone = ne_cone_points.map((p) => pattack(p.x, p.y));
    var sw_cone_points = create_diagonal_cone(270, 3);
    var sw_cone = sw_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(NE, ne_cone);
    options.add_button(SW, sw_cone);
    return{
        name: card_names.firebreathing_ne,
        pic: `${IMG_FOLDER.cards}firebreathing_ne.png`,
        options
    }
}