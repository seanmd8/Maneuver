// ----------------Cards.js----------------
// File containing the logic for each card.

// Keys:
//  name: the name of the card.
//  pic: the picture used to represent the card in game.
//  options: a ButtonGrid object containing info on which descriptions and onclick functionality the card's buttons should have.

// The current commands are:
//  [`move`, x, y]: moves the player relative to their position.
//  [`attack`, x, y]: attacks relative to the player's position.


// List of the options that can be given on level up.
const CARD_CHOICES = [
    short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, whack_horizontal, spin_attack, butterfly, 
    retreat, force, side_attack, clear_behind, spear_slice, 
    jab, overcome, hit_and_run, push_back, fork,
    explosion, breakthrough, flanking_diagonal, flanking_sideways, flanking_straight,
    pike, combat_diagonal, combat_horizontal, breakthrough_side, whack_diagonal,
    thwack, overcome_sideways, y_leap, diamond_slice, spearhead,
    alt_diagonal_left, alt_diagonal_right, alt_horizontal, alt_vertical, jab_diagonal
];

const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out
]

// Makes the starting deck
function make_starting_deck(){
    deck = new MoveDeck();

    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(slice());
    deck.add(slice());
    deck.add(short_charge());
    deck.add(jump());

    deck.deal();
    return deck;
}
// Makes a deck for testing new cards.
function make_test_deck(){
    deck = new MoveDeck();
    var start = 40;
    for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
        deck.add(CARD_CHOICES[i]());
    }
    deck.add(basic_horizontal());
    deck.deal();
    return deck;
}

// basic_horizontal,  basic_diagonal, and slice are unique to the starting deck.
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1]]);
    options.add_button(E, [[`move`, 1, 0]]);
    options.add_button(S, [[`move`, 0, 1]]);
    options.add_button(W, [[`move`, -1, 0]]);
    return{
        name: `basic horizontal`,
        pic: `${img_folder.cards}basic_horizontal.png`,
        options
    }
}
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1]]);
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `basic diagonal`,
        pic: `${img_folder.cards}basic_diagonal.png`,
        options
    }
}
function slice(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1]]);
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, 0], [`attack`, 1, -1]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, 0], [`attack`, -1, -1]]);
    return{
        name: `slice`,
        pic: `${img_folder.cards}slice.png`,
        options
    }
}
function short_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`attack`, 0, -1]]);
    options.add_button(E, [[`move`, 1, 0], [`attack`, 1, 0]]);
    options.add_button(S, [[`move`, 0, 1], [`attack`, 0, 1]]);
    options.add_button(W, [[`move`, -1, 0], [`attack`, -1, 0]]);
    return{
        name: `short charge`,
        pic: `${img_folder.cards}short_charge.png`,
        options
    }
}
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -2]]);
    options.add_button(E, [[`move`, 2, 0]]);
    options.add_button(S, [[`move`, 0, 2]]);
    options.add_button(W, [[`move`, -2, 0]]);
    return{
        name: `jump`,
        pic: `${img_folder.cards}jump.png`,
        options
    }
}

