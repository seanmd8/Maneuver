
function forest_heart_achievement(){
    return {
        name: achievement_names.forest_heart,
        description: achievement_description.forest_heart,
        image: `${IMG_FOLDER.tiles}forest_heart.png`,
        has: false,
        boons: [frugivore],
        cards: []
    }
}