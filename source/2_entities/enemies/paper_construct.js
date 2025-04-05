/** @type {TileGenerator} */
function paper_construct_tile(){
    return{
        type: `enemy`,
        name: `Paper Construct`,
        pic: `${IMG_FOLDER.tiles}paper_construct.png`,
        description: paper_construct_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: paper_construct_ai,
        telegraph: porcuslime_horizontal_telegraph,
        rotate: 90 * random_num(4)
    }
}

/** @type {AIFunction} AI used by scythes.*/
function paper_construct_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(target.difference.within_radius(2) && target.difference.on_axis()){
        // If the player is within range, attacks.
        var direction = sign(target.difference);
        var space = self.location.plus(direction)
        for(var i = 0; i < 2 && !map.attack(space) && map.check_empty(space); ++i){
            space.plus_equals(direction);
        }
    }
    else{
        // Choose a open direction nearest to towards the player.
        var directions = order_nearby(target.difference);
        var dir = undefined;
        for(var i = 0; i < directions.length && !dir; ++i){
            if(directions[i].on_diagonal() && map.check_empty(self.location.plus(directions[i]))){
                dir = directions[i];
            }
        }
        if(dir){
            // Move up to 2 spaces in that direction.
            var could_move = true;
            for(var i = 0; i < 2 && !(target.difference.on_axis() && target.difference.within_radius(2)) && could_move; ++i){
                var destination = self.location.plus(dir);
                could_move = map.check_empty(destination);
                if(could_move){
                    map.move(self.location, destination);
                    self.location.plus_equals(dir);
                    target.difference.minus_equals(dir);
                }
            }
        }
    }
    // Face it towards the player;
    self.tile.direction = order_nearby(target.difference).filter(p => {
        return p.on_axis();
    })[0];
    set_rotation(self.tile);
}
