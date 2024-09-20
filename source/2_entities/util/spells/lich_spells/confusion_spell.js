/** @type {SpellGenerator} */
function confusion_spell_generator(){
    return {
        behavior: confusion_spell,
        telegraph_other: confusion_spell_telegraph,
        description: confusion_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_confusion.png`
    }
}

/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(self, target, map){
    for(var i = 0; i < 2; ++i){
        map.stun_tile(self.location.plus(target.difference));
    }
}

/** @type {TelegraphFunction} Shows that the player will be confused.*/
function confusion_spell_telegraph(location, map, self){
    return [map.get_player_location()];
}