/** @type {TileGenerator} */
function orb_of_insanity_tile(){
    var range = 2;
    var pic_arr = [`${IMG_FOLDER.tiles}orb_of_insanity_off.png`, `${IMG_FOLDER.tiles}orb_of_insanity_on.png`];
    return {
        type: `enemy`,
        name: `orb of insanity`,
        pic: pic_arr[0],
        description: `${orb_of_insanity_description[0]}${range}${orb_of_insanity_description[1]}`, 
        health: 1,
        difficulty: 3,
        behavior: orb_of_insanity_ai,
        telegraph_other: orb_of_insanity_telegraph_other,
        pic_arr,
        range
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function orb_of_insanity_ai(self, target, map){
    if( self.tile.range === undefined ||
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(self.tile.range)){
        map.stun_tile(self.location.plus(target.difference));
        self.tile.pic = self.tile.pic_arr[1];
    }
    else{
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function orb_of_insanity_telegraph_other(location, map, self){
    if(self.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var area = [];
    for(var i = -1 * self.range; i <= self.range; ++i){
        for(var j = -1 * self.range; j <= self.range; ++j){
            if(i !== 0 || j !== 0){
                area.push(location.plus(new Point(i, j)));
            }
        }
    }
    return area;
}