/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    var pic_arr = [`${IMG_FOLDER.tiles}very_damaged_wall.png`, `${IMG_FOLDER.tiles}damaged_wall.png`];
    return {
        type: `terrain`,
        name: `Damaged Wall`,
        pic: pic_arr[health - 1],
        description: damaged_wall_description,
        tags: new TagList([TAGS.unmovable]),
        health,
        on_hit: damaged_wall_on_hit,
        on_death: damaged_wall_death,
        pic_arr,
        summons: [spider_tile, acid_bug_tile, spider_web_tile, rat_tile, scythe_tile]
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/
function damaged_wall_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health > 0){
        self.tile.pic = self.tile.pic_arr[Math.min(1, self.tile.health - 1)];
    }}

/** @type {AIFunction} Function used when a damaged wall is destroyed to potentially spawn something.*/
function damaged_wall_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(chance(7, 10)){
        var ran = random_num(self.tile.summons.length);
        var new_enemy = self.tile.summons[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, self.location);
    }
}