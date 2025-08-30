/** @type {TileGenerator} */
function unspeakable_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.unspeakable,
        pic: `${IMG_FOLDER.tiles}unspeakable.png`,
        description: enemy_descriptions.unspeakable,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        telegraph_other: unspeakable_telegraph,
        on_death: unspeakable_death,
    }
}

/** @type {AIFunction} Function used when unspeakableas die to confuse the player.*/
function unspeakable_death(self, target, map){
    for(var i = 0; i < 3; ++i){
        map.stun_tile(self.location.plus(target.difference));
    }
}

/** @type {TelegraphFunction} */
function unspeakable_telegraph(location, map, self){
    return [map.get_player_location()];
}