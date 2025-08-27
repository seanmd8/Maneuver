
/** @type {TileGenerator}*/
function gem_crawler_tile(){
    var cycle = random_num(2);
    var pic_arr = [`${IMG_FOLDER.tiles}gem_crawler_recharging.png`, `${IMG_FOLDER.tiles}gem_crawler.png`]
    return {
        type: `enemy`,
        name: enemy_names.gem_crawler,
        pic: pic_arr[cycle],
        description: enemy_descriptions.gem_crawler,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        pic_arr,
        cycle,
        behavior: gem_crawler_ai,
        telegraph: gem_crawler_telegraph
    }
}

/** @type {AIFunction}*/
function gem_crawler_ai(self, target, map){
    if(self.tile.cycle === 1){
        move_closer_ai(self, target, map);
        if(target.difference.within_radius(1)){
            map.attack(self.location.plus(target.difference));
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function gem_crawler_telegraph(location, map, self){
    var attacks = [];
    if(self.cycle === 1){
        for(var direction of ALL_DIRECTIONS){
            var space = direction.plus(location);
            if(map.is_in_bounds(space) && map.check_empty(space)){
                // Shows all the spaces it can attack by moving other than the one it's in.
                attacks.push(
                    ...ALL_DIRECTIONS
                        .map((p) => {return p.plus(space)})
                        .filter((p) => {return !point_equals(p, location)})
                );
            }
        }
    }
    return attacks;
}