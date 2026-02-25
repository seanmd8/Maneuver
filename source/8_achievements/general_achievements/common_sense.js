function common_sense_achievement(){
    return {
        name: achievement_names.common_sense,
        description: achievement_description.common_sense,
        pic: `${IMG_FOLDER.achievements}common_sense.png`,
        has: false,
        boons: [picky_shopper],
    }
}