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
        uuid: "",
        health: 1,
        difficulty: 1
    }
}

module.exports = { player_tile, spider_tile, exit_tile, empty_tile };