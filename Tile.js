function empty_tile(){
    return {
        type: "empty",
        pic: "empty.png",
        description: empty_description
    }
}

function exit_tile(){
    return {
        type: "exit",
        pic: "stairs.png",
        description: exit_description
    }
}

function player_tile(){
    return {
        type: "player",
        pic: "helmet.png",
        health: 3,
        description: player_description
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
        behavior: spider_ai,
        description: spider_description
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
        behavior: turret_ai,
        description: turret_description
    }
}

function scythe_tile(){
    return{
        type: "enemy",
        enemy_type: "scythe",
        pic: "scythe.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        description: scythe_description
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
        behavior: knight_ai,
        description: knight_description
    }
}

const empty_description = "There is nothing here.";
const exit_description = "Stairs to the next floor.";
const player_description = "You.";
const spider_description = "Spider: Will attack if next to the player. Otherwise it will move closer to them.";
const turret_description = "Turret: Does not move. Can attack orthoganally at a range.";
const scythe_description = "Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them.";
const knight_description = "Knight: Moves in an L shape. If it tramples the player, it will move away again.";