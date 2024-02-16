/** @type {TileGenerator} */
function spider_tile(){
    return {
        type: `enemy`,
        name: `spider`,
        pic: `${IMG_FOLDER.tiles}spider.png`,
        description: spider_description,
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        telegraph: spider_telegraph
    }
}

/** @type {AIFunction} AI used by spiders and the Spider Queen.*/
function spider_ai(self, target, map){
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference), `player`);
    }
    else{
        // Otherwise, move closer.
        move_closer_ai(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function spider_telegraph(location, map, self){
    return add_to_point_arr(all_directions, location);
}