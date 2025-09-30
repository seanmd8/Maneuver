/** @type {TileGenerator} */
function large_porcuslime_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.porcuslime_large,
        pic: `${IMG_FOLDER.tiles}large_porcuslime.png`,
        description: enemy_descriptions.porcuslime_large,
        tags: new TagList(),
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
        telegraph: large_porcuslime_telegraph
    }
}

/** @type {AIFunction} AI used by large porcuslimes.*/
function large_porcuslime_ai(self, target, map){
    if(self.tile.health !== undefined && self.tile.health === 2){
        // If health is 2, turns into the medium version.
        map.attack(self.location);
        map.attack(self.location);
        map.clear_telegraphs();
        map.add_tile(medium_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        map.clear_telegraphs();
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_o_porcuslime_tile(), self.location);
        return;
    }
    var direction = sign(target.difference);
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}

/** @type {TelegraphFunction} */
function large_porcuslime_telegraph(location, map, self){
    return [
        ...porcuslime_diagonal_telegraph(location, map, self),
        ...porcuslime_orthogonal_telegraph(location, map, self),
    ];
}