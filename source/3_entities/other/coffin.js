/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function coffin_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.coffin,
        pic: `${IMG_FOLDER.tiles}coffin.png`,
        description: other_tile_descriptions.coffin,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        health: 1,
        on_enter: decay_ai,
        on_death: coffin_tile_death,
        summons: [rat_tile, carrion_flies_tile, vampire_tile, appropriate_chest_tile],
        card_drops: get_all_achievement_cards(),
    }
}

/** @type {AIFunction} Function used when a coffin is disturbed to potentially spawn something.*/
function coffin_tile_death(self, target, map){
    if( self.tile.summons === undefined ||
        self.tile.card_drops === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var new_enemy = random_from(self.tile.summons)();
    if(new_enemy.type === entity_types.chest){
        var cards = rand_no_repeats(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.larger_chests));
        for(let card of cards){
            add_card_to_chest(new_enemy, card());
        }
    }
    else{
        stun(new_enemy);
    }
    map.add_tile(new_enemy, self.location);
}