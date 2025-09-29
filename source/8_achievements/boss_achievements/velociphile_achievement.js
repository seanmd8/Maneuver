function velociphile_achievement(){
    return {
        name: achievement_names.velociphile,
        description: achievement_description.velociphile,
        image: `${IMG_FOLDER.tiles}velociphile.png`,
        has: false,
        boons: [roar_of_challenge],
        cards: ACHIEVEMENT_CARDS.velociphile,
    }
}