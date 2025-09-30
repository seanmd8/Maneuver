/** @type {TileGenerator} */
function spider_web_tile(){
    var spawn_timer = 2
    return{
        type: entity_types.enemy,
        name: enemy_names.spider_web,
        pic: `${IMG_FOLDER.tiles}spider_web.png`,
        description: 
            `${enemy_descriptions.spider_web[0]}${spawn_timer + 1}`
            +`${enemy_descriptions.spider_web[1]}`,
        tags:  new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 4,
        behavior: spider_web_ai,
        cycle: 0,
        spawn_timer
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function spider_web_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    else{
        // Attempts to spawn a spider nearby and resets cycle.
        spawn_nearby(map, spider_tile(), self.location);
        self.tile.cycle = 0;
        ++self.tile.spawn_timer;
    }
}