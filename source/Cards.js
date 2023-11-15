// ----------------Cards.js----------------
// File containing the logic for each card.

// Keys:
//  name: the name of the card.
//  pic: the picture used to represent the card in game.
//  options: a ButtonGrid object containing info on which descriptions and onclick functionality the card's buttons should have.

// The current commands are:
//  ["move", x, y]: moves the player relative to their position.
//  ["attack", x, y]: attacks relative to the player's position.


// List of the options that can be given on level up.
const CARD_CHOICES = [short_charge, jump, straight_charge, side_charge, step_left, 
                    step_right, trample, horsemanship, lunge_left, lunge_right, 
                    sprint, trident, whack, spin_attack, butterfly, 
                    retreat, force, side_attack, clear_behind, spear_slice, 
                    jab, overcome, hit_and_run, v, push_back,
                    fork, explosion, breakthrough, flanking_diagonal, flanking_sideways,
                    flanking_straight, pike];

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
    var start = 30;
    for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
        deck.add(CARD_CHOICES[i]());
    }
    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.deal();
    return deck;
}

// basic_horizontal and basic_diagonal are unique to the starting deck.
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -1]]);
    options.add_button(E, [["move", 1, 0]]);
    options.add_button(S, [["move", 0, 1]]);
    options.add_button(W, [["move", -1, 0]]);
    return{
        name: "basic horizontal",
        pic: "basic_horizontal.png",
        options
    }
}
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [["move", 1, -1]]);
    options.add_button(SE, [["move", 1, 1]]);
    options.add_button(SW, [["move", -1, 1]]);
    options.add_button(NW, [["move", -1, -1]]);
    return{
        name: "basic diagonal",
        pic: "basic_diagonal.png",
        options
    }
}
function slice(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 1, -1], ["attack", 0, -1], ["attack", -1, -1]]);
    options.add_button(E, [["attack", 1, 1], ["attack", 1, 0], ["attack", 1, -1]]);
    options.add_button(S, [["attack", 1, 1], ["attack", 0, 1], ["attack", -1, 1]]);
    options.add_button(W, [["attack", -1, 1], ["attack", -1, 0], ["attack", -1, -1]]);
    return{
        name: "slice",
        pic: "slice.png",
        options
    }
}
function short_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -1], ["attack", 0, -1]]);
    options.add_button(E, [["move", 1, 0], ["attack", 1, 0]]);
    options.add_button(S, [["move", 0, 1], ["attack", 0, 1]]);
    options.add_button(W, [["move", -1, 0], ["attack", -1, 0]]);
    return{
        name: "short charge",
        pic: "short_charge.png",
        options
    }
}
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -2]]);
    options.add_button(E, [["move", 2, 0]]);
    options.add_button(S, [["move", 0, 2]]);
    options.add_button(W, [["move", -2, 0]]);
    return{
        name: "jump",
        pic: "jump.png",
        options
    }
}

