function node_double_cannon_behavior(self, target, map){
    if(self.tile.direction.on_axis()){
        node_o_double_cannon_ai(self, target, map);
    }
    else{
        node_d_double_cannon_ai(self, target, map);
    }
}
function node_o_double_cannon_ai(self, target, map){
    var dir = self.tile.direction;
    var spawnpoints = [
        self.location.plus(dir.plus(dir.rotate(90))), 
        self.location.plus(dir.plus(dir.rotate(-90))),
    ];
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(self.tile.direction);
        if(map.is_in_bounds(spawnpoint) && !map.get_tile(spawnpoint).tags.has(TAGS.arcane_sentry)){
            map.attack(spawnpoint);
            map.add_tile(fireball, spawnpoint);
        }
    }
}
function node_d_double_cannon_ai(self, target, map){
    var dir = self.tile.direction;
    var spawnpoints = [
        self.location.plus(dir.times(new Point(1, 0))), 
        self.location.plus(dir.times(new Point(0, 1))),
    ];
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(self.tile.direction);
        if(map.is_in_bounds(spawnpoint) && !map.get_tile(spawnpoint).tags.has(TAGS.arcane_sentry)){
            map.attack(spawnpoint);
            map.add_tile(fireball, spawnpoint);
        }
    }
}

function node_double_cannon_telegraph(location, map, self){
    var dir = self.direction;
    if(dir.on_axis()){
        var locations = [
            location.plus(dir.plus(dir.rotate(90))), 
            location.plus(dir.plus(dir.rotate(-90))),
        ];
    }
    else{
        var locations = [
            location.plus(dir.times(new Point(1, 0))), 
            location.plus(dir.times(new Point(0, 1))),
        ];
    }
    return locations.filter((p) => {
        return map.is_in_bounds(p) && !map.get_tile(p).tags.has(TAGS.arcane_sentry);
    });
}