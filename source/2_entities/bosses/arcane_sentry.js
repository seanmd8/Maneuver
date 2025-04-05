SENTRY_MODES = Object.freeze({
    saw: "Saw",
    cannon: "Cannon",
    turret: "Turret"
});

const SENTRY_MAX_SAW_CYCLE = 4;
const SENTRY_MAX_CANNON_CYCLE = 3;

/** @type {TileGenerator} */
function arcane_sentry_tile(){
    var health = 5;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: `enemy`,
        name: `Arcane Sentry`,
        pic: `${IMG_FOLDER.tiles}arcane_sentry_core.png`,
        description: arcane_sentry_description,
        tags: new TagList([TAGS.boss, TAGS.arcane_sentry]),
        health,
        death_message: arcane_sentry_death_message,
        behavior: sentry_core_ai,
        on_hit: sentry_core_on_hit,
        on_death: arcane_sentry_death,
        cycle: 0,
        spawn_timer: 4,
        card_drops: [beam_ne, beam_se, beam_sw, beam_nw, saw_ns, saw_ew]
    }
}

function arcane_node_tile(){
    var health = 4;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: `enemy`,
        name: `Arcane Sentry Node`,
        pic: `${IMG_FOLDER.tiles}arcane_sentry_node_turret`,
        description: arcane_sentry_node_description,
        tags: new TagList([TAGS.boss, TAGS.arcane_sentry, TAGS.controlled, TAGS.unstunnable]),
        health,
        death_message: arcane_sentry_node_death_message,
        on_hit: node_on_hit,
        on_death: node_on_death,
    }
}

function sentry_core_ai(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    switch(self.tile.mode){
        case SENTRY_MODES.saw:
            if(self.tile.cycle === SENTRY_MAX_SAW_CYCLE){
                sentry_transform_saw(self, target, map);
            }
            else{
                for(var node of nodes){
                    node.self.tile.behavior(node.self, node.target, node.map);
                }
                node_saw_behavior(self, target, map);
                sentry_move(self, target, map);
            }
            decrement_sentry_cycle(self, target, map)
            break;
        case SENTRY_MODES.cannon:
            switch(self.tile.cycle){
                case SENTRY_MAX_CANNON_CYCLE:
                    sentry_transform_cannon(self, target, map);
                    break;
                default:
                    for(var node of nodes){
                        node.self.tile.behavior(node.self, node.target, node.map);
                    }
                    if(self.tile.direction !== undefined){
                        node_cannon_behavior(self, target, map);
                    }
                    break;
            }
            decrement_sentry_cycle(self, target, map);
            break;
        case SENTRY_MODES.turret:
            for(var node of nodes){
                node.self.tile.behavior(node.self, node.target, node.map);
            }
            ++self.tile.cycle;
            if(self.tile.cycle >= self.tile.spawn_timer){
                spawn_nearby(map, paper_construct_tile(), self.location);
                self.tile.cycle = 0;                                
            }
            break;
        default:
            throw Error(ERRORS.invalid_value);
    }
}

function arcane_sentry_death(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        node.self.tile.health = 1;
        node.self.tile.on_hit = undefined;
        map.attack(node.self.location);
    }
    boss_death(self, target, map);
}
function node_on_death(self, target, map){
    say(self.tile.death_message);
}

function sentry_core_on_hit(self, target, map){
    if(self.tile.mode === SENTRY_MODES.turret){
        self.tile.mode = SENTRY_MODES.saw;
        self.tile.cycle = SENTRY_MAX_SAW_CYCLE;
    }
}
function node_on_hit(self, target, map){
    var core = sentry_get_core(self.location, map);
    if(core.mode === SENTRY_MODES.turret){
        core.mode = SENTRY_MODES.cannon;
        core.cycle = SENTRY_MAX_CANNON_CYCLE;
    }
}

function sentry_move(self, target, map){
    var locations = get_sentry_nodes(self, target, map).map((node) => {
        return node.self.location;
    });
    locations.push(self.location);
    var can_move = move_check(locations, self.tile.direction, map);
    if(can_move){
        for(var location of locations){
            map.move(location, location.plus(self.tile.direction));
        }
        self.location.plus_equals(self.tile.direction)
    }
}
function move_check(locations, direction, map){
    for(var position of locations){
        if(!map.check_empty(position.plus(direction))){
            return false;
        }
    }
    return true;
}

function decrement_sentry_cycle(self, target, map){
    if(--self.tile.cycle === 0){
        self.tile.mode = SENTRY_MODES.turret;
        sentry_transform_turret(self, target, map);
        self.tile.cycle = self.tile.spawn_timer - 1;
    }
}

function get_sentry_nodes(self, target, map){
    return DIAGONAL_DIRECTIONS.filter((direction) => {
        // Only includes the remaining nodes.
        var location = self.location.plus(direction);
        return map.is_in_bounds(location) && map.get_tile(location).tags.has(TAGS.arcane_sentry);
    }).map((direction) => {
        // Returns a list of objects with the info required to call their ai functions.
        var location = self.location.plus(direction);
        return {
            self: {
                tile: map.get_tile(location),
                location
            },
            target: {
                tile: target.tile,
                difference: target.difference.minus(direction)
            },
            map: map
        }
    })
}
function sentry_get_core(location, map){
    for(var direction of DIAGONAL_DIRECTIONS){
        var space = direction.plus(location);
        if(map.is_in_bounds(space)){
            var tile = map.get_tile(space);
            if(tile.tags.has(TAGS.arcane_sentry)){
                return tile;
            }
        }
    }    
}