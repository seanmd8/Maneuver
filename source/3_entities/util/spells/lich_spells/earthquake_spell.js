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
    var points = [];
    for(var i = 0; i < FLOOR_WIDTH; ++i){
        for(var j = 0; j < FLOOR_HEIGHT; ++j){
            var p = new Point(i, j);
            if(map.check_empty(p) && !p.minus(self.location).within_radius(1)){
                points.push(p);
            }
        }
    }
    map.add_event({name: event_names.earthquake, behavior: earthquake_event(amount, points)});
    var player = map.get_player_location();
    map.add_event({name: event_names.earthquake, behavior: targeted_earthquake_event([player])});
}