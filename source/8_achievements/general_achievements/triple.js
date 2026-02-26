function triple_achievement(){
    return {
        name: achievement_names.triple,
        description: achievement_description.triple,
        pic: `${IMG_FOLDER.achievements}triple.png`,
        has: false,
        boons: [duplicate],
    }
}