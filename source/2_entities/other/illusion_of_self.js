/** @type {TileGenerator} Illusion created by Shadow of Self.*/
function illusion_of_self_tile(){
    var player = GS.map.get_player();
    return {
        type: `enemy`,
        name: `Player`,
        pic: `${IMG_FOLDER.tiles}helmet.png`,
        description: player_description,
        tags: new TagList(),
        behavior: self_destruct,
        health: player.health,
        max_health: player.max_health    
    }
}

function self_destruct(self, target, map){
    self.tile.health = 1;
    map.attack(self.location);
}