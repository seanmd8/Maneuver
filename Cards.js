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

