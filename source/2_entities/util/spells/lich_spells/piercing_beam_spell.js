/** @type {SpellGenerator} */
function piercing_beam_spell_generator(){
    return {
        behavior: piercing_beam_spell,
        telegraph: piercing_beam_spell_telegraph,
        description: lich_spell_descriptions.piercing_beam,
        pic: `${IMG_FOLDER.tiles}lich_piercing_beam.png`
    }
}

/** @type {AIFunction} Spell which damages each tile in a single direction.*/
function piercing_beam_spell(self, target, map){
    var aim_direction = order_nearby(target.difference)[0];
    var beam_location = self.location.plus(aim_direction);
    while(map.is_in_bounds(beam_location)){
        map.attack(beam_location);
        beam_location.plus_equals(aim_direction);
    }
}

/** @type {TelegraphFunction} */
function piercing_beam_spell_telegraph(location, map, self){
    var attacks = [];
    var nearby = random_nearby();
    for(var direction of nearby){
        var beam_location = location.plus(direction);
        while(map.is_in_bounds(beam_location)){
            attacks.push(beam_location.copy());
            beam_location.plus_equals(direction);
        }
    }
    return attacks;
}