function straight_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`move`, 0, -1], [`attack`, 0, -1]]);
    options.add_button(S, [[`move`, 0, 1], [`move`, 0, 1], [`attack`, 0, 1]]);
    return{
        name: `straight charge`,
        pic: `${img_folder.cards}straight_charge.png`,
        options
    }
}
function side_charge(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0], [`move`, 1, 0], [`attack`, 1, 0]]);
    options.add_button(W, [[`move`, -1, 0], [`move`, -1, 0], [`attack`, -1, 0]]);
    return{
        name: `side charge`,
        pic: `${img_folder.cards}side_charge.png`,
        options
    }
}
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(W, [[`move`, -1, 0], [`move`, -1, 0]]);
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `step left`,
        pic: `${img_folder.cards}step_left.png`,
        options
    }
}
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(E, [[`move`, 1, 0], [`move`, 1, 0]]);
    options.add_button(NE, [[`move`, 1, -1]]);
    return{
        name: `step right`,
        pic: `${img_folder.cards}step_right.png`,
        options
    }
}
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, -2], [`move`, 1, -2]]);
    options.add_button(NW, [[`attack`, -1, -2], [`move`, -1, -2]]);
    return{
        name: `trample`,
        pic: `${img_folder.cards}trample.png`,
        options
    }
}
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 2, -1]]);
    options.add_button(SE, [[`move`, 2, 1]]);
    options.add_button(SW, [[`move`, -2, 1]]);
    options.add_button(NW, [[`move`, -2, -1]]);
    return{
        name: `horsemanship`,
        pic: `${img_folder.cards}horsemanship.png`,
        options
    }
}
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(NW, [[`move`, -1, -1], [`move`, -1, -1], [`attack`, -1, -1]]);
    return{
        name: `lunge left`,
        pic: `${img_folder.cards}lunge_left.png`,
        options
    }
}
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NE, [[`move`, 1, -1], [`move`, 1, -1], [`attack`, 1, -1]]);
    return{
        name: `lunge right`,
        pic: `${img_folder.cards}lunge_right.png`,
        options
    }
}
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`move`, 0, -1], [`move`, 0, -1]]);
    return{
        name: `sprint`,
        pic: `${img_folder.cards}sprint.png`,
        options
    }
}
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -2], [`attack`, 0, -2], [`attack`, -1, -2]]);
    options.add_button(E, [[`attack`, 2, 1], [`attack`, 2, 0], [`attack`, 2, -1]]);
    options.add_button(W, [[`attack`, -2, 1], [`attack`, -2, 0], [`attack`, -2, -1]]);
    return{
        name: `trident`,
        pic: `${img_folder.cards}trident.png`,
        options
    }
}
function whack_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`attack`, 0, -1]]);
    options.add_button(E, [[`attack`, 1, 0], [`attack`, 1, 0]]);
    options.add_button(S, [[`attack`, 0, 1], [`attack`, 0, 1]]);
    options.add_button(W, [[`attack`, -1, 0], [`attack`, -1, 0]]);
    return{
        name: `whack horizontal`,
        pic: `${img_folder.cards}whack_horizontal.png`,
        options
    }
}
function spin_attack(){
    var options = new ButtonGrid();
    var spin = [[`attack`, 1, 1],
                [`attack`, 1, 0],
                [`attack`, 1, -1],
                [`attack`, 0, 1],
                [`attack`, 0, -1],
                [`attack`, -1, 1],
                [`attack`, -1, 0],
                [`attack`, -1, -1]]
    options.add_button(`Spin`, spin, 5);
    return{
        name: `spin attack`,
        pic: `${img_folder.cards}spin_attack.png`,
        options
    }
}
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 2, -2]]);
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NW, [[`move`, -2, -2]]);
    return{
        name: `butterfly`,
        pic: `${img_folder.cards}butterfly.png`,
        options
    }
}
function retreat(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(S, [[`move`, 0, 1], [`move`, 0, 1], [`move`, 0, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    return{
        name: `retreat`,
        pic: `${img_folder.cards}retreat.png`,
        options
    }
}
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`move`, 0, -1], [`attack`, 0, -1], [`move`, 0, -1]]);
    return{
        name: `force`,
        pic: `${img_folder.cards}force.png`,
        options
    }
}
function side_attack(){
    var options = new ButtonGrid();
    options.add_button(E, [[`attack`, 1, 0], [`attack`, 2, 0], [`attack`, 3, 0]]);
    options.add_button(W, [[`attack`, -1, 0], [`attack`, -2, 0], [`attack`, -3, 0]]);
    return{
        name: `side attack`,
        pic: `${img_folder.cards}side_attack.png`,
        options
    }
}
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(C, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1], [`attack`, 1, 2], [`attack`, 0, 2], [`attack`, -1, 2]]);
    return{
        name: `clear behind`,
        pic: `${img_folder.cards}clear_behind.png`,
        options
    }
}
function spear_slice(){
    var options = new ButtonGrid();
    options.add_button(C, [[`attack`, 1, -1], [`attack`, -1, -1], [`attack`, 1, -2], [`attack`, 0, -2], [`attack`, -1, -2]]);
    return{
        name: `spear slice`,
        pic: `${img_folder.cards}spear_slice.png`,
        options
    }
}
function jab(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`attack`, 0, -2]]);
    options.add_button(E, [[`attack`, 1, 0], [`attack`, 2, 0]]);
    options.add_button(S, [[`attack`, 0, 1], [`attack`, 0, 2]]);
    options.add_button(W, [[`attack`, -1, 0], [`attack`, -2, 0]]);
    return{
        name: `jab`,
        pic: `${img_folder.cards}jab.png`,
        options
    }
}
function overcome(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1], [`move`, 0, -2]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1], [`move`, 0, 2]]);
    return{
        name: `overcome`,
        pic: `${img_folder.cards}overcome.png`,
        options
    }
}
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1], [`attack`, 1, 0], [`attack`, -1, 0], [`move`, 0, 1]]);
    return{
        name: `hit and run`,
        pic: `${img_folder.cards}hit_and_run.png`,
        options
    }
}
function combat_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, -1], [`move`, 1, -1]]);
    options.add_button(SE, [[`attack`, 1, 1], [`move`, 1, 1]]);
    options.add_button(SW, [[`attack`, -1, 1], [`move`, -1, 1]]);
    options.add_button(NW, [[`attack`, -1, -1], [`move`, -1, -1]]);
    return{
        name: `combat diagonal`,
        pic: `${img_folder.cards}combat_diagonal.png`,
        options
    }
}
function combat_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`move`, 0, -1]]);
    options.add_button(E, [[`attack`, 1, 0], [`move`, 1, 0]]);
    options.add_button(S, [[`attack`, 0, 1], [`move`, 0, 1]]);
    options.add_button(W, [[`attack`, -1, 0], [`move`, -1, 0]]);
    return{
        name: `combat horizontal`,
        pic: `${img_folder.cards}combat_horizontal.png`,
        options
    }
}
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`attack`, -1, -1], [`move`, 1, 1]]);
    options.add_button(S, [[`attack`, 0, -1], [`move`, 0, 1]]);
    options.add_button(SW, [[`attack`, 1, -1], [`move`, -1, 1]]);
    return{
        name: `push back`,
        pic: `${img_folder.cards}push_back.png`,
        options
    }
}
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, -1, -1], [`attack`, 1, -2], [`attack`, -1, -2]]);
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, -1], [`attack`, 2, 1], [`attack`, 2, -1]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, -1, 1], [`attack`, 1, 2], [`attack`, -1, 2]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, -1], [`attack`, -2, 1], [`attack`, -2, -1]]);
    return{
        name: `fork`,
        pic: `${img_folder.cards}fork.png`,
        options
    }
}
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push([`attack`, i, j]);
        }
    }
    var options = new ButtonGrid();
    options.add_button(`Explode!`, area, 5);
    return{
        name: `explosion`,
        pic: `${img_folder.cards}explosion.png`,
        options
    }
}
function breakthrough(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`attack`, 1, 0], [`attack`, -1, 0], [`attack`, 0, -1]]);
    return{
        name: `breakthrough`,
        pic: `${img_folder.cards}breakthrough.png`,
        options
    }
}
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1], [`attack`, 0, 1], [`attack`, -1, 0], [`move`, 1, -1], [`attack`, 0, 1], [`attack`, -1, 0]]);
    options.add_button(NW, [[`move`, -1, -1], [`attack`, 0, 1], [`attack`, 1, 0], [`move`, -1, -1], [`attack`, 0, 1], [`attack`, 1, 0]]);
    return{
        name: `flanking diagonal`,
        pic: `${img_folder.cards}flanking_diagonal.png`,
        options
    }
}
function flanking_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0], [`attack`, 0, 1], [`attack`, 0, -1], [`move`, 1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    options.add_button(W, [[`move`, -1, 0], [`attack`, 0, 1], [`attack`, 0, -1], [`move`, -1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    return{
        name: `flanking sideways`,
        pic: `${img_folder.cards}flanking_sideways.png`,
        options
    }
}
function flanking_straight(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`attack`, 1, 0], [`attack`, -1, 0], [`move`, 0, -1], [`attack`, 1, 0], [`attack`, -1, 0]]);
    options.add_button(S, [[`move`, 0, 1], [`attack`, 1, 0], [`attack`, -1, 0], [`move`, 0, 1], [`attack`, 1, 0], [`attack`, -1, 0]]);
    return{
        name: `flanking straight`,
        pic: `${img_folder.cards}flanking_straight.png`,
        options
    }
}
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -2], [`attack`, 1, -3], [`attack`, 0, -3], [`attack`, -1, -3]]);
    options.add_button(E, [[`attack`, 2, 0], [`attack`, 3, 1], [`attack`, 3, 0], [`attack`, 3, -1]]);
    options.add_button(W, [[`attack`, -2, 0], [`attack`, -3, 1], [`attack`, -3, 0], [`attack`, -3, -1]]);
    return{
        name: `pike`,
        pic: `${img_folder.cards}pike.png`,
        options
    }
}
function breakthrough_side(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0], [`attack`, 1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    options.add_button(W, [[`move`, -1, 0], [`attack`, -1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    return{
        name: `breakthrough side`,
        pic: `${img_folder.cards}breakthrough_side.png`,
        options
    }
}
function whack_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NW, [[`attack`, -1, -1], [`attack`, -1, -1]]);
    options.add_button(NE, [[`attack`, 1, -1], [`attack`, 1, -1]]);
    options.add_button(SE, [[`attack`, 1, 1], [`attack`, 1, 1]]);
    options.add_button(SW, [[`attack`, -1, 1], [`attack`, -1, 1]]);
    return{
        name: `whack diagonal`,
        pic: `${img_folder.cards}whack_diagonal.png`,
        options
    }
}
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`attack`, 0, -1], [`attack`, 0, -1]]);
    return{
        name: `thwack`,
        pic: `${img_folder.cards}thwack.png`,
        options
    }
}
function overcome_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, 0], [`attack`, 1, -1], [`move`, 2, 0]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, 0], [`attack`, -1, -1], [`move`, -2, 0]]);
    return{
        name: `overcome sideways`,
        pic: `${img_folder.cards}overcome_sideways.png`,
        options
    }
}
function y_leap(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 2, -2]]);
    options.add_button(NW, [[`move`, -2, -2]]);
    options.add_button(S, [[`move`, 0, 2]]);
    return{
        name: `Y leap`,
        pic: `${img_folder.cards}y_leap.png`,
        options
    }
}
function diamond_slice(){
    var options = new ButtonGrid();
    var spin = [[`attack`, 1, 1],
                [`attack`, 2, 0],
                [`attack`, 1, -1],
                [`attack`, 0, 2],
                [`attack`, 0, -2],
                [`attack`, -1, 1],
                [`attack`, -2, 0],
                [`attack`, -1, -1]]
    options.add_button(`Spin`, spin, 5);
    return{
        name: `diamond slice`,
        pic: `${img_folder.cards}diamond_slice.png`,
        options
    }
}
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1], [`attack`, 1, -1], [`attack`, 1, 0], [`attack`, 0, -1]]);
    options.add_button(NW, [[`move`, -1, -1], [`attack`, -1, -1], [`attack`, -1, 0], [`attack`, 0, -1]]);
    return{
        name: `spearhead`,
        pic: `${img_folder.cards}spearhead.png`,
        options
    }
}
function alt_diagonal_left(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, 0], [`attack`, 1, -1], [`attack`, 0, -1]]);
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(SW, [[`attack`, -1, 0], [`attack`, -1, 1], [`attack`, 0, 1]]);
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `alternating diagonal left`,
        pic: `${img_folder.cards}alt_diagonal_left.png`,
        options
    }
}
function alt_diagonal_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1]]);
    options.add_button(SE, [[`attack`, 1, 0], [`attack`, 1, 1], [`attack`, 0, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NW, [[`attack`, -1, 0], [`attack`, -1, -1], [`attack`, 0, -1]]);
    return{
        name: `alternating diagonal right`,
        pic: `${img_folder.cards}alt_diagonal_right.png`,
        options
    }
}
function alt_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1]]);
    options.add_button(E, [[`move`, 1, 0]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1]]);
    options.add_button(W, [[`move`, -1, 0]]);
    return{
        name: `alternating horizontal`,
        pic: `${img_folder.cards}alt_horizontal.png`,
        options
    }
}
function alt_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1]]);
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, 0], [`attack`, 1, -1]]);
    options.add_button(S, [[`move`, 0, 1]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, 0], [`attack`, -1, -1]]);
    return{
        name: `alternating vertical`,
        pic: `${img_folder.cards}alt_vertical.png`,
        options
    }
}
function jab_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, -1], [`attack`, 2, -2]]);
    options.add_button(SE, [[`attack`, 1, 1], [`attack`, 2, 2]]);
    options.add_button(SW, [[`attack`, -1, 1], [`attack`, -2, 2]]);
    options.add_button(NW, [[`attack`, -1, -1], [`attack`, -2, -2]]);
    return{
        name: `jab_diagonal`,
        pic: `${img_folder.cards}jab_diagonal.png`,
        options
    }
}

