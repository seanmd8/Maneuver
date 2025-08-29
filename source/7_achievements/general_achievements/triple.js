function triple_achievement(){
    return {
        name: achievement_names.triple,
        description: achievement_description.triple,
        image: `${IMG_FOLDER.achievements}triple.png`,
        has: false,
        boons: [duplicate],
    }
}