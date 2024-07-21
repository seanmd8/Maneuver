/** @type {TileGenerator} Generates a camoflauged boulder elemental. */
function boulder_elemental_tile(){
    var tile = boulder_elemental_look();
    shapeshift(tile, ifexists(tile.look_arr)[0]);
    return tile;
}

/** @type {TileGenerator} Generates an uncomoflauged boulder elemental. */
function boulder_elemental_look(){
    return {
        type: `enemy`,
        name: `boulder elemental`,
        pic: `${IMG_FOLDER.tiles}boulder_elemental.png`,
        description: boulder_elemental_description,
        tags: new TagList([TAGS.unmovable]),
        behavior: boulder_elemental_ai,
        telegraph: spider_telegraph,
        on_enter: boulder_elemental_wake_up,
        on_hit: boulder_elemental_wake_up,
        look_arr: [magmatic_boulder_tile, boulder_elemental_look],
        cycle: 0
    }
}


/** @type {AIFunction} AI used by boulder elementals.*/
function boulder_elemental_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 0){
        // Asleep.
        throw new Error(ERRORS.skip_animation);
    }
    if(self.tile.cycle < 0){
        // Asleep and resting.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    var nearby = order_nearby(target.difference);
    var hit = false;
    for(let space of nearby){
        // Attacks everything nearby.
        hit = map.attack(self.location.plus(space)) || hit;
    }
    // Gets sleepier
    --self.tile.cycle;
    if(self.tile.cycle <= 0){
        // Falls asleep.
        shapeshift(self.tile, self.tile.look_arr[0]);
        self.tile.cycle = -2;
    }
    else if(!target.difference.within_radius(1)){
        // If not asleep, moves towards the player.
        move_closer_ai(self, target, map);
    }
}
/** @type {AIFunction} boulder elemental wakes up when touched.*/
function boulder_elemental_wake_up(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 0){
        stun(self.tile);
        self.tile.cycle = 3;
        shapeshift(self.tile, self.tile.look_arr[1]);
    }
}

