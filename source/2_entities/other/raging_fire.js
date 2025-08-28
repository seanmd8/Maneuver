/** @type {TileGenerator} A fire which goes away over time. */
function raging_fire_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}raging_fire_weak.png`, `${IMG_FOLDER.tiles}raging_fire.png`];
    var health = 2;
    return {
        type: entity_types.enemy,
        name: other_tile_names.raging_fire,
        pic: pic_arr[health - 1],
        description: other_tile_descriptions.raging_fire,
        tags: new TagList([TAGS.unmovable, TAGS.unstunnable]),
        health,
        behavior: decay_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard,
        on_hit: raging_fire_hit,
        pic_arr
    }
}

/** @type {AIFunction}  AI used by fireballs.*/
function raging_fire_hit(self, target, map){
    if( self.tile.health === undefined ||
        self.tile.pic_arr === undefined
    ){
        throw new Error(ERRORS.missing_property);
    }
    var intensity = Math.min(self.tile.health - 1, self.tile.pic_arr.length);
    if(intensity >= 0){
        self.tile.pic = self.tile.pic_arr[intensity];
    }
}

