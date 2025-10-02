function blessed_achievement(){
    return {
        name: achievement_names.blessed,
        description: achievement_description.blessed,
        image: `${IMG_FOLDER.achievements}blessed.png`,
        has: false,
        boons: [larger_chests],
    }
}