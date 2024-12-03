/** @type {TileGenerator} */
function unstable_wisp_tile(){
    return {
        type: `enemy`,
        name: `Unstable Wisp`,
        pic: `${IMG_FOLDER.tiles}unstable_wisp.png`, 
        description: unstable_wisp_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: unstable_wisp_ai,
        telegraph_other: spider_telegraph,
        on_death: unstable_wisp_death,
    }
}

/** @type {AIFunction}*/
function unstable_wisp_ai(self, target, map){
    var start = self.location.copy();
    var moved = undefined;
    var directions = random_nearby(target.difference);
    for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0) && !moved; ++i){
        // Moves a space randomly.
        for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
        if(i < directions.length && map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            moved = directions[i];
        }
    }
    if(moved && random_num(3) === 0){
        // Chance to shoot a fireball after moving.
        moved.times_equals(-1);
        var fireball = shoot_fireball(moved);
        map.add_tile(fireball, start);
    }
}

/** @type {AIFunction} Function used when unstable wisps die to explode and send out fireballs.*/
function unstable_wisp_death(self, target, map){
    var attacks = random_nearby();
    for(var dir of attacks){
        var spawnpoint = self.location.plus(dir)
        if(!map.attack(spawnpoint)){
            var fireball = shoot_fireball(dir);
            stun(fireball);
            map.add_tile(fireball, spawnpoint);
        }
    }
}