/** @type {TileGenerator} Generates a camoflauged boulder elemental. */
function boulder_elemental_tile(){
    var tile = boulder_elemental_look();
    shapeshift(tile, tile.look_arr[0]);
    return tile;
}

/** @type {TileGenerator} Generates an uncomoflauged boulder elemental. */
function boulder_elemental_look(){
    return {
        type: `enemy`,
        name: `boulder elemental`,
        pic: `${IMG_FOLDER.tiles}boulder_elemental.png`,
        description: boulder_elemental_description,
        difficulty: 3,
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
        throw new Error(`tile missing properties used by it's ai.`)
    }
    if(self.tile.cycle === 0){
        return;
    }
    var nearby = order_nearby(target.difference);
    var hit = false;
    for(space of nearby){
        // Attacks everything nearby.
        hit = hit ||  map.attack(self.location.plus(space));
    }
    if(!hit){
        // If nothing was nearby, gets sleepier.
        --self.tile.cycle;
    }
    if(self.tile.cycle <= 0){
        // Falls asleep.
        shapeshift(self.tile, self.tile.look_arr[0]);
    }
    else if(!target.difference.within_radius(1)){
        // If not asleep, moves towards the player.
        move_closer_ai(self, target, map);
    }
}
/** @type {AIFunction} boulder elemental wakes up when touched.*/
function boulder_elemental_wake_up(self, target, map){
    stun(self.tile);
    self.tile.cycle = 3;
    shapeshift(self.tile, self.tile.look_arr[1]);
}

