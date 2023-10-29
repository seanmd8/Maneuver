const CARD_CHOICES = [spin_attack, short_charge, jump, step_left, step_right];

function make_starting_deck(){
    deck = new MoveDeck();
    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(jump());
    deck.add(spin_attack());
    deck.add(spin_attack());
    deck.add(short_charge());
    deck.deal();
    return deck;
}

function basic_horizontal(){
    return{
        name: "basic_horizontal",
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
        name: "basic_diagonal",
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
function spin_attack(){
    return{
        name: "spin_attack",
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
function short_charge(){
    return{
        name: "short_charge",
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
            ["move", 0, -1],
            ["attack", 0, -1]],

            [["move", 1, 0],
            ["move", 1, 0],
            ["attack", 1, 0]],

            [["move", 0, 1],
            ["move", 0, 1],
            ["attack", 0, 1]],

            [["move", -1, 0],
            ["move", -1, 0],
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
function step_left(){
    return{
        name: "step_left",
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
        name: "step_right",
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

