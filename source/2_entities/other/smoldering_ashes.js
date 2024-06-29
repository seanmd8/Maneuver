/** @type {TileGenerator} Dropped by Pheonixes to respawn them. */
function smoldering_ashes_tile(){
    var spawn_timer = 2;
    return {
        type: `enemy`,
        name: `smoldering_ashes`,
        pic: `${IMG_FOLDER.tiles}smoldering_ashes.png`,
        description: `${smoldering_ashes_description[0]}${spawn_timer}${smoldering_ashes_description[1]}`,
        health: 1,
        behavior: smoldering_ashes_ai,
        on_enter: decay_ai,
        description_arr: smoldering_ashes_description,
        cycle: 0,
        spawn_timer
    }
}

/** @type {AIFunction} AI used by smoldering ashes.*/
function smoldering_ashes_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined ||
        self.tile.description_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
        self.tile.description = `${self.tile.description_arr[0]}${self.tile.spawn_timer - self.tile.cycle}${self.tile.description_arr[1]}`
        throw new Error(`skip animation delay`);
    }
    else{
        // Dies and spawns a pheonix.
        map.attack(self.location);
        map.add_tile(pheonix_tile(), self.location);
    }
}
