/** @type {TileGenerator} */
function swaying_nettle_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}swaying_nettle_x.png`, `${IMG_FOLDER.tiles}swaying_nettle_+.png`];
    var starting_cycle = random_num(2);
    return{
        type: `enemy`,
        name: `Swaying Nettle`,
        pic: pic_arr[starting_cycle],
        description: swaying_nettle_description,
        tags: new TagList([TAGS.unmovable, TAGS.nettle_immune]),
        health: 1,
        difficulty: 1,
        behavior: swaying_nettle_ai,
        telegraph: swaying_nettle_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by swaying nettles.*/
function swaying_nettle_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var targets = self.tile.cycle === 0 ? DIAGONAL_DIRECTIONS : HORIZONTAL_DIRECTIONS;
    for(var target of targets){
        var target_space = self.location.plus(target);
        if(map.is_in_bounds(target_space) && !map.get_tile(target_space).tags.has(TAGS.nettle_immune)){
            map.attack(target_space);
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function swaying_nettle_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var targets = self.cycle === 0 ? DIAGONAL_DIRECTIONS : HORIZONTAL_DIRECTIONS;
    return targets.map(target => {
        return target.plus(location);
    })
}