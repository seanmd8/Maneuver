/** @type {SpellGenerator} */
function confusion_spell_generator(){
    return {
        behavior: confusion_spell,
        telegraph: rest_spell_telegraph,
        description: confusion_spell_description,
        pic: `${IMG_FOLDER.tiles}lich_confusion.png`
    }
}

/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(self, target, map){
    for(var i = 0; i < 2; ++i){
        confuse_player();
    }
}