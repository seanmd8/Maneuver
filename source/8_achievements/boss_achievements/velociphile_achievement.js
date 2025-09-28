function velociphile_achievement(){
    return {
        name: achievement_names.velociphile,
        description: achievement_description.velociphile,
        image: `${IMG_FOLDER.tiles}velociphile.png`,
        has: false,
        boons: [roar_of_challenge],
        cards: [
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
        ]
    }
}