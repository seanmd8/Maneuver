/** @type {TileGenerator} */
function clay_golem_tile(){
    return {
        type: `enemy`,
        name: enemy_names.clay_golem,
        pic: `${IMG_FOLDER.tiles}clay_golem.png`,
        description: enemy_descriptions.clay_golem,
        tags: new TagList(),
        health: 3,
        difficulty: 4,
        behavior: clay_golem_ai,
        telegraph: spider_telegraph,
        on_hit: clay_golem_hit,
        cycle: 1
    }
}

/** @type {AIFunction} AI used by clay golems.*/
function clay_golem_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = 1;
    }
    else if(self.tile.cycle === 1){
        // Otherwise, move closer if it didn't move last turn.
        move_closer_ai(self, target, map);
        self.tile.cycle = 0;
    }
    else{
        // Otherwise, it moved last turn so don't move.
        self.tile.cycle = 1;
    }
}
/** @type {AIFunction} Function used when clay golems are hit to stun them.*/
function clay_golem_hit(self, target, map){
    stun(self.tile);
}