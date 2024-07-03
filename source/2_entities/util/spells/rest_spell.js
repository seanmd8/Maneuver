/** @type {SpellGenerator} */
function rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph: rest_spell_telegraph,
        description: rest_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_rest.png`
    }
}

/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(self, target, map){}

/** @type {TelegraphFunction} */
function rest_spell_telegraph(location, map, self){
    return [];
}