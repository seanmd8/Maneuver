
function retaliate(){
    return {
        name: boon_names.retaliate,
        pic: `${IMG_FOLDER.boons}retaliate.png`,
        description: boon_descriptions.retaliate
    }
}

/** @type {AIFunction}*/
function retaliate_behavior(self, target, map){
    var hit = false;
    var spaces = random_nearby().map(p => {
        return p.plus(self.location);
    })
    for(var i = 0; i < spaces.length && !hit; ++i){
        if( map.is_in_bounds(spaces[i]) &&                   // Space is not edge.
            !map.check_empty(spaces[i]) &&                   // Space is not empty.
            !map.get_tile(spaces[i]).tags.has(TAGS.boss) &&  // Space is not a boss.
            (map.get_tile(spaces[i]).health !== undefined || // Space has health or
            map.get_tile(spaces[i]).on_hit !== undefined)    // Space has on_hit
        ){
            hit = map.attack(spaces[i]);
        }
    }
    if(!hit){
        map.attack(spaces[0]);
    }
}