/** @type {SpellGenerator} */
function rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph: rest_spell_telegraph,
        description: lich_spell_descriptions.rest,
        pic: `${IMG_FOLDER.tiles}lich_rest.png`
    }
}

/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(self, target, map){}

/** @type {TelegraphFunction} */
function rest_spell_telegraph(location, map, self){
    return [];
}