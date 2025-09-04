/** @type {TileGenerator} */
function maw_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.maw,
        pic: `${IMG_FOLDER.tiles}maw.png`,
        description: enemy_descriptions.maw,
        tags: new TagList(),
        health: 4,
        difficulty: 4,
        behavior: maw_ai,
        telegraph: maw_telegraph,
        on_hit: maw_hit,
    }
}

/** @type {AIFunction} AI used by maws.*/
function maw_ai(self, target, map){
    if(target.difference.on_axis() && target.difference.within_radius(1)){
        map.attack(self.location.plus(target.difference));
        map.attack(self.location.plus(target.difference));
        map.attack(self.location.plus(target.difference));
    }
    else{
        var moves = order_nearby(target.difference).filter((p) => {
            return p.on_axis();
        });
        var has_moved = false;
        for(var i = 0; i < moves.length && !has_moved; ++i){
            has_moved = map.move(self.location, self.location.plus(moves[i]));
        }
    }
}
/** @type {AIFunction}.*/
function maw_hit(self, target, map){
    stun(self.tile);
    stun(self.tile);
}
/** @type {TelegraphFunction} */
function maw_telegraph(location, map, self){
    return ORTHOGONAL_DIRECTIONS.map((p) => {
        return location.plus(p);
    })
}