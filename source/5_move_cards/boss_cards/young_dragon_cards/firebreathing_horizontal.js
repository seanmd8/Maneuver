
/** @type {CardGenerator}*/
function firebreathing_horizontal(){
    var options = new ButtonGrid();

    var e_cone_points = create_orthogonal_cone(90, 3);
    var e_cone = e_cone_points.map((p) => pattack(p.x, p.y));
    var w_cone_points = create_orthogonal_cone(270, 3);
    var w_cone = w_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(E, e_cone);
    options.add_button(W, w_cone);
    return{
        name: `firebreathing horizontal`,
        pic: `${IMG_FOLDER.cards}firebreathing_horizontal.png`,
        options
    }
}