/** @type {TileGenerator} */
function claustropede_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede,
        pic: `${IMG_FOLDER.tiles}claustropede_3.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 3,
        difficulty: 5,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}

/** @type {AIFunction} AI used by claustropedes.*/
function claustropede_ai(self, target, map){
    if(self.tile.cycle === 1){
        self.tile.cycle = 0;
        var copy = claustropede_tile();
        var health = self.tile.health;
        copy.health = health;
        var pic = `${IMG_FOLDER.tiles}claustropede_3.png`;
        switch(health){
            case 2:
                pic = `${IMG_FOLDER.tiles}claustropede_2.png`;
                break;
            case 1:
                pic = `${IMG_FOLDER.tiles}claustropede_1.png`;
                break;
        }
        self.tile.pic = pic;
        copy.pic = pic;
        
        teleport_spell(self, target, map);
        map.spawn_safely(copy, 5, true);
    }
    else{
        spider_ai(self, target, map);
    }
}

/** @type {AIFunction}*/
function claustropede_hit(self, target, map){
    self.tile.cycle = 1;
}

/** @type {TelegraphFunction} */
function claustropede_telegraph(location, map, self){
    if(self.cycle === 0){
        return spider_telegraph(location, map, self);
    }
    return [];
}