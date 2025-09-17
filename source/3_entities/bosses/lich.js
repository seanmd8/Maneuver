/** @type {TileGenerator} */
function lich_tile(){
    var spells = [
        rest_spell_generator(),
        teleport_spell_generator(), 
        summon_spell_generator(), 
        earthquake_spell_generator(), 
        flame_wave_spell_generator(),
        confusion_spell_generator(),
        lava_moat_spell_generator(),
        piercing_beam_spell_generator(),
    ];
    var summons = [
        shadow_scout_tile,
        shadow_knight_tile,
        ram_tile,
        rat_tile,
        clay_golem_tile,
        vampire_tile,
        maw_tile,
        pheonix_tile,
        darkling_tile,
    ];
    var starting_cycle = 0;
    return{
        type: entity_types.enemy,
        name: boss_names.lich,
        pic: spells[starting_cycle].pic,
        display_pic: `${IMG_FOLDER.tiles}lich_rest.png`,
        description: 
            `${boss_descriptions.lich}\n`
            +`${boss_descriptions.lich_announcement}\n`
            +`${spells[starting_cycle].description}`,
        tags: new TagList([TAGS.boss]),
        health: 4,
        death_message: boss_death_message.lich,
        death_achievement: achievement_names.lich,
        behavior: lich_ai,
        telegraph: lich_telegraph,
        telegraph_other: lich_telegraph_other,
        on_hit: lich_hit,
        on_death: boss_death,
        cycle: starting_cycle,
        spells,
        summons,
        card_drops: BOSS_CARDS.lich
    }
}

/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Move away and prepare the next spell.
        var player_close = (target.difference.within_radius(1));
        var moves = reverse_arr(order_nearby(target.difference));
        for(var i = 0; i < moves.length && !map.check_empty(self.location.plus(moves[i])); ++i){}
        if(i < moves.length){
            map.move(self.location, self.location.plus(moves[i]));
        }
        if(self.tile.cycle === 0){
            self.tile.cycle = random_num(self.tile.spells.length - 2) + 2;
        }
        if(player_close || i >= moves.length){
            self.tile.cycle = 1;
        }
    }
    else{
        // Cast the current spell.
        self.tile.spells[self.tile.cycle].behavior(self, target, map);
        self.tile.cycle = 0;
    }
    self.tile.description = 
        `${boss_descriptions.lich}\n`
        +`${boss_descriptions.lich_announcement}\n`
        +`${self.tile.spells[self.tile.cycle].description}`;
    self.tile.pic = self.tile.spells[self.tile.cycle].pic;
    var announcement = 
        `${boss_descriptions.lich_announcement}\n`
        +`${self.tile.spells[self.tile.cycle].description}`;
    map.add_event({name: event_names.spell_announcement, behavior: () => {say_record(announcement)}});
}

/** @type {TelegraphFunction} */
function lich_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.spells[self.cycle]
    if(spell.telegraph !== undefined){
        return spell.telegraph(location, map, self);
    }
    return rest_spell_telegraph(location, map, self)
}

/** @type {TelegraphFunction} */
function lich_telegraph_other(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.spells[self.cycle]
    if(spell.telegraph_other !== undefined){
        return spell.telegraph_other(location, map, self);
    }
    return rest_spell_telegraph(location, map, self)
}

/** @type {AIFunction} Function used when the lich is hit to have it prep teleport.*/
function lich_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 1;
    self.tile.description = 
        `${boss_descriptions.lich}\n`
        +`${boss_descriptions.lich_announcement}\n`
        +`${self.tile.spells[self.tile.cycle].description}`;
    self.tile.pic = self.tile.spells[self.tile.cycle].pic;
}