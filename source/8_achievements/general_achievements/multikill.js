function multikill_achievement(){
    return {
        name: achievement_names.multikill,
        description: achievement_description.multikill,
        pic: `${IMG_FOLDER.achievements}multikill.png`,
        has: false,
        boons: [shattered_glass],
    }
}