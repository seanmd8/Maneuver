/** @type {CardGenerator}*/
function firebreathing_vertical(){
    var options = new ButtonGrid();

    var n_cone_points = create_orthogonal_cone(0, 3);
    var n_cone = n_cone_points.map((p) => pattack(p.x, p.y));
    var s_cone_points = create_orthogonal_cone(180, 3);
    var s_cone = s_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(N, n_cone);
    options.add_button(S, s_cone);
    return{
        name: card_names.firebreathing_vertical,
        pic: `${IMG_FOLDER.cards}firebreathing_vertical.png`,
        options
    }
}