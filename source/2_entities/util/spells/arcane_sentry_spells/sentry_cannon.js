
function node_cannon_behavior(self, target, map){
    var spawnpoint = self.location.plus(self.tile.direction);
    var fireball = shoot_fireball(self.tile.direction);
    if(map.is_in_bounds(spawnpoint) && !map.get_tile(spawnpoint).tags.has(TAGS.arcane_sentry)){
        map.attack(spawnpoint);
        map.add_tile(fireball, spawnpoint);
    }
}
function node_cannon_telegraph(location, map, self){
    return [location.plus(self.direction)];
}

function sentry_transform_cannon(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    var direction = sentry_cannon_direction(target.difference);
    if(direction.on_axis()){
        for(var node of nodes){
            var tile = node.self.tile;
            tile.direction = direction;
            set_rotation(tile);
            var node_difference = target.difference.minus(node.target.difference);
            if(node_difference.plus(direction).on_axis()){
                // Node is behind the core so should be double cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_double_cannon_h.png`;
                tile.behavior = node_double_cannon_behavior;
                tile.telegraph = node_double_cannon_telegraph;
                tile.description = arcane_sentry_node_description + `\n` + sentry_node_double_cannon_description;
            }
            else{
                // Single cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_cannon_h.png`;
                tile.behavior = node_cannon_behavior;
                tile.telegraph = node_cannon_telegraph;
                tile.description = arcane_sentry_node_description + `\n` + sentry_node_cannon_description;
            }
        }
        // Core is single cannon.
        self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core_cannon_h.png`;
        self.tile.direction = direction;
        set_rotation(self.tile);
        self.tile.telegraph = node_cannon_telegraph;
        self.tile.description = arcane_sentry_description+ `\n` + sentry_core_cannon_description;
    }
    else{
        for(var node of nodes){
            var tile = node.self.tile;
            tile.direction = direction;
            set_rotation(tile);
            var node_difference = target.difference.minus(node.target.difference);
            if(point_equals(node_difference.plus(direction), new Point(0, 0))){
                // Node is behind core so should be double cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_double_cannon_d.png`;
                tile.behavior = node_double_cannon_behavior;
                tile.telegraph = node_double_cannon_telegraph;
                tile.description = arcane_sentry_node_description + `\n` + sentry_node_double_cannon_description;
            }
            else{
                // Single cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_cannon_d.png`;
                tile.behavior = node_cannon_behavior;
                tile.telegraph = node_cannon_telegraph;
                tile.description = arcane_sentry_node_description + `\n` + sentry_node_cannon_description;
            }
        }
        self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core.png`;
        self.tile.telegraph = undefined;
        self.tile.direction = undefined;
        self.tile.description = arcane_sentry_description+ `\n` + sentry_core_cannon_description;
    }
}

function sentry_cannon_direction(difference){
    if(difference.on_diagonal()){
        return sign(difference);
    }
    if(-1 <= difference.x && difference.x <= 1){
        return new Point(0, sign(difference.y));
    }
    if(-1 <= difference.y && difference.y <= 1){
        return new Point(sign(difference.x), 0);
    }
    return sign(difference);
}