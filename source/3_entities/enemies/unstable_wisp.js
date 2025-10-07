/** @type {TileGenerator} */
function unstable_wisp_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.unstable_wisp,
        pic: `${IMG_FOLDER.tiles}unstable_wisp.png`, 
        description: enemy_descriptions.unstable_wisp,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: unstable_wisp_ai,
        telegraph_other: spider_telegraph,
        on_death: unstable_wisp_death,
    }
}

/** @type {AIFunction}*/
function unstable_wisp_ai(self, target, map){
    var start = self.location.copy();
    var directions = random_nearby();
    var moved = move_careful(self, target, map, directions);
    if(moved !== undefined && chance(1, 2)){
        // Chance to shoot a fireball after moving.
        moved.times_equals(-1);
        var fireball = shoot_fireball(moved);
        map.add_tile(fireball, start);
    }
}

/** @type {AIFunction} Function used when unstable wisps die to explode and send out fireballs.*/
function unstable_wisp_death(self, target, map){
    var attacks = random_nearby();
    var fireballs = [];
    for(var dir of attacks){
        var spawnpoint = self.location.plus(dir);
        if(!map.attack(spawnpoint)){
            var fireball = shoot_fireball(dir);
            fireball.stun = 1; // Gets around unstunnable.
            stun(fireball);
            map.add_tile(fireball, spawnpoint);
            fireballs.push(fireball);
        }
    }
    var unstun = (map_to_use) => {
        for(var fireball of fireballs){
            fireball.stun = undefined;
        }
    }
    map.add_event({name: event_names.unstun, behavior: unstun});
}