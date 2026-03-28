function velociphile_achievement(){
    return {
        name: achievement_names.velociphile,
        description: achievement_description.velociphile,
        pic: `${IMG_FOLDER.tiles}velociphile.png`,
        has: false,
        boons: [boss_slayer],
        cards: ACHIEVEMENT_CARDS.velociphile,
    }
}