function straight_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -1], ["move", 0, -1], ["attack", 0, -1]]);
    options.add_button(S, [["move", 0, 1], ["move", 0, 1], ["attack", 0, 1]]);
    return{
        name: "straight charge",
        pic: "straight_charge.png",
        options
    }
}
function side_charge(){
    var options = new ButtonGrid();
    options.add_button(E, [["move", 1, 0], ["move", 1, 0], ["attack", 1, 0]]);
    options.add_button(W, [["move", -1, 0], ["move", -1, 0], ["attack", -1, 0]]);
    return{
        name: "side charge",
        pic: "side_charge.png",
        options
    }
}
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [["move", -1, 1]]);
    options.add_button(W, [["move", -1, 0], ["move", -1, 0]]);
    options.add_button(NW, [["move", -1, -1]]);
    return{
        name: "step left",
        pic: "step_left.png",
        options
    }
}
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [["move", 1, 1]]);
    options.add_button(E, [["move", 1, 0], ["move", 1, 0]]);
    options.add_button(NE, [["move", 1, -1]]);
    return{
        name: "step right",
        pic: "step_right.png",
        options
    }
}
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [["attack", 1, -2], ["move", 1, -2]]);
    options.add_button(NW, [["attack", -1, -2], ["move", -1, -2]]);
    return{
        name: "trample",
        pic: "trample.png",
        options
    }
}
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [["move", 2, -1]]);
    options.add_button(SE, [["move", 2, 1]]);
    options.add_button(SW, [["move", -2, 1]]);
    options.add_button(NW, [["move", -2, -1]]);
    return{
        name: "horsemanship",
        pic: "horsemanship.png",
        options
    }
}
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [["move", 1, 1]]);
    options.add_button(NW, [["move", -1, -1], ["move", -1, -1], ["attack", -1, -1]]);
    return{
        name: "lunge left",
        pic: "lunge_left.png",
        options
    }
}
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [["move", -1, 1]]);
    options.add_button(NE, [["move", 1, -1], ["move", 1, -1], ["attack", 1, -1]]);
    return{
        name: "lunge right",
        pic: "lunge_right.png",
        options
    }
}
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -1], ["move", 0, -1], ["move", 0, -1]]);
    return{
        name: "sprint",
        pic: "sprint.png",
        options
    }
}
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 1, -2], ["attack", 0, -2], ["attack", -1, -2]]);
    options.add_button(E, [["attack", 2, 1], ["attack", 2, 0], ["attack", 2, -1]]);
    options.add_button(W, [["attack", -2, 1], ["attack", -2, 0], ["attack", -2, -1]]);
    return{
        name: "trident",
        pic: "trident.png",
        options
    }
}
function whack(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 0, -1], ["attack", 0, -1]]);
    options.add_button(E, [["attack", 1, 0], ["attack", 1, 0]]);
    options.add_button(S, [["attack", 0, 1], ["attack", 0, 1]]);
    options.add_button(W, [["attack", -1, 0], ["attack", -1, 0]]);
    return{
        name: "whack",
        pic: "whack.png",
        options
    }
}
function spin_attack(){
    var options = new ButtonGrid();
    var spin = [["attack", 1, 1],
                ["attack", 1, 0],
                ["attack", 1, -1],
                ["attack", 0, 1],
                ["attack", 0, -1],
                ["attack", -1, 1],
                ["attack", -1, 0],
                ["attack", -1, -1]]
    options.add_button("Spin", spin, 5);
    return{
        name: "spin attack",
        pic: "spin_attack.png",
        options
    }
}
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [["move", 2, -2]]);
    options.add_button(SE, [["move", 1, 1]]);
    options.add_button(SW, [["move", -1, 1]]);
    options.add_button(NW, [["move", -2, -2]]);
    return{
        name: "butterfly",
        pic: "butterfly.png",
        options
    }
}
function retreat(){
    var options = new ButtonGrid();
    options.add_button(SE, [["move", 1, 1]]);
    options.add_button(S, [["move", 0, 1], ["move", 0, 1], ["move", 0, 1]]);
    options.add_button(SW, [["move", -1, 1]]);
    return{
        name: "retreat",
        pic: "retreat.png",
        options
    }
}
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 0, -1], ["move", 0, -1], ["attack", 0, -1], ["move", 0, -1]]);
    return{
        name: "force",
        pic: "force.png",
        options
    }
}
function side_attack(){
    var options = new ButtonGrid();
    options.add_button(E, [["attack", 1, 0], ["attack", 2, 0], ["attack", 3, 0]]);
    options.add_button(W, [["attack", -1, 0], ["attack", -2, 0], ["attack", -3, 0]]);
    return{
        name: "side attack",
        pic: "side_attack.png",
        options
    }
}
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(C, [["attack", 1, 1], ["attack", 0, 1], ["attack", -1, 1], ["attack", 1, 2], ["attack", 0, 2], ["attack", -1, 2]]);
    return{
        name: "clear behind",
        pic: "clear_behind.png",
        options
    }
}
function spear_slice(){
    var options = new ButtonGrid();
    options.add_button(C, [["attack", 1, -1], ["attack", -1, -1], ["attack", 1, -2], ["attack", 0, -2], ["attack", -1, -2]]);
    return{
        name: "spear slice",
        pic: "spear_slice.png",
        options
    }
}
function jab(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 0, -1], ["attack", 0, -2]]);
    options.add_button(E, [["attack", 1, 0], ["attack", 2, 0]]);
    options.add_button(S, [["attack", 0, 1], ["attack", 0, 2]]);
    options.add_button(W, [["attack", -1, 0], ["attack", -2, 0]]);
    return{
        name: "jab",
        pic: "jab.png",
        options
    }
}
function overcome(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 1, -1], ["attack", 0, -1], ["attack", -1, -1], ["move", 0, -2]]);
    options.add_button(S, [["attack", 1, 1], ["attack", 0, 1], ["attack", -1, 1], ["move", 0, 2]]);
    return{
        name: "overcome",
        pic: "overcome.png",
        options
    }
}
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [["attack", 1, -1], ["attack", 0, -1], ["attack", -1, -1], ["move", 0, 1]]);
    return{
        name: "hit and run",
        pic: "hit_and_run.png",
        options
    }
}
function v(){
    var options = new ButtonGrid();
    options.add_button(NE, [["attack", 1, -1], ["move", 1, -1]]);
    options.add_button(NW, [["attack", -1, -1], ["move", -1, -1]]);
    return{
        name: "v",
        pic: "v.png",
        options
    }
}
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [["attack", -1, -1], ["move", 1, 1]]);
    options.add_button(SW, [["attack", 1, -1], ["move", -1, 1]]);
    return{
        name: "push back",
        pic: "push_back.png",
        options
    }
}
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 1, -1], ["attack", -1, -1], ["attack", 1, -2], ["attack", -1, -2]]);
    options.add_button(E, [["attack", 1, 1], ["attack", 1, -1], ["attack", 2, 1], ["attack", 2, -1]]);
    options.add_button(S, [["attack", 1, 1], ["attack", -1, 1], ["attack", 1, 2], ["attack", -1, 2]]);
    options.add_button(W, [["attack", -1, 1], ["attack", -1, -1], ["attack", -2, 1], ["attack", -2, -1]]);
    return{
        name: "fork",
        pic: "fork.png",
        options
    }
}
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(["attack", i, j]);
        }
    }
    var options = new ButtonGrid();
    options.add_button("Explode!", area, 5);
    return{
        name: "explosion",
        pic: "explosion.png",
        options
    }
}
function breakthrough(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -1], ["attack", 1, 0], ["attack", -1, 0], ["attack", 0, -1]]);
    return{
        name: "breakthrough",
        pic: "breakthrough.png",
        options
    }
}
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [["move", 1, -1], ["attack", 0, 1], ["attack", -1, 0], ["move", 1, -1], ["attack", 0, 1], ["attack", -1, 0]]);
    options.add_button(NW, [["move", -1, -1], ["attack", 0, 1], ["attack", 1, 0], ["move", -1, -1], ["attack", 0, 1], ["attack", 1, 0]]);
    return{
        name: "flanking diagonal",
        pic: "flanking_diagonal.png",
        options
    }
}
function flanking_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [["move", 1, 0], ["attack", 0, 1], ["attack", 0, -1], ["move", 1, 0], ["attack", 0, 1], ["attack", 0, -1]]);
    options.add_button(W, [["move", -1, 0], ["attack", 0, 1], ["attack", 0, -1], ["move", -1, 0], ["attack", 0, 1], ["attack", 0, -1]]);
    return{
        name: "flanking sideways",
        pic: "flanking_sideways.png",
        options
    }
}
function flanking_straight(){
    var options = new ButtonGrid();
    options.add_button(N, [["move", 0, -1], ["attack", 1, 0], ["attack", -1, 0], ["move", 0, -1], ["attack", 1, 0], ["attack", -1, 0]]);
    options.add_button(S, [["move", 0, 1], ["attack", 1, 0], ["attack", -1, 0], ["move", 0, 1], ["attack", 1, 0], ["attack", -1, 0]]);
    return{
        name: "flanking straight",
        pic: "flanking_straight.png",
        options
    }
}
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [["attack", 0, -2], ["attack", 1, -3], ["attack", 0, -3], ["attack", -1, -3]]);
    options.add_button(E, [["attack", 2, 0], ["attack", 3, 1], ["attack", 3, 0], ["attack", 3, -1]]);
    options.add_button(W, [["attack", -2, 0], ["attack", -3, 1], ["attack", -3, 0], ["attack", -3, -1]]);
    return{
        name: "pike",
        pic: "pike.png",
        options
    }
}