function forest_heart_achievement(){
    return {
        name: achievement_names.forest_heart,
        description: achievement_description.forest_heart,
        pic: `${IMG_FOLDER.tiles}forest_heart.png`,
        has: false,
        boons: [frugivore],
        cards: []
    }
}