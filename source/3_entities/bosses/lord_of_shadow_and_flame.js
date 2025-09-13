/** @type {TileGenerator} */
function lord_of_shadow_and_flame_tile(){
    var pic_arr = [
    `${IMG_FOLDER.tiles}lord_move.png`,
    `${IMG_FOLDER.tiles}lord_attack.png`,
    `${IMG_FOLDER.tiles}lord_summon.png`
    ]

    var health = 13;
    var summons = [
        altar_of_sunlight_tile,
        altar_of_stars_tile,
        altar_of_scouring_tile,
        altar_of_shadow_tile,
        altar_of_space_tile,
        altar_of_stasis_tile,
        altar_of_singularity_tile,
    ]
    return {
        type: entity_types.enemy,
        name: boss_names.lord_of_shadow_and_flame,
        pic: pic_arr[0],
        display_pic: pic_arr[0],
        description: boss_descriptions.lord_of_shadow_and_flame,
        tags: new TagList([TAGS.boss]),
        health,
        max_health: health,
        death_message: boss_death_message.lord_of_shadow_and_flame,
        death_achievement: achievement_names.lord_of_shadow_and_flame,
        behavior: lord_of_shadow_and_flame_behavior,
        telegraph: lord_of_shadow_and_flame_telegraph,
        on_death: lord_of_shadow_and_flame_on_death,
        pic_arr,
        cycle: 0,
        summons,
        card_drops: BOSS_CARDS.lord_of_shadow_and_flame
    }
}

/** @type {AIFunction} AI used by the Lord of Shadow and Flame.*/
function lord_of_shadow_and_flame_behavior(self, target, map){
    var lord_slow_pics = [
        `${IMG_FOLDER.tiles}lord_move.png`,
        `${IMG_FOLDER.tiles}lord_attack.png`,
        `${IMG_FOLDER.tiles}lord_summon.png`
    ];
    var lord_fast_pics = [
        `${IMG_FOLDER.tiles}lord_fast_move.png`,
        `${IMG_FOLDER.tiles}lord_fast_attack.png`,
        `${IMG_FOLDER.tiles}lord_fast_summon.png`
    ];

    self.tile.pic_arr = self.tile.health < self.tile.max_health / 2 ? lord_fast_pics : lord_slow_pics;
    switch(self.tile.cycle){
        case 2: // Summon Mode
            // Do nothing since the actual summon should be an event that is already in motion.
            break;
        case 1: // Attack Mode
            var attacks = randomize_arr(ALL_DIRECTIONS).map((p) => {
                return self.location.plus(p);
            }).filter((p) => {
                return map.is_in_bounds(p);
            })
            for(var attack of attacks){
                var tile = map.get_tile(attack);
                if(!tile.tags.has(TAGS.altar)){
                    map.attack(attack);
                }
            }
            break;
        case 0: // Movement Mode
            if(!target.difference.within_radius(1)){
                var speed = self.tile.health < self.tile.max_health / 2 ? 2 : 1;
                for(var i = 0; i < speed; ++i){
                    var nearest = get_nearest_altar(map, self.location);
                    if(nearest !== undefined){
                        var dir = self.location.minus(nearest);
                        var choices = reverse_arr(order_nearby(sign(dir)).filter((p) => {
                            return map.is_in_bounds(p.plus(self.location));
                        }));
                        for(var choice of choices){
                            var destination = self.location.plus(choice);
                            var is_altar = map.get_tile(destination).tags.has(TAGS.altar);
                            var is_empty = map.check_empty(destination);
                            var is_fireball_target = check_fireball_target(map, destination);
                            if(is_altar || (is_empty && !is_fireball_target)){
                                if(map.move(self.location, destination)){
                                    self.location.plus_equals(choice);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            break;
        default:
            throw new Error(ERRORS.invalid_value);
    }
    
    if(target.difference.within_radius(1)){
        // Prep attack
        self.tile.pic = self.tile.pic_arr[1];
        self.tile.cycle = 1;
    }
    else if(self.tile.cycle === 2 || get_nearest_altar(map, self.location) !== undefined){
        // Prep move
        self.tile.pic = self.tile.pic_arr[0];
        self.tile.cycle = 0;
    }
    else{
        // Prep summon
        self.tile.pic = self.tile.pic_arr[2];
        self.tile.cycle = 2;
        var make = rand_no_repeats(self.tile.summons, 4);
        var xs = rand_no_repeats(range(0, FLOOR_WIDTH), make.length);
        var ys = rand_no_repeats(range(0, FLOOR_HEIGHT), make.length);
        for(var i = 0; i < make.length; ++i){
            var destination = new Point(xs[i], ys[i]);
            if(!point_equals(destination, self.location)){
                map.add_event({
                    name: event_names.altarfall, 
                    behavior: altar_event(destination, make[i])
                });
            }
        }
    }
}

/** @type {TelegraphFunction} */
function lord_of_shadow_and_flame_telegraph(location, map, self){
    if(self.cycle === 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}

function get_nearest_altar(map, location){
    for(var i = 1; i < Math.max(FLOOR_HEIGHT, FLOOR_WIDTH); ++i){
        var corner_1 = location.plus(new Point(1, 1).times(i));
        var corner_2 = location.plus(new Point(-1, -1).times(i));
        var rectangle = point_rectangle(corner_1, corner_2);
        for(var p of rectangle){
            if(map.is_in_bounds(p) && map.get_tile(p).tags.has(TAGS.altar)){
                return p;
            }
        }
    }
    return undefined;
}

function check_fireball_target(map, location){
    var fireballs = point_rectangle(location.plus(1, 1), location.plus(-1, -1)).filter((p) => {
        // Is there a fireball at p?
        return map.is_in_bounds(p) && map.get_tile(p).tags.has(TAGS.fireball);
    }).filter((p) => {
        // Is the fireball at p headed to location?
        return point_equals(map.get_tile(p).direction.plus(p), location);
    });
    return fireballs.length > 0;
}

function lord_of_shadow_and_flame_on_death(self, target, map){
    map.add_tile(final_exit_tile());
    map.add_event({name: event_names.earthquake, behavior: eternal_earthquake_event(8)});
    boss_death(self, target, map);
}