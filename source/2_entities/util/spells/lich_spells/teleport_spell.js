/** @type {SpellGenerator} */
function teleport_spell_generator(){
    return {
        behavior: teleport_spell,
        description: lich_spell_descriptions.teleport,
        pic: `${IMG_FOLDER.tiles}lich_teleport.png`
    }
}

/** @type {AIFunction} Spell which teleports the user to a random location.*/
function teleport_spell(self, target, map){
    var space = map.random_empty();
    if(map.move(self.location, space)){
        self.location.x = space.x;
        self.location.y = space.y;
    }
}