function node_turret_behavior(self, target, map){
    var sign_dif = sign(target.difference);
    var sign_dir = sign(self.tile.direction);
    var same_x_dir = sign_dif.x === sign_dir.x;
    var same_y_dir = sign_dif.y === sign_dir.y;
    if(target.difference.on_axis() && (same_x_dir || same_y_dir)){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        var dirs = [
            self.tile.direction.times(new Point(1, 0)),
            self.tile.direction.times(new Point(0, 1)),
        ];
        for(var p of dirs){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }
}
function node_turret_telegraph(location, map, self){
    var x_points = get_points_in_direction(location, new Point(self.direction.x, 0), map);
    var y_points = get_points_in_direction(location, new Point(0, self.direction.y), map);
    return [...x_points, ...y_points];
}

function sentry_transform_turret(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        var tile = node.self.tile;
        tile.direction = node.self.location.minus(self.location);
        set_rotation(tile);
        tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_turret.png`;
        tile.behavior = node_turret_behavior;
        tile.on_enter = undefined;
        tile.telegraph = node_turret_telegraph;
        tile.description = 
            `${boss_descriptions.arcane_sentry_node}\n`
            +`${sentry_mode_descriptions.node.turret}`;
    }
    self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core.png`;
    self.tile.on_enter = undefined;
    self.tile.telegraph = undefined;
    self.tile.direction = undefined;
    self.tile.rotate = undefined;
    self.tile.description = 
        `${boss_descriptions.arcane_sentry}\n`
        +`${sentry_mode_descriptions.core.turret}`;
}