/** @type {TileGenerator} */
function spider_queen_tile(){
    var health = 3;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: entity_types.enemy,
        name: boss_names.spider_queen,
        pic: `${IMG_FOLDER.tiles}spider_queen.png`,
        description: boss_descriptions.spider_queen,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: boss_death_message.spider_queen,
        death_achievement: achievement_names.spider_queen,
        behavior: spider_ai,
        telegraph: spider_telegraph,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        card_drops: BOSS_CARDS.spider_queen
    }
}

/** @type {AIFunction} Function used when the spider queen is hit to stun her and spawn a spider.*/
function spider_queen_hit(self, target, map){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(self.tile);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, self.location);
}