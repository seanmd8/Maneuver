function empty_tile(){
    return {
        type: "empty",
        pic: "empty.png"
    }
}

function exit_tile(){
    return {
        type: "exit",
        pic: "stairs.png"
    }
}

function player_tile(){
    return {
        type: "player",
        pic: "helmet.png",
        health: 3
    }
}

function spider_tile(){
    return {
        type: "enemy",
        enemy_type: "spider",
        pic: "spider.png",
        id: "",
        health: 1,
        difficulty: 1,
        behavior: spider_ai
    }
}

function turret_tile(){
    return {
        type: "enemy",
        enemy_type: "turret",
        pic: "four_turret.png",
        id: "",
        health: 1,
        difficulty: 2,
        behavior: turret_ai
    }
}

function scythe_tile(){
    return{
        type: "enemy",
        enemy_type: "scythe_head",
        pic: "scythe_head.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: scythe_ai
    }
}

function knight_tile(){
    return{
        type: "enemy",
        enemy_type: "knight",
        pic: "knight.png",
        id: "",
        health: 2,
        difficulty: 4,
        behavior: knight_ai
    }
}
