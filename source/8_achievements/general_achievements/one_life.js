function one_life_achievement(){
    return {
        name: achievement_names.one_life,
        description: achievement_description.one_life,
        pic: `${IMG_FOLDER.achievements}one_life.png`,
        has: false,
        boons: [frenzy],
    }
}