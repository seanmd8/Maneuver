/** @type {TileGenerator} */
function lich_tile(){
    var spells = [
        spell_generator(teleport_spell, teleport_spell_description, `${IMG_FOLDER.tiles}lich_teleport.png`), 
        spell_generator(summon_spell, summon_spell_description, `${IMG_FOLDER.tiles}lich_summon.png`), 
        spell_generator(earthquake_spell, earthquake_spell_description, `${IMG_FOLDER.tiles}lich_earthquake.png`), 
        spell_generator(flame_wave_spell, flame_wave_spell_description, `${IMG_FOLDER.tiles}lich_flame_wave.png`),
        spell_generator(confusion_spell, confusion_spell_description, `${IMG_FOLDER.tiles}lich_confusion.png`),
        spell_generator(lava_moat_spell, lava_moat_spell_description, `${IMG_FOLDER.tiles}lich_lava_moat.png`),
        spell_generator(rest_spell, rest_description, `${IMG_FOLDER.tiles}lich_rest.png`)
    ];
    var summons = [
        shadow_scout_tile,
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        clay_golem_tile,
        carrion_flies_tile,
        vampire_tile,
    ];
    var starting_cycle = 1;
    return{
        type: `enemy`,
        name: `lich`,
        pic: spells[starting_cycle].pic,
        description: `${lich_description}${spells[starting_cycle].description}`,
        health: 4,
        death_message: lich_death_message,
        behavior: lich_ai,
        on_death: boss_death,
        cycle: starting_cycle,
        spells,
        summons,
        card_drops: [instant_teleport, debilitating_confusion]
    }
}

/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var player_close = (target.difference.within_radius(1));
    var moves = reverse_arr(order_nearby(target.difference));
    var i;
    // Move 1 space away from the player.
    for(i = 0; i < moves.length && !map.move(self.location, self.location.plus(moves[i])); ++i){}
    if(i < moves.length){
        self.location.plus_equals(moves[i]);
        target.difference.minus_equals(moves[i]);
    }
    // Cast the current spell.
    self.tile.spells[self.tile.cycle].behavior(self, target, map);
    if(player_close){
        // If the player was next to it, prepare to teleport next turn.
        self.tile.cycle = 0;
    }
    else{
        // Otherwise prep a random spell other than teleport.
        self.tile.cycle = random_num(self.tile.spells.length - 1) + 1;
    }
    self.tile.description = `${lich_description}${self.tile.spells[self.tile.cycle].description}`;
    self.tile.pic = self.tile.spells[self.tile.cycle].pic;
}