// ToDo
//      Handle Death
//      Handle Spells
//      New Pics?
//      Test Stun immunity
//      Test Nettle immunity (along with nettle's nettle immunity)
//      Add Cards
//      Double check which things replace previous spawns and how.

//      Playtest
//      Finish Forest
//      Clean up testing, put forest into context
//      Try to beat it


/** @type {TileGenerator} */
function forest_heart_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}forest_heart.png`,
        `${IMG_FOLDER.tiles}forest_heart_invincible.png`
    ]
    var spells = [
        // Index + 1 corresponds with the health it's triggered at.
        /*1*/greater_thorn_bush_spell_generator(),
        /*2*/forest_heart_rest_spell_generator(),
        /*3*/swaying_nettle_spell_generator(),
        /*4*/living_tree_spell_generator(),
        /*5*/thorn_bush_spell_generator(),
        /*6*/rotting_fruit_spell_generator(),
        /*7*/scorpion_spell_generator(),
        /*8*/forest_heart_rest_spell_generator(),
        /*9*/thorn_bush_spell_generator(),
        /*10*/vinesnare_bush_spell_generator(),
        /*11*/forest_heart_rest_spell_generator(),
    ];
    var health = 12
    var tile = {
        type: `enemy`,
        name: `Forest Heart`,
        pic: pic_arr[0],
        description: forest_heart_description + forest_heart_rest_description,
        tags: new TagList([TAGS.boss, TAGS.unmovable, TAGS.unstunnable, TAGS.nettle_immune]),
        health: 12,
        death_message: forest_heart_death_message,
        death_achievement: achievement_names.forest_heart,
        behavior: forest_heart_ai,
        on_hit: forest_heart_on_hit,
        on_death: forest_heart_death,
        telegraph_other: rest_spell_telegraph,
        pic_arr,
        cycle: health,
        segment_list: [undefined, undefined],
        spells,
        card_drops: [snack, branch_strike]
    }
    if(GS.boons.has(boon_names.boss_slayer)){
        tile.health -= 2;
        var next_spell = spells[tile.health - 2];
        tile.description = forest_heart_description + next_spell.description;
        tile.pic = next_spell.pic;
        tile.telegraph_other = next_spell.telegraph_other;
    }
    return tile;
}

/** @type {AIFunction} */
function forest_heart_ai(self, target, map){
    if( self.tile.cycle === undefined || // Make sure it checks for correct fields
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health === undefined){
        // Performs the action corresponding to the current health.
        self.tile.spells[self.tile.cycle - 1].behavior(self, target, map);
        if(self.tile.cycle === 0){
            return;
        }
        // Makes it vulnerable again
        var sections = get_forest_heart_sections(self, map);
        var health = self.tile.cycle;
        var next_spell = self.tile.spells[health - 2];
        if(health > 1){
            map.add_event({name: `spell announcement`, behavior: () => {say_record(next_spell.description)}});
        }
        for(var section of sections){
            var tile = section.tile;
            tile.health = health;
            tile.pic = tile.pic_arr[0];
            if(tile.health > 1){
                tile.description = forest_heart_description + next_spell.description;
                tile.pic = next_spell.pic;
                tile.telegraph_other = next_spell.telegraph_other;
            }
        }
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {AIFunction} */
function forest_heart_on_hit(self, target, map){
    // Removes health so it can't be damaged again this turn.
    if(self.tile.health !== undefined && self.tile.health > 0){
        var sections = get_forest_heart_sections(self, map);
        var health = self.tile.health;
        for(var section of sections){
            var tile = section.tile;
            // cycle stores the health value so it can be restored.
            tile.cycle = health;
            tile.health = undefined;
            tile.pic = tile.pic_arr[1];
        }
    }
}

/**
 * Function to get an array of each tile in a Forest Heart.
 * @param {AISelfParam} self The tile and location of one section.
 * @param {GameMap} map The map used to locate the sections.
 * @returns {AISelfParam[]} An array with each tile and location in the Forest Heart.
 */
function get_forest_heart_sections(self, map){
    if(self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var tiles = [self];
    // Goes one direction
    var current = self.tile.segment_list[0];
    var next_location = self.location;
    while(current != undefined){
        next_location = next_location.plus(current);
        var next_tile = map.get_tile(next_location);
        if(next_tile.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        tiles.push({
            tile: next_tile,
            location: next_location
        });
        current = next_tile.segment_list[0]
    }
    // Goes the other
    current = self.tile.segment_list[1];
    next_location = self.location;
    while(current != undefined){
        next_location = next_location.plus(current);
        var next_tile = map.get_tile(next_location);
        if(next_tile.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        tiles.push({
            tile: next_tile,
            location: next_location
        });
        current = next_tile.segment_list[1]
    }
    return tiles;
}

/** @type {AIFunction} */
function forest_heart_death(self, target, map){
    var sections = get_forest_heart_sections(self, map);
    for(var section of sections){
        section.tile.on_hit = undefined;
        section.tile.on_death = undefined;
        section.tile.health = 1;
        map.attack(section.location);
    }
    boss_death(self, target, map);
}