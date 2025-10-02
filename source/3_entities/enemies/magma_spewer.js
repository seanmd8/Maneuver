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
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Move away if the player gets close.
        if(target.difference.within_radius(2)){
            var directions = order_nearby(target.difference.times(-1));
            move_careful(self, target, map, directions);
        }
    }
    else{
        // Spew Magma.
        var locations = [];
        var center = self.location.plus(target.difference);
        if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            var miss = get_nearest_where(map, center, (t, p) => {
                return t.type === entity_types.enemy && !point_equals(p, self.location);
            });
            center = miss ? miss : center;
        }
        for(var i = -2; i <= 2; ++i){
            for(var j = -2; j <= 2; ++j){
                locations.push(center.plus(new Point(i, j)));
            }
        }
        map.add_event({
            name: event_names.falling_magma, 
            behavior: earthquake_event(random_num(4) + random_num(4) + 4, locations),
        });
        if(chance(1, 4)){
            map.add_event({name: event_names.falling_magma, behavior: targeted_earthquake_event([center])});
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}