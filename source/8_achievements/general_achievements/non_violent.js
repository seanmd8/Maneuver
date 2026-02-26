function non_violent_achievement(){
    return {
        name: achievement_names.non_violent,
        description: achievement_description.non_violent,
        pic: `${IMG_FOLDER.achievements}non_violent.png`,
        has: false,
        boons: [pacifism],
    }
}