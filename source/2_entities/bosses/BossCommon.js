/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(self, target, map){
    if(self.tile.death_message === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.card_drops !== undefined && self.tile.card_drops.length > 0){
        // Create a chest containing a random card from it's loot table.
        var chest = chest_tile();
        var cards = rand_no_repeates(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.hoarder));
        for(var card of cards){
            add_card_to_chest(chest, card());
        }
        map.add_tile(chest, self.location);
    }
    display.display_message(UIIDS.display_message, `${self.tile.death_message}\n${boss_death_description}`);
    map.unlock();
}