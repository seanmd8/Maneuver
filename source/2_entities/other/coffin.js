/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function coffin_tile(){
    return {
        type: `terrain`,
        name: `coffin`,
        pic: `${IMG_FOLDER.tiles}coffin.png`,
        description: coffin_description,
        health: 1,
        on_enter: decay_ai,
        on_death: coffin_tile_death,
        summons: [chest_tile],//rat_tile, carrion_flies_tile, vampire_tile, shadow_scout_tile, chest_tile],
        card_drops: RARE_CARD_CHOICES
    }
}

/** @type {AIFunction} Function used when a coffin is disturbed to potentially spawn something.*/
function coffin_tile_death(self, target, map){
    if( self.tile.summons === undefined ||
        self.tile.card_drops === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var new_enemy = self.tile.summons[random_num(self.tile.summons.length)]();
    if(new_enemy.type === `chest`){
        var cards = rand_no_repeates(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.hoarder));
        for(let card of cards){
            add_card_to_chest(new_enemy, card());
        }
    }
    else{
        stun(new_enemy);
    }
    map.add_tile(new_enemy, self.location);
}