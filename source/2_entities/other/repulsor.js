/** @type {TileGenerator} Pushes things away.*/
function repulsor_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}repulsor.png`, `${IMG_FOLDER.tiles}repulsor_reloading.png`];
    var starting_cycle = 0;
    return {
        type: `enemy`,
        name: `Repulsor`,
        pic: pic_arr[starting_cycle],
        description: repulsor_description,
        tags: new TagList([TAGS.unmovable]),
        behavior: repulsor_ai,
        telegraph_other: repulsor_telegraph_other,
        on_enter: repulsor_push_ai,
        on_hit: repulsor_push_ai,
        pic_arr,
        cycle: starting_cycle,
    }
}

/** @type {AIFunction} Pushes nearby creatures away.*/
function repulsor_push_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        return;
    }
    var player_was_moved = false;
    var activated = false;
    var spaces = random_nearby();
    for(var space of spaces){
        var target_space = self.location.plus(space);
        if(map.is_in_bounds(target_space)){
            var target_tile = map.get_tile(target_space);
            if(!target_tile.tags.has(TAGS.unmovable)){
                if(target_tile.type === `player`){
                    player_was_moved = true;
                }
                activated = true;
                self.tile.cycle = 2;
                self.tile.pic = self.tile.pic_arr[1];
                try {
                    // Push the creature away.
                    for(var i = 0; i < 2 && map.move(target_space, target_space.plus(space)); ++i){
                        target_space.plus_equals(space);
                    }
                } catch (error) {
                    // Catches ERRORS.pass_turn errors to prevent ping pong between 2.
                    // Catched ERRORS.creature_died in case it moves a enemy into lava.
                    if(error.message !== ERRORS.pass_turn && error.message !== ERRORS.creature_died){
                        throw error;
                    }
                }
            }
        }
    }
    if(player_was_moved){
        throw new Error(ERRORS.pass_turn);
    }
}

/** @type {AIFunction} AI used by smoldering ashes.*/
function repulsor_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        --self.tile.cycle;
        if(self.tile.cycle === 0){
            self.tile.pic = self.tile.pic_arr[0];
        }
        return;
    }
    repulsor_push_ai(self, target, map);
}
/** @type {TelegraphFunction} */
function repulsor_telegraph_other(location, map, self){
    if( self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spaces = [];
    if(self.cycle === 0){
        spaces = random_nearby();
        spaces = spaces.map((space) => space.plus(location));
        spaces.push(location);
    }
    return spaces;
}
