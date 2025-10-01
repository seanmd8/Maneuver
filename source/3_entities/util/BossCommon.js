/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(self, target, map){
    if(
        self.tile.death_message === undefined ||
        self.tile.death_achievement === undefined
    ){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.card_drops !== undefined && self.tile.card_drops.length > 0){
        // Create a chest containing a random card from it's loot table.
        var chest = appropriate_chest_tile();
        var drops = self.tile.card_drops.map((c) => {return c()});
        var contents = rand_no_repeats(drops, 1 + 2 * GS.boons.has(boon_names.larger_chests));
        if(chance(1, 2) && filter_new_cards(contents).length === 0){
            var replace_list = filter_new_cards(drops);
            if(replace_list.length > 0){
                contents[0] = rand_from(replace_list);
            }
        }
        for(var card of contents){
            add_card_to_chest(chest, card);
        }
        map.add_tile(chest, self.location);
    }
    map.unlock();
    var death_message = `${self.tile.death_message}\n${boss_death_message.general}`;
    var player_tile = map.get_player();
    if(player_tile.max_health === 1){
        GS.achieve(achievement_names.one_life);
    }
    var stats = map.stats.get_stats();
    if(stats.player_boss_damage === 0){
        GS.achieve(achievement_names.not_my_fault);
    }
    if(stats.boss_kill_start === stats.turn_number){
        GS.achieve(achievement_names.one_hit_wonder);
    }
    if( // Practice makes perfect
        GS.boons.has(boon_names.practice_makes_perfect) && 
        player_tile.max_health !== undefined && 
        player_tile.max_health === player_tile.health
    ){
        ++player_tile.max_health;
        death_message = `${death_message}\n${boon_messages.practice_makes_perfect}`
    }
    map.player_heal(new Point(0, 0));
    var new_boss_kill = GS.achieve(self.tile.death_achievement);
    if(new_boss_kill && GS.data.achievements.count_bosses() === 5){
        GS.achieve(achievement_names.monster_hunter);
    }
    
    say_record(death_message);
}