/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    return {
        type: `terrain`,
        name: `damaged wall`,
        pic: `${IMG_FOLDER.tiles}damaged_wall.png`,
        description: damaged_wall_description,
        health,
        on_death: damaged_wall_death,
        summons: [spider_tile, acid_bug_tile, spider_web_tile, rat_tile, carrion_flies_tile]
    }
}

/** @type {AIFunction} Function used when a damaged wall is destroyed to potentially spawn something.*/
function damaged_wall_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(random_num(10) < 7){
        var ran = random_num(self.tile.summons.length);
        var new_enemy = self.tile.summons[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, self.location);
    }
}