function minimalist_achievement(){
    return {
        name: achievement_names.minimalist,
        description: achievement_description.minimalist,
        image: `${IMG_FOLDER.achievements}minimalist.png`,
        has: false,
        boons: [stubborn],
    }
}