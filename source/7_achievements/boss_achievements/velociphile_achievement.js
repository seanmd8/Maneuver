function velociphile_achievement(){
    return {
        name: achievement_names.velociphile,
        description: achievement_description.velociphile,
        image: `${IMG_FOLDER.tiles}velociphile.png`,
        has: false,
        boons: [boss_slayer],
        cards: [
            teleport, sidestep_e, sidestep_n, sidestep_ne, sidestep_nw, 
            sidestep_s, sidestep_se, sidestep_sw, sidestep_w, punch_orthogonal, 
            punch_diagonal
        ]
    }
}