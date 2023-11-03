const CARD_CHOICES = [short_charge, jump, straight_charge, side_charge, step_left, 
                    step_right, trample, horsemanship, lunge_left, lunge_right, 
                    sprint, trident, whack, spin_attack, butterfly, 
                    retreat, force, side_attack, clear_behind, spear_slice, 
                    jab, overcome, hit_and_run, v, push_back,
                    fork, explosion, breakthrough, flanking_diagonal, flanking_sideways,
                    flanking_straight, pike];

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

function basic_horizontal(){
    return{
        name: "basic horizontal",
        pic: "basic_horizontal.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["move", 0, -1]],
            [["move", 1, 0]],
            [["move", 0, 1]],
            [["move", -1, 0]]
            
        ]
    }
}
function basic_diagonal(){
    return{
        name: "basic diagonal",
        pic: "basic_diagonal.png",
        id: "",
        descriptions: [
            "NE",
            "SE",
            "SW",
            "NW"
        ],
        behavior: [
            [["move", 1, -1]],
            [["move", 1, 1]],
            [["move", -1, 1]],
            [["move", -1, -1]]
            
        ]
    }
}
function slice(){
    return{
        name: "slice",
        pic: "slice.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 1, -1],
            ["attack", 0, -1],
            ["attack", -1, -1]],

            [["attack", 1, 1],
            ["attack", 1, 0],
            ["attack", 1, -1]],

            [["attack", 1, 1],
            ["attack", 0, 1],
            ["attack", -1, 1]],

            [["attack", -1, 1],
            ["attack", -1, 0],
            ["attack", -1, -1]]  
        ]
    }
}
function short_charge(){
    return{
        name: "short charge",
        pic: "short_charge.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["move", 0, -1],
            ["attack", 0, -1]],

            [["move", 1, 0],
            ["attack", 1, 0]],

            [["move", 0, 1],
            ["attack", 0, 1]],

            [["move", -1, 0],
            ["attack", -1, 0]]
        ]
    }
}
function jump(){
    return{
        name: "jump",
        pic: "jump.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["move", 0, -2]],
            [["move", 2, 0]],
            [["move", 0, 2]],
            [["move", -2, 0]]
        ]
    }
}

