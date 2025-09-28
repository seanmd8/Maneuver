function two_headed_serpent_achievement(){
    return {
        name: achievement_names.two_headed_serpent,
        description: achievement_description.two_headed_serpent,
        image: `${IMG_FOLDER.tiles}serpent_head.png`,
        has: false,
        boons: [slime_trail],
        cards: [
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
        ]
    }
}