/** @type {TileGenerator} The starting player.*/
function player_tile(){
    return {
        type: `player`,
        name: special_tile_names.player,
        pic: `${IMG_FOLDER.tiles}helmet.png`,
        description: special_tile_descriptions.player,
        tags: new TagList(),
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH,
        on_hit: player_hit
    }
}

function player_hit(self, target, map){
    if(GS.boons.has(boon_names.retaliate)){
        retaliate_behavior(self, target, map);
    }
    if(GS.boons.has(boon_names.escape_artist)){
        escape_artist_behavior(self, target, map);
    }
}