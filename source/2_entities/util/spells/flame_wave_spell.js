/** @type {SpellGenerator} */
function flame_wave_spell_generator(){
    return {
        behavior: flame_wave_spell,
        telegraph: flame_wave_spell_telegraph,
        description: flame_wave_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_flame_wave.png`
    }
}

/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(self, target, map){
    var direction = get_empty_nearby(self.location, order_nearby(target.difference), map);
    var spawnpoints = [];
    if(direction === undefined){
        return;
    }
    if(direction.x === 0){
        // Shooting vertically.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push(new Point(i - 1, direction.y));
        }
    }
    else if(direction.y === 0){
        // Shooting horizontally.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push(new Point(direction.x, i - 1));
        }
    }
    else{
        // Shooting diagonally.
        spawnpoints.push(new Point(direction.x, direction.y));
        spawnpoints.push(new Point(direction.x, 0));
        spawnpoints.push(new Point(0, direction.y));
    }
    for(var i = 0; i < spawnpoints.length; ++i){
        var spawnpoint = self.location.plus(spawnpoints[i])
        var fireball = shoot_fireball(direction);
        map.attack(spawnpoint);
        map.add_tile(fireball, spawnpoint);
    }
}

/** @type {TelegraphFunction} */
function flame_wave_spell_telegraph(location, map, self){
    return random_nearby().map(p => p.plus(location));
}