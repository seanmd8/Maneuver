const BOON_LIST = [
    ancient_card, 
    ancient_card_2, 
    bitter_determination, 
    blood_alchemy, 
    boss_slayer, 
    brag_and_boast, 
    burn_bright,
    chilly_presence, 
    choose_your_path, 
    clairvoyance, 
    clean_mind, 
    creative, 
    dazing_blows, 
    delayed_strike, 
    duplicate, 
    empty_rooms, 
    escape_artist, 
    expend_vitality, 
    flame_strike, 
    flame_worship, 
    fleeting_thoughts, 
    fortitude, 
    frenzy, 
    frugivore, 
    gruntwork, 
    hoarder, 
    larger_chests, 
    limitless, 
    malicious_greeting,
    manic_presence, 
    medical_investment,
    pacifism, 
    pain_reflexes, 
    pandoras_box, 
    perfect_the_basics, 
    picky_shopper, 
    practice_makes_perfect, 
    pressure_points, 
    quick_healing, 
    rebirth, 
    repetition, 
    retaliate, 
    rift_touched, 
    roar_of_challenge, 
    safe_passage, 
    shattered_glass, 
    skill_trading, 
    slime_trail, 
    sniper, 
    soul_voucher, 
    spiked_shoes, 
    spontaneous, 
    stable_mind, 
    stealthy, 
    stubborn, 
    thick_soles, 
    vicious_cycle,
    world_shaper,
];

function change_max_health(amount){
    if(GS.map.get_player().max_health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    GS.map.get_player().max_health += amount;
    GS.map.get_player().health = Math.min(GS.map.get_player().max_health, GS.map.get_player().health);
}

function max_health_greater_than(amount){
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

function filter_cost_boons(boons){
    return boons.filter((b) => {
        return b.cost_description !== undefined;
    });
}

function remake_boons(boon_names){
    var boons = [...BOON_LIST];
    boons = boons.sort((a, b) => {
        if(a().name < b().name){
            return -1;
        }
        return 1;
    });
    var f = (a, b) => {
        var name = a().name;
        if(name < b){
            return -1;
        }
        if(name > b){
            return 1;
        }
        return 0;
    }
    var list = [];
    for(var name of boon_names){
        var index = binary_search(boons, name, f);
        if(index > 0){
            list.push(boons[index]());
        }
        else{
            list.push(symbol_card_info_missing());
        }
    }
    for(var boon of list){
        boon.description = explain_boon_with_stats(boon);
    }
    return list;
}