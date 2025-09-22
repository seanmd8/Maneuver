const LICH_SPELLS = [
    summon_spell_generator(), 
    earthquake_spell_generator(), 
    flame_wave_spell_generator(),
    confusion_spell_generator(),
    lava_moat_spell_generator(),
    piercing_beam_spell_generator(),
]
const LICH_UTIL_SPELLS = [
    rest_spell_generator(),
    teleport_spell_generator(), 
]
/** @type {TileGenerator} */
function lich_tile(){
    var summons = [
        clay_golem_tile,
        darkling_tile,
        maw_tile,
        shadow_knight_tile,
        shadow_scout_tile,
        specter_tile,
        vampire_tile,
    ];
    var tile = {
        type: entity_types.enemy,
        name: boss_names.lich,
        display_pic: `${IMG_FOLDER.tiles}lich_rest.png`,
        tags: new TagList([TAGS.boss]),
        health: 4,
        death_message: boss_death_message.lich,
        death_achievement: achievement_names.lich,
        behavior: lich_ai,
        telegraph: lich_telegraph,
        telegraph_other: lich_telegraph_other,
        on_hit: lich_hit,
        on_death: boss_death,
        spells: [...LICH_SPELLS],
        summons,
        card_drops: BOSS_CARDS.lich
    }
    lich_prep(tile, -2);
    return tile;
}

/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === -2){
        // Move away and prepare the next spell.
        var moves = reverse_arr(order_nearby(target.difference));
        for(var i = 0; i < moves.length && !map.check_empty(self.location.plus(moves[i])); ++i){}
        if(i >= moves.length){
            // If stuck, prep teleport.
            lich_prep(self.tile, -1);
        }
        else{
            map.move(self.location, self.location.plus(moves[i]));
            lich_prep(self.tile, random_num(self.tile.spells.length));
        }
    }
    else if(self.tile.cycle === -1){
        // Cast teleport.
        LICH_UTIL_SPELLS[1].behavior(self, target, map);
        lich_prep(self.tile, -2);
    }
    else{
        // Cast the current spell.
        self.tile.spells[self.tile.cycle].behavior(self, target, map);
        self.tile.spells.splice(self.tile.cycle, 1);
        if(self.tile.spells.length === 0){
            self.tile.spells = [...LICH_SPELLS];
        }
        lich_prep(self.tile, -2);
    }
}

/** @type {TelegraphFunction} */
function lich_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.cycle < 0 ? LICH_UTIL_SPELLS[self.cycle + 2] : self.spells[self.cycle];
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
    var spell = self.cycle < 0 ? LICH_UTIL_SPELLS[self.cycle + 2] : self.spells[self.cycle];
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
    if(self.tile.cycle !== -1){
        if(self.tile.cycle >= 0){
            self.tile.spells.splice(self.tile.cycle, 1);
            if(self.tile.spells.length === 0){
                self.tile.spells = [...LICH_SPELLS];
            }
        }
        lich_prep(self.tile, -1, true);
    }
}

// Function to prep a new spell.
function lich_prep(tile, cycle, change = false){
    var spell = cycle < 0 ? LICH_UTIL_SPELLS[cycle + 2] : tile.spells[cycle];
    tile.cycle = cycle;
    tile.description = 
        `${boss_descriptions.lich}\n`
        +`${boss_descriptions.lich_announcement}\n`
        +`${spell.description}`;
    tile.pic = spell.pic;
    var announcement = 
        (change ? 
            `${boss_descriptions.lich_change_announcement}\n` : 
            `${boss_descriptions.lich_announcement}\n`)
        +`${spell.description}`;
    say_record(announcement);
}