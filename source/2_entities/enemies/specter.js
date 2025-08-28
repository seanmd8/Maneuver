/** @type {TileGenerator}*/
function specter_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.specter,
        pic: `${IMG_FOLDER.tiles}specter.png`,
        description: enemy_descriptions.specter,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: specter_ai,
        telegraph: specter_telegraph
    }
}

/** @type {AIFunction} AI used by specters.*/
function specter_ai(self, target, map){
    if(target.difference.on_axis()){
        // If orthogonal, move towards player.
        var direction = sign(target.difference);
        var locations = get_specter_moves(self.location, direction, map);
        specter_move(self.location, locations, map);
        return;
    }
    var dir1 = sign(new Point(target.difference.x, 0));
    var dir2 = sign(new Point(0, target.difference.y));
    var direction = chance(1, 2) ? dir1 : dir2;
    var target_location = self.location.plus(target.difference);
    var locations = get_specter_moves(self.location, direction, map);
    for(var i = 0; i < locations.length; ++i){
        if(
            map.check_empty(locations[i]) && 
            target_location.minus(locations[i]).on_axis() &&
            !target_location.minus(locations[i]).within_radius(1)
        ){
            // If can move to the axis and the destination is not next to the player, do so.
            specter_move(self.location, locations.slice(0, i + 1), map);
            return;
        }
    }
    if(
        point_equals(sign(locations[locations.length - 1]), sign(self.location)) && // Same quadrant
        !target_location.minus(locations[locations.length - 1]).within_radius(1)
    ){
        // If it cant reach the axis, go as far is it can as long as it doesn't end next to a player.
        specter_move(self.location, locations, map);
        return;
    }
    var directions = order_nearby(target.difference).reverse().filter((p) => {return p.on_axis()});
    for(var direction of directions){
        var locations = get_specter_moves(self.location, direction, map);
        if(locations.length > 0){
            // Try to move away from the player.
            specter_move(self.location, locations, map);
            return;
        }
    }
}

function get_specter_moves(current, direction, map){
    var locations = [];
    var last_open = 0;
    for(var i = 0; i < 3; ++i){
        current = current.plus(direction);
        if(map.is_in_bounds(current)){
            locations.push(current);
            if(map.check_empty(current)){
                last_open = locations.length;
            }
            else{
                i -= 1;
            }
        }
    }
    return locations.splice(0, last_open);
}

function specter_move(current, passing, map){
    if(passing.length === 0){
        return;
    }
    var destination = passing.pop();
    map.move(current, destination);
    current.set(destination);
    for(var location of passing){
        map.stun_tile(location);
        map.attack(location);
    }
    return;                
}

/** @type {TelegraphFunction} */
function specter_telegraph(location, map, self){
    var attacks = [];
    for(var direction of HORIZONTAL_DIRECTIONS){
        attacks.push(...get_specter_moves(location, direction, map));
    }
    return attacks;
}