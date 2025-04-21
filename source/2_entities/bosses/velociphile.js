/** @type {TileGenerator} */
function velociphile_tile(){
    var health = 3;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: `enemy`,
        name: `Velociphile`,
        pic: `${IMG_FOLDER.tiles}velociphile.png`,
        description: velociphile_description,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: velociphile_death_message,
        behavior: velociphile_ai,
        telegraph: velociphile_telegraph,
        on_death: boss_death,
        card_drops: [roll_nesw, roll_nwse, roll_ew]
    }
}

/** @type {AIFunction} AI used by the Velociphile.*/
function velociphile_ai(self, target, map){
    var directions = order_nearby(target.difference);
    if(chance(1, 3)){
        // 1/3 of the time, moves randomly.
        directions = randomize_arr(directions);
    }
    // Direction is reselected until an unobstructed one is found.
    var direction = get_empty_nearby(self.location, directions, map);
    if(!(direction === undefined)){
        // Moves in the chosen direction until it hits something, which it then attacks.
        while(map.move(self.location, self.location.plus(direction))){
            self.location.plus_equals(direction);
        }
        map.attack(self.location.plus(direction));
    }
}

/** @type {TelegraphFunction} */
function velociphile_telegraph(location, map, self){
    var attacks = [];
    for(var direction of ALL_DIRECTIONS){
        if(map.check_empty(location.plus(direction))){
            attacks.push(...get_points_in_direction(location.plus(direction), direction, map));
        }
    }
    return attacks;
}