
BOON_LIST = [
    ancient_card, bitter_determination, brag_and_boast, creative, escape_artist, 
    expend_vitality, fleeting_thoughts, fortitude, future_sight, hoarder, 
    limitless, pacifism, pain_reflexes, picky_shopper, rebirth, 
    repetition, roar_of_challenge, safe_passage, serenity, spiked_shoes, 
    spontaneous, stable_mind, stealthy,
];

/**
 * Checks to make sure there is no previous player on_hit function since they are mutually exclusive.
 * @returns 
 */
function no_player_on_hit(){
    return GS.map.get_player().on_hit === undefined;
}

function change_max_health(amount){
    if(GS.map.get_player().max_health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    GS.map.get_player().max_health += amount;
    GS.map.get_player().health = Math.min(GS.map.get_player().max_health, GS.map.get_player().health)
}

function max_health_at_least(amount){
    var max_health = GS.map.get_player().max_health;
    return max_health !== undefined && max_health > amount;
}