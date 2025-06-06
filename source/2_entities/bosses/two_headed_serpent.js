/** @type {TileGenerator} */
function two_headed_serpent_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}serpent_head_sleep.png`, `${IMG_FOLDER.tiles}serpent_head.png`];
    return{
        type: `enemy`,
        name: `Two Headed Serpent`,
        pic: pic_arr[1],
        description: two_headed_serpent_awake_description,
        tags: new TagList([TAGS.boss, TAGS.unmovable]),
        health: 1,
        death_message: two_headed_serpent_death_message,
        death_achievement: achievement_names.two_headed_serpent,
        behavior: two_headed_serpent_ai,
        telegraph: two_headed_serpent_telegraph,
        on_death: two_headed_serpent_hurt,
        pic_arr,
        cycle: 1,
        segment_list: [undefined, undefined],
        card_drops: [regenerate, fangs, slither]
    }
}
/** @type {TileGenerator} */
function two_headed_serpent_body_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}serpent_body_straight.png`, `${IMG_FOLDER.tiles}serpent_body_bend.png`];
    return{
        type: `terrain`,
        name: `Two Headed Serpent body`,
        pic: pic_arr[0],
        description: two_headed_serpent_body_description,
        tags: new TagList([TAGS.boss, TAGS.unmovable]),
        pic_arr,
        segment_list: [undefined, undefined],
    }
}
/** @type {AIFunction} */
function two_headed_serpent_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle !== 1){
        throw new Error(ERRORS.skip_animation);
    }
    var moved = false;
    var index = serpent_get_direction(self.tile);
    if(!(target.difference.within_radius(1) && target.difference.on_axis())){
        var dir = order_nearby(target.difference);
        for(var i = 0; i < dir.length && !moved; ++i){
            if(dir[i].on_axis()){
                moved = map.move(self.location, self.location.plus(dir[i]));
                if(moved){
                    // Create segment where the head was.
                    var neck = two_headed_serpent_body_tile();
                    if(neck.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    neck.segment_list[1 - index] = dir[i];
                    neck.segment_list[index] = self.tile.segment_list[index]
                    serpent_rotate(neck);
                    map.add_tile(neck, self.location);
                    // Update head
                    self.location.plus_equals(dir[i]);
                    target.difference.plus_equals(dir[i].times(-1));
                    self.tile.segment_list[index] = dir[i].times(-1);
                    serpent_rotate(self.tile);
                    // Drag tail
                    var tail = serpent_other_end(self, index, map);
                    if(tail.tile.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    var last_segment_location = tail.location.plus(ifexists(tail.tile.segment_list[1 - index]));
                    var last_segment = map.get_tile(last_segment_location);
                    if(last_segment.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    tail.tile.segment_list[1 - index] = last_segment.segment_list[1 - index];
                    last_segment.health = 1;
                    map.attack(last_segment_location);
                    map.clear_telegraphs();
                    map.move(tail.location, last_segment_location);
                    serpent_rotate(tail.tile);
                }
            }
        } 
    }
    if(target.difference.within_radius(1) && target.difference.on_axis()){
        map.attack(self.location.plus(target.difference));
    }
    else if(!moved){
        // If stuck, switch heads.
        var tail = serpent_other_end(self, index, map);
        var wake_up = function(map_to_use){
            serpent_wake(tail, map_to_use);
        }
        map.add_event({name: `Wake Up`, behavior: wake_up});
    }
}
/**
 * Recursively finds the other head of the snake.
 * @param {AISelfParam} self The current segment and it's location.
 * @param {Number} index The index to find the next segment using the current one's segment_list.
 * @param {GameMap} map The game map the snake is on.
 * @returns {AISelfParam} The other head and it's location..
 */
function serpent_other_end(self, index, map){
    if(self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var p = self.tile.segment_list[index];
    if(p === undefined){
        return self;
    }
    var next_location = self.location.plus(p);
    var next = {
        location: next_location,
        tile: map.get_tile(next_location)
    }
    return serpent_other_end(next, index, map);
}
/**
 * Finds the index of the provided head's segment list that is being used.
 * @param {Tile} tile The current head.
 * @returns {number} The index.
 */
function serpent_get_direction(tile){
    if(tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return 1 - tile.segment_list.findIndex((element) => element === undefined);
}
/** 
 * Gives the provided segment the correct picture and correct amount of rotation.
 * @param {Tile} tile The tile to rotate.
 */
function serpent_rotate(tile){
    if( tile.pic_arr === undefined || 
        tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var index = serpent_get_direction(tile);
    if(index === 0 || index === 1){
        var p = ifexists(tile.segment_list[index]);
        tile.rotate = 1 - p.x + p.y;
        if(p.y === 0){
            ++tile.rotate;
        }
        tile.rotate *= 90;
    }
    else if(index === 2){
        var p0 = ifexists(tile.segment_list[0]);
        var p1 = ifexists(tile.segment_list[1]);
        if(p0.x === p1.x){
            tile.pic = tile.pic_arr[0];
            tile.rotate = 0;
        }
        else if(p0.y === p1.y){
            tile.pic = tile.pic_arr[0];
            tile.rotate = 90;
        }
        else{
            tile.pic = tile.pic_arr[1];
            var x = p0.x + p1.x;
            var y = p0.y + p1.y;
            tile.rotate = (x + y + 2) / 2;
            if(x < 0 && y > 0){
                tile.rotate = 3;
            }
            tile.rotate = (tile.rotate + 2) % 4;
            tile.rotate *= 90;
        }
    }
}
/**
 * Wakes up the provided head and puts the other to sleep.
 * @param {AISelfParam} self The head to wake up.
 * @param {GameMap} map The map the snake is on.
 */
function serpent_wake(self, map){
    serpent_toggle(self.tile, 1);
    var index = serpent_get_direction(self.tile);
    var tail = serpent_other_end(self, index, map);
    serpent_toggle(tail.tile, 0);
}
/**
 * Wakes a head up or puts it to sleep.
 * @param {Tile} tile The head to alter.
 * @param {number} cycle The cycle to set it to. 1 is awake, 0 is asleep.
 */
function serpent_toggle(tile, cycle){
    if( tile.cycle === undefined || 
        tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    tile.cycle = cycle;
    tile.pic = tile.pic_arr[tile.cycle];
    if(tile.cycle === 1){
        tile.description = two_headed_serpent_awake_description;
    }
    else{
        tile.description = two_headed_serpent_asleep_description;
    }
}
/**
 * @type {AIFunction} Regrows destroyed heads and causes them to wake up. If the snake has no more body segments,
 * it will then be destroyed.
 */
function two_headed_serpent_hurt(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // New head replaces neck segment
    var index = serpent_get_direction(self.tile);
    var neck_location = self.location.plus(ifexists(self.tile.segment_list[index]));
    var neck = map.get_tile(neck_location);
    if(neck.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var regrow = {
        tile: two_headed_serpent_tile(),
        location: neck_location
    }
    if(regrow.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    regrow.tile.segment_list[index] = neck.segment_list[index];
    serpent_rotate(regrow.tile);
    neck.health = 1;
    map.attack(neck_location);
    map.add_tile(regrow.tile, neck_location);
    if(self.tile.cycle != 1){
        stun(regrow.tile);
    }
    serpent_wake(regrow, map);
    // If no segments remain, it dies.
    neck_location = regrow.location.plus(ifexists(regrow.tile.segment_list[index]));
    neck = map.get_tile(neck_location);
    if(neck.name === `Two Headed Serpent`){
        neck.on_death = undefined;
        regrow.tile.on_death = undefined;
        map.attack(neck_location);
        map.attack(regrow.location);
        boss_death(regrow, target, map);
    }
}
/** @type {TelegraphFunction} */
function two_headed_serpent_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = [];
    if(self.cycle === 0){
        return attacks;
    }
    for(var direction of HORIZONTAL_DIRECTIONS){
        attacks.push(location.plus(direction));
    }
    for(var move of HORIZONTAL_DIRECTIONS){
        if(map.check_empty(location.plus(move))){
            for(var direction of HORIZONTAL_DIRECTIONS){
                attacks.push(location.plus(move).plus(direction));
            }
        }
    }
    return attacks;
}
