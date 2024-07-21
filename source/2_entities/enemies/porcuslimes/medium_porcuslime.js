/** @type {TileGenerator} */
function medium_porcuslime_tile(){
    var starting_cycle = random_num(2);
    var pic_arr = [`${IMG_FOLDER.tiles}medium_h_porcuslime.png`, `${IMG_FOLDER.tiles}medium_d_porcuslime.png`];
    return {
        type: `enemy`,
        name: `medium porcuslime`,
        pic: pic_arr[starting_cycle],
        description: medium_porcuslime_description,
        tags: new TagList(),
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        telegraph: medium_porcuslime_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by medium porcuslimes.*/
function medium_porcuslime_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        map.clear_telegraphs();
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_h_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.cycle === 0){
        // If cycle is at 0, direction will be orthogonally towards the player.
        porcuslime_horizontal_ai(self, target, map);
    }
    else{
        // If cycle is at 1, direction will be diagonally towards the player.
        porcuslime_diagonal_ai(self, target, map);
    }
    // Swaps cycle and picture between the two.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function medium_porcuslime_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return porcuslime_horizontal_telegraph(location, map, self);
    }
    return porcuslime_diagonal_telegraph(location, map, self);
}