// Cards given to the player as debuffs
function stumble_w(){
    var options = new ButtonGrid();
    options.add_button(W, [[`move`, -1, 0]]);
    return{
        name: `stumble west`,
        pic: `${img_folder.cards}stumble_w.png`,
        options
    }
}
function stumble_e(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0]]);
    return{
        name: `stumble east`,
        pic: `${img_folder.cards}stumble_e.png`,
        options
    }
}
function stumble_n(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1]]);
    return{
        name: `stumble north`,
        pic: `${img_folder.cards}stumble_n.png`,
        options
    }
}
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [[`move`, 0, 1]]);
    return{
        name: `stumble south`,
        pic: `${img_folder.cards}stumble_s.png`,
        options
    }
}
function stumble_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `stumble nw`,
        pic: `${img_folder.cards}stumble_nw.png`,
        options
    }
}
function stumble_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1]]);
    return{
        name: `stumble ne`,
        pic: `${img_folder.cards}stumble_ne.png`,
        options
    }
}
function stumble_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    return{
        name: `stumble se`,
        pic: `${img_folder.cards}stumble_se.png`,
        options
    }
}
function stumble_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [[`move`, -1, 1]]);
    return{
        name: `stumble sw`,
        pic: `${img_folder.cards}stumble_sw.png`,
        options
    }
}
function freeze_up(){
    var options = new ButtonGrid();
    options.add_button(`Freeze Up`, [], 5);
    return{
        name: `freeze up`,
        pic: `${img_folder.cards}freeze_up.png`,
        options
    }
}
function lash_out(){
    var options = new ButtonGrid();
    var spin = [[`attack`, 1, 1],
                [`attack`, 1, 0],
                [`attack`, 1, -1],
                [`attack`, 0, 1],
                [`attack`, 0, 0],
                [`attack`, 0, -1],
                [`attack`, -1, 1],
                [`attack`, -1, 0],
                [`attack`, -1, -1]]
    options.add_button(`Lash Out`, spin, 5);
    return{
        name: `lash out`,
        pic: `${img_folder.cards}lash_out.png`,
        options
    }
}

