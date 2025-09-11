function altar_on_enter(f){
    return (self, target, map) => {
        if(target.tile.type === entity_types.player || target.tile.tags.has(TAGS.boss)){
            self.tile.health = 1;
            map.attack(self.location);
            var boss_tile = get_boss(map);
            if(boss_tile !== undefined){
                boss_tile.tags.remove(TAGS.hidden);
                boss_tile.look = undefined;
            }
            f(self, target, map);
        }
    }
}

function get_boss(map){
    var locations = [];
    cross(range(0, FLOOR_WIDTH), range(0, FLOOR_HEIGHT), (x, y) => {
        locations.push(new Point(x, y));
    });
    locations = locations.filter((p) => {
        return map.get_tile(p).tags.has(TAGS.boss);
    });
    return locations.length > 0 ? map.get_tile(locations[0]) : undefined;
   
}