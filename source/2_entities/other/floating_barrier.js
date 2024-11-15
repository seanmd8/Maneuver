/** @type {TileGenerator} */
function floating_barrier_tile(){
    var direction = ALL_DIRECTIONS[random_num(ALL_DIRECTIONS.length)].copy();
    var pic_arr = [`${IMG_FOLDER.tiles}floating_barrier_n.png`, `${IMG_FOLDER.tiles}floating_barrier_nw.png`];
    var tile = {
        type: `enemy`,
        name: `Floating Barrier`,
        pic: pic_arr[direction.on_axis() ? 0 : 1],
        description: floating_barrier_description,
        tags: new TagList(),
        behavior: floating_barrier_ai,
        pic_arr,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction}.*/
function floating_barrier_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        var directions = random_nearby();
        for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
        if(i < directions.length){
            self.tile.direction = directions[i];
            self.tile.pic = self.tile.pic_arr[self.tile.direction.on_axis() ? 0 : 1]
            set_rotation(self.tile);
        }
    }
}