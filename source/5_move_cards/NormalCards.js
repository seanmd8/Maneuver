// ----------------NormalCards.js----------------
// File containing both basic cards and all cards that can be gained from the shop.

// basic_horizontal,  basic_diagonal, and basic_slice are unique to the starting deck.
/** @type {CardGenerator}*/
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `basic horizontal`,
        pic: `${IMG_FOLDER.cards}basic_horizontal.png`,
        options,
        basic: true
    }
}
/** @type {CardGenerator}*/
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `basic diagonal`,
        pic: `${IMG_FOLDER.cards}basic_diagonal.png`,
        options,
        basic: true
    }
}
/** @type {CardGenerator}*/
function basic_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1)]);
    return{
        name: `basic slice`,
        pic: `${IMG_FOLDER.cards}basic_slice.png`,
        options,
        basic: true
    }
}
/** @type {CardGenerator}*/
function short_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: `short charge`,
        pic: `${IMG_FOLDER.cards}short_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: `jump`,
        pic: `${IMG_FOLDER.cards}jump.png`,
        options
    }
}

/** @type {CardGenerator}*/
function straight_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pattack(0, 1)]);
    return{
        name: `straight charge`,
        pic: `${IMG_FOLDER.cards}straight_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_charge(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: `side charge`,
        pic: `${IMG_FOLDER.cards}side_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `step left`,
        pic: `${IMG_FOLDER.cards}step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: `step right`,
        pic: `${IMG_FOLDER.cards}step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -2), pmove(1, -2)]);
    options.add_button(NW, [pattack(-1, -2), pmove(-1, -2)]);
    options.add_button(S, [pattack(0, 2), pmove(0, 2)]);
    return{
        name: `trample`,
        pic: `${IMG_FOLDER.cards}trample.png`,
        options
    }
}
/** @type {CardGenerator}*/
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    return{
        name: `horsemanship`,
        pic: `${IMG_FOLDER.cards}horsemanship.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: `lunge left`,
        pic: `${IMG_FOLDER.cards}lunge_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1), pmove(-1, 1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1), pattack(1, -1)]);
    return{
        name: `lunge right`,
        pic: `${IMG_FOLDER.cards}lunge_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    return{
        name: `sprint`,
        pic: `${IMG_FOLDER.cards}sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(2, 1), pattack(2, 0), pattack(2, -1)]);
    options.add_button(W, [pattack(-2, 1), pattack(-2, 0), pattack(-2, -1)]);
    options.add_button(S, [pattack(1, 2), pattack(0, 2), pattack(-1, 2)]);
    return{
        name: `trident`,
        pic: `${IMG_FOLDER.cards}trident.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spin_attack(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(SPIN, spin);
    return{
        name: `spin attack`,
        pic: `${IMG_FOLDER.cards}spin_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: `butterfly`,
        pic: `${IMG_FOLDER.cards}butterfly.png`,
        options
    }
}
/** @type {CardGenerator}*/
function retreat(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `retreat`,
        pic: `${IMG_FOLDER.cards}retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1), pattack(0, -1), pmove(0, -1)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1), pattack(0, 1), pmove(0, 1)]);
    return{
        name: `force`,
        pic: `${IMG_FOLDER.cards}force.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_attack(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(3, 0)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-3, 0)]);
    return{
        name: `side attack`,
        pic: `${IMG_FOLDER.cards}side_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(2, 1), pattack(1, 1), pattack(0, 1), pattack(-1, 1), pattack(-2, 1), 
                           pattack(2, 2), pattack(1, 2), pattack(0, 2), pattack(-1, 2), pattack(-2, 2)]);
    return{
        name: `clear behind`,
        pic: `${IMG_FOLDER.cards}clear_behind.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_in_front(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), 
                           pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    return{
        name: `clear in front`,
        pic: `${IMG_FOLDER.cards}clear_in_front.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -2), pattack(0, -1), pattack(0, -2)]);
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(1, 0), pattack(2, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 2), pattack(0, 1), pattack(0, 2)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-1, 0), pattack(-2, 0)]);
    return{
        name: `jab`,
        pic: `${IMG_FOLDER.cards}jab.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pmove(0, -2)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1), pmove(0, 2)]);
    return{
        name: `overcome`,
        pic: `${IMG_FOLDER.cards}overcome.png`,
        options
    }
}
/** @type {CardGenerator}*/
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0), pmove(0, 1)]);
    return{
        name: `hit and run`,
        pic: `${IMG_FOLDER.cards}hit_and_run.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1), pmove(-1, -1)]);
    return{
        name: `combat diagonal`,
        pic: `${IMG_FOLDER.cards}combat_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1)]);
    options.add_button(E, [pattack(1, 0), pmove(1, 0)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pmove(-1, 0)]);
    return{
        name: `combat horizontal`,
        pic: `${IMG_FOLDER.cards}combat_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack(-1, -1), pmove(1, 1)]);
    options.add_button(S, [pattack(0, -1), pmove(0, 1)]);
    options.add_button(SW, [pattack(1, -1), pmove(-1, 1)]);
    return{
        name: `push back`,
        pic: `${IMG_FOLDER.cards}push_back.png`,
        options
    }
}
/** @type {CardGenerator}*/
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(-1, -1), pattack(1, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(1, 1), pattack(1, -1), pattack(2, 1), pattack(2, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(-1, 1), pattack(1, 2), pattack(-1, 2)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, -1), pattack(-2, 1), pattack(-2, -1)]);
    return{
        name: `fork`,
        pic: `${IMG_FOLDER.cards}fork.png`,
        options
    }
}
/** @type {CardGenerator}*/
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(pattack(i, j));
        }
    }
    var options = new ButtonGrid();
    options.add_button(SPIN, area, 5);
    return{
        name: `explosion`,
        pic: `${IMG_FOLDER.cards}explosion.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    return{
        name: `breakthrough`,
        pic: `${IMG_FOLDER.cards}breakthrough.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(0, 1), pattack(-1, 0), pmove(1, -1), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1), pattack(0, 1), pattack(1, 0), pmove(-1, -1), pattack(0, 1), pattack(1, 0)]);
    return{
        name: `flanking diagonal`,
        pic: `${IMG_FOLDER.cards}flanking_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(0, 1), pattack(0, -1), pmove(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(0, 1), pattack(0, -1), pmove(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `flanking sideways`,
        pic: `${IMG_FOLDER.cards}flanking_sideways.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_straight(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pmove(0, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pmove(0, 1), pattack(1, 0), pattack(-1, 0)]);
    return{
        name: `flanking straight`,
        pic: `${IMG_FOLDER.cards}flanking_straight.png`,
        options
    }
}
/** @type {CardGenerator}*/
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -2), pattack(1, -3), pattack(0, -3), pattack(-1, -3)]);
    options.add_button(E, [pattack(2, 0), pattack(3, 1), pattack(3, 0), pattack(3, -1)]);
    options.add_button(W, [pattack(-2, 0), pattack(-3, 1), pattack(-3, 0), pattack(-3, -1)]);
    options.add_button(S, [pattack(0, 2), pattack(1, 3), pattack(0, 3), pattack(-1, 3)]);

    return{
        name: `pike`,
        pic: `${IMG_FOLDER.cards}pike.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough_side(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `breakthrough side`,
        pic: `${IMG_FOLDER.cards}breakthrough_side.png`,
        options
    }
}
/** @type {CardGenerator}*/
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1), pattack(0, -1)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1), pattack(0, 1)]);
    return{
        name: `thwack`,
        pic: `${IMG_FOLDER.cards}thwack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1), pmove(2, 0)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1), pmove(-2, 0)]);
    return{
        name: `overcome sideways`,
        pic: `${IMG_FOLDER.cards}overcome_sideways.png`,
        options
    }
}
/** @type {CardGenerator}*/
function y_leap(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(S, [pmove(0, 2)]);
    return{
        name: `Y leap`,
        pic: `${IMG_FOLDER.cards}y_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_slice(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(2, 0),
                pattack(1, -1),
                pattack(0, 2),
                pattack(0, -2),
                pattack(-1, 1),
                pattack(-2, 0),
                pattack(-1, -1)]
    options.add_button(SPIN, spin);
    return{
        name: `diamond slice`,
        pic: `${IMG_FOLDER.cards}diamond_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    return{
        name: `spearhead`,
        pic: `${IMG_FOLDER.cards}spearhead.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_diagonal_left(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, 0), pattack(1, -1), pattack(2, -2), pattack(0, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 0), pattack(-1, 1), pattack(-2, 2), pattack(0, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `alternating diagonal left`,
        pic: `${IMG_FOLDER.cards}alt_diagonal_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_diagonal_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 0), pattack(1, 1), pattack(2, 2), pattack(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, 0), pattack(-1, -1), pattack(-2, -2), pattack(0, -1)]);
    return{
        name: `alternating diagonal right`,
        pic: `${IMG_FOLDER.cards}alt_diagonal_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(0, -2), pattack(-1, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(0, 2), pattack(-1, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `alternating horizontal`,
        pic: `${IMG_FOLDER.cards}alt_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(2, 0), pattack(1, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-2, 0), pattack(-1, -1)]);
    return{
        name: `alternating vertical`,
        pic: `${IMG_FOLDER.cards}alt_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pattack(2, -2), pattack(1, -1), pattack(2, -2)]);
    options.add_button(SE, [pattack(1, 1), pattack(2, 2), pattack(1, 1), pattack(2, 2)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-2, 2), pattack(-1, 1), pattack(-2, 2)]);
    options.add_button(NW, [pattack(-1, -1), pattack(-2, -2), pattack(-1, -1), pattack(-2, -2)]);
    return{
        name: `jab_diagonal`,
        pic: `${IMG_FOLDER.cards}jab_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_attack(){
    var options = new ButtonGrid();
    options.add_button(SPIN, [pattack(0, -1), pattack(1, 0), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `diamond attack`,
        pic: `${IMG_FOLDER.cards}diamond_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slice_twice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(1, -1), pattack(0, -1), pattack(0, -1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: `slice twice`,
        pic: `${IMG_FOLDER.cards}slice_twice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function advance(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `advance`,
        pic: `${IMG_FOLDER.cards}advance.png`,
        options
    }
}
/** @type {CardGenerator}*/
function bounding_retreat(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(SE, [pmove(2, 2), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2), pmove(-1, 1)]);
    return{
        name: `bounding retreat`,
        pic: `${IMG_FOLDER.cards}bounding_retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function leap_left(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(W, [pmove(-2, 0)]);
    options.add_button(SW, [pmove(-2, 2)]);

    return{
        name: `leap left`,
        pic: `${IMG_FOLDER.cards}leap_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function leap_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(SE, [pmove(2, 2)]);
    return{
        name: `leap right`,
        pic: `${IMG_FOLDER.cards}leap_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function short_charge_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pmove(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pmove(-1, 1), pattack(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: `short charge diagonal`,
        pic: `${IMG_FOLDER.cards}short_charge_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_sprint(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: `side sprint`,
        pic: `${IMG_FOLDER.cards}side_sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_forwards(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1), pattack(1, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: `slash step forwards`,
        pic: `${IMG_FOLDER.cards}slash_step_forwards.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, -1), pattack(0, 1), 
                           pattack(0, -1), pattack(1, 1), pattack(1, -1),]);
    return{
        name: `slash step left`,
        pic: `${IMG_FOLDER.cards}slash_step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_right(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(1, 1), pattack(1, -1), pattack(0, 1), 
                           pattack(0, -1), pattack(-1, 1), pattack(-1, -1)]);
    return{
        name: `slash step right`,
        pic: `${IMG_FOLDER.cards}slash_step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slip_through_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pattack(0, 1), pattack(1, 0), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pattack(0, -1), pattack(-1, 0), pmove(-1, -1)]);
    return{
        name: `slip through ne`,
        pic: `${IMG_FOLDER.cards}slip_through_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slip_through_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(0, -1), pattack(1, 0), pmove(1, -1)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pattack(0, 1), pattack(-1, 0), pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: `slip through nw`,
        pic: `${IMG_FOLDER.cards}slip_through_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function dash_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, -0)]);
    return{
        name: `dash ne`,
        pic: `${IMG_FOLDER.cards}dash_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function dash_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, -0)]);
    return{
        name: `dash nw`,
        pic: `${IMG_FOLDER.cards}dash_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(1, -1), pattack(1, -1), pstun(0, -1), pattack(0, -1), pstun(-1, -1), pattack(-1, -1)]);
    options.add_button(E, [pstun(1, 1), pattack(1, 1), pstun(1, 0), pattack(1, 0), pstun(1, -1), pattack(1, -1)]);
    options.add_button(S, [pstun(1, 1), pattack(1, 1), pstun(0, 1), pattack(0, 1), pstun(-1, 1), pattack(-1, 1)]);
    options.add_button(W, [pstun(-1, 1), pattack(-1, 1), pstun(-1, 0), pattack(-1, 0), pstun(-1, -1), pattack(-1, -1)]);
    return{
        name: `stunning_slice`,
        pic: `${IMG_FOLDER.cards}stunning_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_leap(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2), ...spin]);
    options.add_button(S, [pmove(0, 2), ...spin]);
    return{
        name: `stunning_leap`,
        pic: `${IMG_FOLDER.cards}stunning_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_side_leap(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(E, [pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-2, 0), ...spin]);
    return{
        name: `stunning_side_leap`,
        pic: `${IMG_FOLDER.cards}stunning_side_leap.png`,
        options
    }
}