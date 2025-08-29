function node_saw_behavior(self, target, map){
    for(var direction of HORIZONTAL_DIRECTIONS){
        map.attack(self.location.plus(direction));
    }
}

function node_saw_telegraph(location, map, self){
    return [
        ...HORIZONTAL_DIRECTIONS.map((p) => {return p.plus(location)}), 
        ...hazard_telegraph(location, map, self)
    ];
}

function sentry_transform_saw(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        var tile = node.self.tile;
        tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_saw.png`;
        tile.behavior = node_saw_behavior;
        tile.on_enter = hazard;
        tile.telegraph = node_saw_telegraph;
        tile.description = 
            `${boss_descriptions.arcane_sentry_node}\n`
            +`${sentry_mode_descriptions.node.saw}`;
    }
    self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core_saw.png`;
    self.tile.direction = sentry_saw_direction(target.difference);
    self.tile.on_enter = hazard;
    self.tile.telegraph = node_saw_telegraph;
    self.tile.description = 
        `${boss_descriptions.arcane_sentry}\n`
        +`${sentry_mode_descriptions.core.saw}`;
}

function sentry_saw_direction(difference){
    return order_nearby(difference).filter((dir) => {
        return dir.on_axis();
    })[0];
}