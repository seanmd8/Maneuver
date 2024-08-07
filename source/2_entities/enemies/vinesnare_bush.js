/** @type {TileGenerator} */
function vinesnare_bush_tile(){
    var range = 3;
    var pic_arr = [`${IMG_FOLDER.tiles}vinesnare_bush_lashing.png`, `${IMG_FOLDER.tiles}vinesnare_bush_rooted.png`];
    var starting_cycle = 1;
    return {
        type: `enemy`,
        name: `Vinesnare Bush`,
        pic: pic_arr[starting_cycle],
        description: `${vinesnare_bush_description[0]}${range}${vinesnare_bush_description[1]}`,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 2,
        behavior: vinesnare_bush_ai,
        telegraph: vinesnare_bush_telegraph,
        telegraph_other: vinesnare_bush_telegraph_other,
        pic_arr,
        cycle: starting_cycle,
        range
    }
}

/** @type {AIFunction} AI used by vinesnare bushes.*/
function vinesnare_bush_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined ||
        self.tile.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If 1 away, attack if not rooted, otherwise uproot.
        if(self.tile.cycle === 0){
            map.attack(self.location.plus(target.difference));
            return;
        }
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        return;
    }
    var moved = false;
    if(self.tile.cycle > 0 && target.difference.within_radius(self.tile.range) && !target.tile.tags.has(TAGS.unmovable)){
        var direction = sign(target.difference);
        if(target.difference.on_axis() || target.difference.on_diagonal()){
            // If the player is orthogonal or diagonal and within range, drag them closer.
            for(var i = Math.max(Math.abs(target.difference.x), Math.abs(target.difference.y));
                i > 1 && map.move(self.location.plus(direction.times(i)), self.location.plus(direction.times(i - 1)));
                --i){
                    moved = true;
                }
            
        }
    }
    if(moved){
        // If the player was moved, uproot and pass the turn to them.
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(ERRORS.pass_turn);
    }
    if(++self.tile.cycle > 0){
        // Otherwise, root.
        self.tile.pic = self.tile.pic_arr[1];
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph(location, map, self){
    if( self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph_other(location, map, self){
    if( self.cycle === undefined ||
        self.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var vines = []
    if(self.cycle === 0){
        return vines;
    }
    for(var direction of ALL_DIRECTIONS){
        for(var i = 2; i <= self.range; ++i){
            vines.push(location.plus(direction.times(i)));
        }
    }
    return vines;
}