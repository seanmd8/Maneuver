
BOON_LIST = [
    ancient_card, bitter_determination, brag_and_boast, creative, escape_artist, 
    expend_vitality, fleeting_thoughts, fortitude, hoarder, pain_reflexes, 
    picky_shopper, rebirth, repetition, roar_of_challenge, safe_passage, 
    serenity, spiked_shoes, spontaneous, stable_mind, stealthy,
];

/**
 * Checks to make sure there is no previous player on_hit function since they are mutually exclusive.
 * @returns 
 */
function no_player_on_hit(){
    return GS.map.get_player().on_hit === undefined;
}

function change_max_health(amount){
    GS.map.get_player().max_health += amount;
    GS.map.get_player().health = Math.min(GS.map.get_player().max_health, GS.map.get_player().health)
}