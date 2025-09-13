/** @type {FloorGenerator} Generates the floor where the Arcane Sentry appears.*/
function arcane_sentry_floor(floor_num,  area, map){
    // Randomly select a point where the player is not in range.
    var offset = 2;
    var x_range = randomize_arr(range(offset, FLOOR_WIDTH - offset));
    var y_range = randomize_arr(range(offset, FLOOR_HEIGHT - offset));
    var player_x = map.get_player_location().x;
    var x_range = x_range.filter((x) => {
        return x !== player_x + 1 && x !== player_x - 1;
    });

    // Spawn the core.
    var core_pos = new Point(x_range[0], y_range[0]);
    var core = arcane_sentry_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        core.health -= 2;
    }
    map.add_tile(core, core_pos);

    // Spawn the nodes.
    for(var direction of DIAGONAL_DIRECTIONS){
        var node = arcane_node_tile();
        if(GS.boons.has(boon_names.boss_slayer)){
            node.health -= 2;
        }
        map.add_tile(node, core_pos.plus(direction));
    }
    
    // Swap to turret mode for setup.
    var self = {
        tile: core,
        location: core_pos
    }
    var target = {
        tile: map.get_player(),
        difference: map.get_player_location().minus(core_pos)
    }
    core.mode = SENTRY_MODES.turret
    sentry_transform_turret(self, target, map);
    return boss_floor_message.arcane_sentry;
}