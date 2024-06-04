// ----------------young_dragon_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the young dragon.

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
        name: `firebreathing vertical`,
        pic: `${IMG_FOLDER.cards}firebreathing_vertical.png`,
        options
    }
}
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
        name: `firebreathing ne`,
        pic: `${IMG_FOLDER.cards}firebreathing_ne.png`,
        options
    }
}
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
/** @type {CardGenerator}*/
function glide(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(E, [pmove(3, 0)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    options.add_button(W, [pmove(-3, 0)]);
    options.add_button(SW, [pmove(-2, 1)]);
    return{
        name: `glide`,
        pic: `${IMG_FOLDER.cards}glide.png`,
        options
    }
}
/** @type {CardGenerator}*/
function soar(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(3, -1)]);
    options.add_button(SE, [pmove(3, 1)]);
    options.add_button(NW, [pmove(-3, -1)]);
    options.add_button(SW, [pmove(-3, 1)]);
    return{
        name: `soar`,
        pic: `${IMG_FOLDER.cards}soar.png`,
        options
    }
}
