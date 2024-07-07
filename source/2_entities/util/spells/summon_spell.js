/** @type {SpellGenerator} */
function summon_spell_generator(){
    return {
        behavior: summon_spell,
        description: summon_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_summon.png`
    }
}

/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var tile = self.tile.summons[random_num(self.tile.summons.length)]();
    spawn_nearby(map, tile, self.location);
}