/** @type {TileGenerator} */
function ram_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}ram.png`, `${IMG_FOLDER.tiles}ram_charge.png`];
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `Ram`,
        pic: pic_arr[starting_cycle],
        description: ram_description,
        tags: new TagList(),
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
        throw new Error(ERRORS.missing_property)
    }
    var direction = sign(target.difference);
    var other_direction = sign(target.difference);
    var wander_speed = 2;
    var moved = true;
    var amount_moved = 0;
    if(self.tile.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        if(Math.abs(target.difference.x) <= Math.abs(target.difference.y)){
            direction.y = 0;
            other_direction.x = 0;
        }
        else{
            direction.x = 0;
            other_direction.y = 0;
        }
        for(var i = 0; i < wander_speed && !target.difference.on_axis() && moved; ++i){
            // Attempts to move towards the closest row or column that they are in.
            moved = map.move(self.location, self.location.plus(direction));
            if(moved){
                self.location.plus_equals(direction);
                target.difference.minus_equals(direction);
                ++amount_moved;
            }
        }
        if(amount_moved === 0){
            // Moves towards them instead.
            direction = other_direction;
            moved = true;
            for(var i = 0; i < wander_speed && !target.difference.on_axis() && moved; ++i){
                // Attempts to move towards the closest row or column that they are in.
                moved = map.move(self.location, self.location.plus(direction));
                if(moved){
                    self.location.plus_equals(direction);
                    target.difference.minus_equals(direction);
                    ++amount_moved;
                }
            }
        }

        if(target.difference.on_axis()){
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
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return [];
    }
    return turret_h_telegraph(location, map, self);
}