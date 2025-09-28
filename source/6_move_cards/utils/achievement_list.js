const ACHIEVEMENT_CARDS = {
    velociphile: [
        punch_orthogonal, 
        punch_diagonal, 
        sidestep_e, 
        sidestep_n, 
        sidestep_ne, 
        sidestep_nw, 
        sidestep_s, 
        sidestep_se, 
        sidestep_sw, 
        sidestep_w, 
        teleport,
    ],
    spider_queen: [
        stunning_leap_vertical, 
        stunning_leap_horizontal, 
        stunning_punch_diagonal, 
        stunning_punch_orthogonal, 
        stunning_retreat, 
        stunning_slice, 
        stunning_tread_diagonal, 
        stunning_tread_orthogonal, 
    ],
    two_headed_serpent: [
        reckless_attack_left, 
        reckless_attack_right, 
        reckless_leap_forwards, 
        reckless_leap_left, 
        reckless_leap_right, 
        reckless_sidestep_diagonal, 
        reckless_sidestep_orthogonal, 
        reckless_spin,
        reckless_sprint, 
        reckless_teleport, 
    ],
}
Object.freeze(ACHIEVEMENT_CARDS);

function get_achievement_cards(){
    var list = [];
    GS.data.achievements.completed().map((a) => {
        if(a.cards !== undefined){
            list.push(...a.cards);
        }
    });
    return list;
}
function get_locked_achievement_cards(){
    var list = [];
    GS.data.achievements.all().map((a) => {
        if(a.cards !== undefined && !a.has){
            list.push(...a.cards);
        }
    });
    return list;
}
function get_all_achievement_cards(){
    var list = [];
    get_achievements().map((a) => {
        if(a.cards !== undefined){
            list.push(...a.cards);
        }
    });
    return list;
}
