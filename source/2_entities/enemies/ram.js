/** @type {TileGenerator} */
function ram_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}ram.png`, `${IMG_FOLDER.tiles}ram_charge.png`];
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `ram`,
        pic: pic_arr[starting_cycle],
        description: ram_description,
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        telegraph: ram_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by rams.*/
function ram_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    var direction = sign(target.difference);
    var wander_speed = 2;
    var moved = true;
    if(self.tile.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        if(Math.abs(target.difference.x) <= Math.abs(target.difference.y)){
            direction.y = 0;
            for(var i = 0; i < wander_speed && i < Math.abs(target.difference.x) && moved; ++i){
                moved = map.move(self.location, self.location.plus(direction));
                moved && self.location.plus_equals(direction);
            }
        }
        else{
            direction.x = 0;
            for(var i = 0; i < wander_speed && i < Math.abs(target.difference.y) && moved; ++i){
                moved = map.move(self.location, self.location.plus(direction));
                moved && self.location.plus_equals(direction);
            }
        }
        if(moved === true && (Math.abs(target.difference.x) < 3 || Math.abs(target.difference.y) < 3)){
            // If it sees them, prepares to charge.
            self.tile.cycle = 1;
            self.tile.pic = self.tile.pic_arr[self.tile.cycle];
        }
    }
    else{
        // Charges orthogonally until it hits something and rams it.
        // Reverts to wandering after.
        if(Math.abs(target.difference.x) > Math.abs(target.difference.y)){
            direction.y = 0;
        }
        else{
            direction.x = 0;
        }
        while(moved){
            moved = map.move(self.location, self.location.plus(direction));
            self.location.plus_equals(direction);
        }
        map.attack(self.location);
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    }
}

/** @type {TelegraphFunction} */
function ram_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle === 0){
        return [];
    }
    return turret_h_telegraph(location, map, self);
}