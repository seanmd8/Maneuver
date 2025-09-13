/** @type {TileGenerator} */
function magma_spewer_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}magma_spewer.png`, `${IMG_FOLDER.tiles}magma_spewer_firing.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: entity_types.enemy,
        name: enemy_names.magma_spewer,
        pic: `${IMG_FOLDER.tiles}magma_spewer.png`,
        display_pic: pic_arr[1],
        description: enemy_descriptions.magma_spewer,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: magma_spewer_ai,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by magma spewers.*/
function magma_spewer_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 0){
        // Move away if the player gets close.
        if(target.difference.within_radius(2)){
            var directions = order_nearby(target.difference.times(-1));
            var moved = false;
            for(var i = 0; i < directions.length && !moved; ++i){
                if(map.check_empty(self.location.plus(directions[i]))){
                    map.move(self.location, self.location.plus(directions[i]));
                    self.location.plus_equals(directions[i]);
                    moved = true;
                }
            }
        }
    }
    else{
        // Spew Magma.
        var locations = [];
        var center = self.location.plus(target.difference);
        for(var i = -2; i <= 2; ++i){
            for(var j = -2; j <= 2; ++j){
                locations.push(center.plus(new Point(i, j)));
            }
        }
        map.add_event({name: event_names.falling_magma, behavior: earthquake_event(random_num(4) + 4, locations)})
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}