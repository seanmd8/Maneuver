/** @type {TileGenerator} */
function wheel_of_fire_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.wheel_of_fire,
        pic: `${IMG_FOLDER.tiles}wheel_of_fire.png`,
        description: enemy_descriptions.wheel_of_fire,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: wheel_of_fire_ai,
        telegraph: wheel_of_fire_telegraph
    }
}

/** @type {AIFunction} AI used by Wheels of Fire.*/
function wheel_of_fire_ai(self, target, map){
    if((target.difference.on_axis() || target.difference.on_diagonal())){
        var direction = sign(target.difference);
        var hit = false;
        for(var space = self.location.plus(direction); !hit; space.plus_equals(direction)){
            hit = map.attack(space);
            if(map.check_empty(space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, space);
            }
            else{
                hit = true;
            }
        }
    }
    else if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
        var direction = sign(rand_from(ALL_DIRECTIONS));
        var hit = false;
        for(var space = self.location.plus(direction); !hit; space.plus_equals(direction)){
            hit = map.attack(space);
            if(map.check_empty(space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, space);
            }
            else{
                hit = true;
            }
        }

    }
    else{
        var direction = get_empty_nearby(self.location, random_nearby(), map);
        if(!(direction === undefined)){
            map.move(self.location, self.location.plus(direction));
        }
    }
}

/** @type {TelegraphFunction} */
function wheel_of_fire_telegraph(location, map, self){
    var dir_arrs = ALL_DIRECTIONS.map((p) => {
        return get_points_in_direction(location, p, map);
    })
    var attacks = [];
    for(var arr of dir_arrs){
        attacks.push(...arr);
    }
    return attacks;
}