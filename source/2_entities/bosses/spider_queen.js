/** @type {TileGenerator} */
function spider_queen_tile(){
    var health = 3;
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    return{
        type: `enemy`,
        name: `Spider Queen`,
        pic: `${IMG_FOLDER.tiles}spider_queen.png`,
        description: spider_queen_description,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: spider_queen_death_message,
        death_achievement: achievement_names.spider_queen,
        behavior: spider_ai,
        telegraph: spider_telegraph,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        card_drops: [skitter, bite, chomp]
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