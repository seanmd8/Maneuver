function clumsy_achievement(){
    return {
        name: achievement_names.clumsy,
        description: achievement_description.clumsy,
        pic: `${IMG_FOLDER.achievements}clumsy.png`,
        has: false,
        boons: [thick_soles],
    }
}