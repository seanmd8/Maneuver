
BOON_LIST = [
    ancient_card, ancient_card_2, bitter_determination, boss_slayer, brag_and_boast, 
    chilly_presence, creative, dazing_blows, empty_rooms, escape_artist, 
    expend_vitality, fleeting_thoughts, fortitude, frugivore, future_sight, 
    larger_chests, limitless, pacifism, pain_reflexes, perfect_the_basics, 
    picky_shopper, practice_makes_perfect, pressure_points, rebirth, repetition, 
    retaliate, roar_of_challenge, safe_passage, serenity, spiked_shoes, 
    spontaneous, stable_mind, stealthy
];

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