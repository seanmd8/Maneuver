const BOON_LIST = [
    ancient_card, ancient_card_2, bitter_determination, blood_alchemy, boss_slayer, 
    brag_and_boast, chilly_presence, choose_your_path, clean_mind, creative, 
    dazing_blows, duplicate, empty_rooms, escape_artist, expend_vitality, 
    flame_strike, flame_worship, fleeting_thoughts, fortitude, frenzy, 
    frugivore, future_sight, gruntwork, hoarder, larger_chests, 
    limitless, manic_presence, pacifism, pain_reflexes, perfect_the_basics, 
    picky_shopper, practice_makes_perfect, pressure_points, quick_healing, rebirth, 
    repetition, retaliate, rift_touched, roar_of_challenge, safe_passage, 
    shattered_glass, skill_trading, slime_trail, sniper, spiked_shoes, 
    spontaneous, stable_mind, stealthy, stubborn, thick_soles, 
    vicious_cycle
];

function change_max_health(amount){
    if(GS.map.get_player().max_health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    GS.map.get_player().max_health += amount;
    GS.map.get_player().health = Math.min(GS.map.get_player().max_health, GS.map.get_player().health);
}

function max_health_at_least(amount){
    var max_health = GS.map.get_player().max_health;
    return max_health !== undefined && max_health > amount;
}

function get_locked_boons(){
    var list = [];
    GS.data.achievements.all().map((a) => {
        if(a.boons!== undefined && !a.has){
            list.push(...a.boons);
        }
    });
    return list;
}

function filter_new_boons(boons){
    return boons.filter((b) => {
        return !GS.data.boons.has(b.name);
    });
}