/** @type {TileGenerator} The starting player.*/
function player_tile(){
    return {
        type: `player`,
        name: `Player`,
        pic: `${IMG_FOLDER.tiles}helmet.png`,
        description: player_description,
        tags: new TagList(),
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH
    }
}