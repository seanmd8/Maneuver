
function node_saw_behavior(self, target, map){
    for(var direction of HORIZONTAL_DIRECTIONS){
        map.attack(self.location.plus(direction));
    }
}

function node_saw_telegraph(location, map, self){
    return HORIZONTAL_DIRECTIONS.map((p) => {return p.plus(location)});
}

function sentry_transform_saw(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        var tile = node.self.tile;
        tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_saw.png`;
        tile.behavior = node_saw_behavior;
        tile.telegraph = node_saw_telegraph;
        tile.description = arcane_sentry_node_description + `\n` + sentry_node_saw_description;
    }
    self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core_saw.png`;
    self.tile.direction = sentry_saw_direction(target.difference);
    self.tile.telegraph = node_saw_telegraph;
    self.tile.description = arcane_sentry_description+ `\n` + sentry_core_saw_description;
}

function sentry_saw_direction(difference){
    return order_nearby(difference).filter((dir) => {
        return dir.on_axis();
    })[0];
}