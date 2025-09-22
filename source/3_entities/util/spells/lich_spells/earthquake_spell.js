/** @type {SpellGenerator} */
function earthquake_spell_generator(){
    return {
        behavior: earthquake_spell,
        description: lich_spell_descriptions.earthquake,
        pic: `${IMG_FOLDER.tiles}lich_earthquake.png`
    }
}

/** @type {AIFunction} Spell which causes an earthquake causing debris to rain from the ceiling.*/
function earthquake_spell(self, target, map){
    var amount = random_num(9) + random_num(9) + random_num(9) + random_num(9);
    map.add_event({name: event_names.earthquake, behavior: earthquake_event(amount)});
    var player = map.get_player_location();
    map.add_event({name: event_names.earthquake, behavior: targeted_earthquake_event([player])});
}