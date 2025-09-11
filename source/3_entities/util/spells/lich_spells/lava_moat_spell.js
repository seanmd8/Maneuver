/** @type {SpellGenerator} */
function lava_moat_spell_generator(){
    return {
        behavior: lava_moat_spell,
        description: lich_spell_descriptions.lava_moat,
        pic: `${IMG_FOLDER.tiles}lich_lava_moat.png`
    }
}

/** @type {AIFunction} Spell which creates several lava pools between the user and their target.*/
function lava_moat_spell(self, target, map){
    var nearby = order_nearby(target.difference);
    var amount = random_num(2) + 2;
    for(var i = 0; i < amount; ++i){
        var tile = lava_pool_tile();
        spawn_nearby(map, tile, self.location, nearby);
    }
}