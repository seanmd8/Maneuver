/** @type {TileGenerator} */
function orb_of_insanity_tile(){
    var range = 2;
    var pic_arr = [`${IMG_FOLDER.tiles}orb_of_insanity_off.png`, `${IMG_FOLDER.tiles}orb_of_insanity_on.png`];
    return {
        type: entity_types.enemy,
        name: enemy_names.orb_of_insanity,
        pic: pic_arr[0],
        display_pic: pic_arr[1],
        description: enemy_descriptions.orb_of_insanity,
        tags:  new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 3,
        behavior: orb_of_insanity_ai,
        telegraph_other: orb_of_insanity_telegraph_other,
        pic_arr,
        range
    }
}

/** @type {AIFunction} AI used by Orbs of Insanity.*/
function orb_of_insanity_ai(self, target, map){
    if( self.tile.range === undefined ||
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var area = [
        ...point_rectangle(self.location.plus(-2, -2), self.location.plus(2, 2)),
        ...point_rectangle(self.location.plus(-1, -1), self.location.plus(1, 1)),
    ];
    var used = false;
    self.tile.pic = self.tile.pic_arr[1];
    for(var space of area){
        if(point_equals(space, self.location.plus(target.difference))){
            map.stun_tile(space);
            used = true;
        }
        else if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            used = used || map.stun_tile(space);
        }
    }
    if(!used){
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