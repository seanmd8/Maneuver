/** @type {TileGenerator} Generates an uncamoflauged animated boulder. */
function animated_boulder_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.animated_boulder,
        pic: `${IMG_FOLDER.tiles}animated_boulder.png`,
        description: enemy_descriptions.animated_boulder,
        tags: new TagList([TAGS.unmovable, TAGS.hidden]),
        behavior: animated_boulder_ai,
        telegraph: spider_telegraph,
        on_enter: animated_boulder_wake_up,
        on_hit: animated_boulder_wake_up,
        cycle: 0,
        look: magmatic_boulder_tile(),
    }
}

/** @type {AIFunction} AI used by animated boulders.*/
function animated_boulder_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Asleep.
        throw new Error(ERRORS.skip_animation);
    }
    if(self.tile.cycle < 0){
        // Asleep and resting.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    var nearby = order_nearby(target.difference);
    var hit = false;
    for(let space of nearby){
        // Attacks everything nearby that's not another elemental.
        var target_space = self.location.plus(space);
        if(map.is_in_bounds(target_space) && !map.get_tile(target_space).tags.has(TAGS.hidden)){
            hit = map.attack(target_space) || hit;
        }
    }
    // Gets sleepier
    --self.tile.cycle;
    if(self.tile.cycle <= 0){
        // Falls asleep.
        self.tile.look = magmatic_boulder_tile();
        self.tile.tags.add(TAGS.hidden);
        // Stays asleep for a turn before it can wake up.
        self.tile.cycle = -1;
    }
    else if(!target.difference.within_radius(1)){
        // If not asleep, moves towards the player.
        move_closer_ai(self, target, map);
    }
}
/** @type {AIFunction} animated boulder wakes up when touched.*/
function animated_boulder_wake_up(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        stun(self.tile);
        self.tile.cycle = 3;
        self.tile.look = undefined;
        self.tile.tags.remove(TAGS.hidden);
    }
}