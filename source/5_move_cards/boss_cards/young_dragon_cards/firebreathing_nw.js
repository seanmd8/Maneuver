
/** @type {CardGenerator}*/
function firebreathing_nw(){
    var options = new ButtonGrid();

    var nw_cone_points = create_diagonal_cone(0, 3);
    var nw_cone = nw_cone_points.map((p) => pattack(p.x, p.y));
    var se_cone_points = create_diagonal_cone(180, 3);
    var se_cone = se_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(NW, nw_cone);
    options.add_button(SE, se_cone);
    return{
        name: `firebreathing nw`,
        pic: `${IMG_FOLDER.cards}firebreathing_nw.png`,
        options
    }
}