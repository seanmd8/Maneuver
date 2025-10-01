/** @type {TileGenerator} */
function scorpion_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.scorpion,
        pic: `${IMG_FOLDER.tiles}scorpion.png`,
        description: enemy_descriptions.scorpion,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: scorpion_ai,
        telegraph: spider_telegraph,
        flip: chance(1, 2),
        cycle: random_num(2),
    }
}

/** @type {AIFunction} AI used by scorpion.*/
function scorpion_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = 0;
        return;
    }
    // Move 2 spaces.
    if(self.tile.cycle === 1){
        for(var i = 0; i < 2; ++i){
            var directions = order_nearby(target.difference);
            var moved = move_careful(self, target, map, directions);
            if(moved !== undefined){
                if(moved.x < 0){
                    self.tile.flip = false;
                }
                if(moved.x > 0){
                    self.tile.flip = true;
                }
            }
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    if(self.tile.cycle === 1){
        throw new Error(ERRORS.skip_animation);
    }
}