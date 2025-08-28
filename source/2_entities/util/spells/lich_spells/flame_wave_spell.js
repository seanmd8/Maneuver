/** @type {SpellGenerator} */
function flame_wave_spell_generator(){
    return {
        behavior: flame_wave_spell,
        telegraph: flame_wave_spell_telegraph,
        description: lich_spell_descriptions.flame_wave,
        pic: `${IMG_FOLDER.tiles}lich_flame_wave.png`
    }
}

/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(self, target, map){
    var direction = get_empty_nearby(self.location, order_nearby(target.difference), map);
    if(direction === undefined){
        return;
    }
    var spawnpoints = [];
    var wave = [-1, 0, 1];
    if(direction.x === 0){
        // Shooting vertically.
        spawnpoints = wave.map(x => new Point(x, direction.y));
    }
    else if(direction.y === 0){
        // Shooting horizontally.
        spawnpoints = wave.map(y => new Point(direction.x, y));
    }
    else{
        // Shooting diagonally.
        spawnpoints.push(new Point(direction.x, direction.y));
        spawnpoints.push(new Point(direction.x, 0));
        spawnpoints.push(new Point(0, direction.y));
    }
    spawnpoints = spawnpoints.map(s => self.location.plus(s));
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(direction);
        map.attack(spawnpoint);
        map.add_tile(fireball, spawnpoint);
    }
}

/** @type {TelegraphFunction} */
function flame_wave_spell_telegraph(location, map, self){
    return random_nearby().map(p => p.plus(location));
}