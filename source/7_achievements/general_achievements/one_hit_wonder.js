function one_hit_wonder_achievement(){
    return {
        name: achievement_names.one_hit_wonder,
        description: achievement_description.one_hit_wonder,
        image: `${IMG_FOLDER.achievements}one_hit_wonder.png`,
        has: false,
        boons: [boss_slayer],
    }
}