/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(self, target, map){
    if(self.tile.death_message === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.card_drops !== undefined && self.tile.card_drops.length > 0){
        // Create a chest containing a random card from it's loot table.
        var chest = appropriate_chest_tile();
        var cards = rand_no_repeates(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.hoarder));
        for(var card of cards){
            add_card_to_chest(chest, card());
        }
        map.add_tile(chest, self.location);
    }
    map.unlock();
    var death_message = `${self.tile.death_message}\n${boss_death_description}`;
    var player_tile = map.get_player();
    if( // Practice makes perfect
        GS.boons.has(boon_names.practice_makes_perfect) && 
        player_tile.max_health !== undefined && 
        player_tile.max_health === player_tile.health
    ){
        ++player_tile.max_health;
        death_message = `${death_message}\n${practice_makes_perfect_message}`
    }
    map.player_heal(new Point(0, 0));
    say(death_message);

}