function straight_charge(){
    return{
        name: "straight charge",
        pic: "straight_charge.png",
        id: "",
        descriptions: [
            "N",
            "S"
        ],
        behavior: [
            [["move", 0, -1],
            ["move", 0, -1],
            ["attack", 0, -1]],

            [["move", 0, 1],
            ["move", 0, 1],
            ["attack", 0, 1]]
        ]
    }
}
function side_charge(){
    return{
        name: "side charge",
        pic: "side_charge.png",
        id: "",
        descriptions: [
            "E",
            "W"
        ],
        behavior: [
            [["move", 1, 0],
            ["move", 1, 0],
            ["attack", 1, 0]],

            [["move", -1, 0],
            ["move", -1, 0],
            ["attack", -1, 0]]
        ]
    }
}
function step_left(){
    return{
        name: "step left",
        pic: "step_left.png",
        id: "",
        descriptions: [
            "NW",
            "W",
            "SW"
        ],
        behavior: [
            [["move", -1, -1]],
            [["move", -1, 0],
            ["move", -1, 0]],
            [["move", -1, 1]]
        ]
    }
}
function step_right(){
    return{
        name: "step right",
        pic: "step_right.png",
        id: "",
        descriptions: [
            "NE",
            "E",
            "SE"
        ],
        behavior: [
            [["move", 1, -1]],
            [["move", 1, 0],
            ["move", 1, 0]],
            [["move", 1, 1]]
        ]
    }
}
function trample(){
    return{
        name: "trample",
        pic: "trample.png",
        id: "",
        descriptions: [
            "NE",
            "NW"
        ],
        behavior: [
            [["attack", 1, -2],
            ["move", 1, -2]],

            [["attack", -1, -2],
            ["move", -1, -2]]
        ]
    }
}
function horsemanship(){
    return{
        name: "horsemanship",
        pic: "horsemanship.png",
        id: "",
        descriptions: [
            "NE",
            "SE",
            "SW",
            "NW"
        ],
        behavior: [
            [["move", 2, -1]],
            [["move", 2, 1]],
            [["move", -2, 1]],
            [["move", -2, -1]]
            
        ]
    }
}
function lunge_left(){
    return{
        name: "lunge left",
        pic: "lunge_left.png",
        id: "",
        descriptions: [
            "SE",
            "NW"
        ],
        behavior: [
            [["move", 1, 1]],

            [["move", -1, -1],
            ["move", -1, -1],
            ["attack", -1, -1]]
            
        ]
    }
}
function lunge_right(){
    return{
        name: "lunge right",
        pic: "lunge_right.png",
        id: "",
        descriptions: [
            "SW",
            "NE"
        ],
        behavior: [
            [["move", -1, 1]],

            [["move", 1, -1],
            ["move", 1, -1],
            ["attack", 1, -1]]
            
        ]
    }
}
function sprint(){
    return{
        name: "sprint",
        pic: "sprint.png",
        id: "",
        descriptions: [
            "N"
        ],
        behavior: [
            [["move", 0, -1],
            ["move", 0, -1],
            ["move", 0, -1]]
        ]
    }
}
function trident(){
    return{
        name: "trident",
        pic: "trident.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "W"
        ],
        behavior: [
            [["attack", 1, -2],
            ["attack", 0, -2],
            ["attack", -1, -2]],

            [["attack", 2, 1],
            ["attack", 2, 0],
            ["attack", 2, -1]],

            [["attack", -2, 1],
            ["attack", -2, 0],
            ["attack", -2, -1]]
            
        ]
    }
}
function whack(){
    return{
        name: "whack",
        pic: "whack.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 0, -1],
            ["attack", 0, -1]],

            [["attack", 1, 0],
            ["attack", 1, 0]],

            [["attack", 0, 1],
            ["attack", 0, 1]],

            [["attack", -1, 0],
            ["attack", -1, 0]]
            
        ]
    }
}
function spin_attack(){
    return{
        name: "spin attack",
        pic: "spin_attack.png",
        id: "",
        descriptions: ["spin"],
        behavior: [
            [["attack", 1, 1],
            ["attack", 1, 0],
            ["attack", 1, -1],
            ["attack", 0, 1],
            ["attack", 0, -1],
            ["attack", -1, 1],
            ["attack", -1, 0],
            ["attack", -1, -1]]
        ]
    }
}
function butterfly(){
    return{
        name: "butterfly",
        pic: "butterfly.png",
        id: "",
        descriptions: [
            "NE",
            "SE",
            "SW",
            "NW"
   
        ],
        behavior: [
            [["move", 2, -2]],
            [["move", 1, 1]],
            [["move", -1, 1]],
            [["move", -2, -2]]
        ]
    }
}
function retreat(){
    return{
        name: "retreat",
        pic: "retreat.png",
        id: "",
        descriptions: [
            "SE", 
            "S",
            "SW"
        ],
        behavior: [
            [["move", 1, 1]],

            [["move", 0, 1],
            ["move", 0, 1],
            ["move", 0, 1]],

            [["move", -1, 1]]
        ]
    }
}
function force(){
    return{
        name: "force",
        pic: "force.png",
        id: "",
        descriptions: [
            "N",
        ],
        behavior: [
            [["attack", 0, -1],
            ["move", 0, -1],
            ["attack", 0, -1],
            ["move", 0, -1]]
        ]
    }
}
function side_attack(){
    return{
        name: "side attack",
        pic: "side_attack.png",
        id: "",
        descriptions: [
            "E",
            "W"
        ],
        behavior: [
            [["attack", 1, 0],
            ["attack", 2, 0],
            ["attack", 3, 0],],

            [["attack", -1, 0],
            ["attack", -2, 0],
            ["attack", -3, 0]]
        ]
    }
}
function clear_behind(){
    return{
        name: "clear behind",
        pic: "clear_behind.png",
        id: "",
        descriptions: [
            "S"
        ],
        behavior: [
            [["attack", 1, 1],
            ["attack", 0, 1],
            ["attack", -1, 1],
            ["attack", 1, 2],
            ["attack", 0, 2],
            ["attack", -1, 2]]
        ]
    }
}
function spear_slice(){
    return{
        name: "spear slice",
        pic: "spear_slice.png",
        id: "",
        descriptions: [
            "N", 
        ],
        behavior: [
            [["attack", 1, -2],
            ["attack", 1, -1],
            ["attack", 0, -2],
            ["attack", -1, -2],
            ["attack", -1, -1]]
        ]
    }
}
function jab(){
    return{
        name: "jab",
        pic: "jab.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 0, -1],
            ["attack", 0, -2]],

            [["attack", 1, 0],
            ["attack", 2, 0]],

            [["attack", 0, 1],
            ["attack", 0, 2]],

            [["attack", -1, 0],
            ["attack", -2, 0]]
        ]
    }
}
function overcome(){
    return{
        name: "overcome",
        pic: "overcome.png",
        id: "",
        descriptions: [
            "N",
            "S"
        ],
        behavior: [
            [
            ["attack", 1, -1],
            ["attack", 0, -1],
            ["attack", -1, -1],
            ["move", 0, -2]],

            [["attack", 1, 1],
            ["attack", 0, 1],
            ["attack", -1, 1],
            ["move", 0, 2]]
        ]
    }
}
function hit_and_run(){
    return{
        name: "hit and run",
        pic: "hit_and_run.png",
        id: "",
        descriptions: [
            "S"
        ],
        behavior: [
            [["attack", 1, -1],
            ["attack", 0, -1],
            ["attack", -1, -1],
            ["move", 0, 1]]
        ]
    }
}
function v(){
    return{
        name: "v",
        pic: "v.png",
        id: "",
        descriptions: [
            "NE",
            "NW"
        ],
        behavior: [
            [["attack", 1, -1],
            ["move", 1, -1]],

            [["attack", -1, -1],
            ["move", -1, -1]]
        ]
    }
}
function push_back(){
    return{
        name: "push back",
        pic: "push_back.png",
        id: "",
        descriptions: [
            "SE",
            "SW",
        ],
        behavior: [
            [["attack", -1, -1],
            ["move", 1, 1]],

            [["attack", 1, -1],
            ["move", -1, 1]],
        ]
    }
}
function fork(){
    return{
        name: "fork",
        pic: "fork.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 1, -1],
            ["attack", -1, -1],
            ["attack", 1, -2],
            ["attack", -1, -2]],

            [["attack", 1, 1],
            ["attack", 1, -1],
            ["attack", 2, 1],
            ["attack", 2, -1]],

            [["attack", 1, 1],
            ["attack", -1, 1],
            ["attack", 1, 2],
            ["attack", -1, 2]],

            [["attack", -1, 1],
            ["attack", -1, -1],
            ["attack", -2, 1],
            ["attack", -2, -1]]
        ]
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
    return{
        name: "explosion",
        pic: "explosion.png",
        id: "",
        descriptions: [
            "Explode"
        ],
        behavior: [
            area
        ]
    }
}
function breakthrough(){
    return{
        name: "breakthrough",
        pic: "breakthrough.png",
        id: "",
        descriptions: [
            "N"
        ],
        behavior: [
            [["move", 0, -1],
            ["attack", 0, -1],
            ["attack", 1, 0],
            ["attack", -1, 0]],
        ]
    }
}
function flanking_diagonal(){
    return{
        name: "flanking diagonal",
        pic: "flanking_diagonal.png",
        id: "",
        descriptions: [
            "NE",
            "NW"
        ],
        behavior: [
            [["move", 1, -1],
            ["attack", 0, 1],
            ["attack", -1, 0],
            ["move", 1, -1],
            ["attack", 0, 1],
            ["attack", -1, 0],],

            [["move", -1, -1],
            ["attack", 0, 1],
            ["attack", 1, 0],
            ["move", -1, -1],
            ["attack", 0, 1],
            ["attack", 1, 0],]
        ]
    }
}
function flanking_sideways(){
    return{
        name: "flanking sideways",
        pic: "flanking_sideways.png",
        id: "",
        descriptions: [
            "E",
            "W"
        ],
        behavior: [
            [["move", 1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1],
            ["move", 1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1]],

            [["move", -1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1],
            ["move", -1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1]]
        ]
    }
}
function flanking_straight(){
    return{
        name: "flanking straight",
        pic: "flanking_straight.png",
        id: "",
        descriptions: [
            "N",
            "S"
        ],
        behavior: [
            [["move", 0, -1],
            ["attack", 1, 0],
            ["attack", -1, 0],
            ["move", 0, -1],
            ["attack", 1, 0],
            ["attack", -1, 0]],

            [["move", 0, 1],
            ["attack", 1, 0],
            ["attack", -1, 0],
            ["move", 0, 1],
            ["attack", 1, 0],
            ["attack", -1, 0]]
        ]
    }
}
function pike(){
    return{
        name: "pike",
        pic: "pike.png",
        id: "",
        descriptions: [
            "N",
            "E",
            "W"
        ],
        behavior: [
            [["attack", 0, -2],
            ["attack", 1, -3],
            ["attack", 0, -3],
            ["attack", -1, -3]],

            [["attack", 2, 0],
            ["attack", 3, 1],
            ["attack", 3, 0],
            ["attack", 3, -1]],

            [["attack", -2, 0],
            ["attack", -3, 1],
            ["attack", -3, 0],
            ["attack", -3, -1]]
            
        ]
    }
}