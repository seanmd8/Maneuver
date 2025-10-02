/** @type {SpellGenerator} */
function summon_spell_generator(){
    return {
        behavior: summon_spell,
        description: lich_spell_descriptions.summon,
        pic: `${IMG_FOLDER.tiles}lich_summon.png`
    }
}

/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    for(var i = 0; i < 2; ++i){
        var tile = random_from(self.tile.summons)();
        spawn_nearby(map, tile, self.location);
    }
}