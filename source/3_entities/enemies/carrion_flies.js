/** @type {TileGenerator} */
function carrion_flies_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.carrion_flies,
        pic: `${IMG_FOLDER.tiles}carrion_flies.png`,
        description: enemy_descriptions.carrion_flies,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: carrion_flies_ai,
        telegraph: spider_telegraph,
        cycle: random_num(2),
        spawn_timer: 3
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function carrion_flies_ai(self, target, map){
    if( self.tile.cycle === undefined ||
        self.tile.spawn_timer === undefined){
        throw new Error(ERRORS.missing_property);
    }
    ++self.tile.cycle;
    if(self.tile.cycle === self.tile.spawn_timer){
        // When the cycle reaches the spawn timer, spawn and reset it while increasing the time until the next one.
        self.tile.spawn_timer += 2;
        self.tile.cycle = 0;
        var new_tile = carrion_flies_tile();
        new_tile.spawn_timer = self.tile.spawn_timer;
        spawn_nearby(map, new_tile, self.location);
    }
    if(target.difference.within_radius(1)){
        // Attack the player if they are close.
        map.attack(self.location.plus(target.difference));
    }
    else{
        // Move randomly.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(self.location, self.location.plus(near_points[i])); ++i){}
    }
}