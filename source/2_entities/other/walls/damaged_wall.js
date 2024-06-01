/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    var pic_arr = [`${IMG_FOLDER.tiles}very_damaged_wall.png`, `${IMG_FOLDER.tiles}damaged_wall.png`];
    return {
        type: `terrain`,
        name: `damaged wall`,
        pic: pic_arr[health - 1],
        description: damaged_wall_description,
        health,
        on_hit: damaged_wall_on_hit,
        on_death: damaged_wall_death,
        pic_arr,
        summons: [spider_tile, acid_bug_tile, spider_web_tile, rat_tile, carrion_flies_tile]
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/

function damaged_wall_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    self.tile.pic = self.tile.pic_arr[Math.min(2, self.tile.health - 1)];
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