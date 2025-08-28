
function shrug_it_off_achievement(){
    return {
        name: achievement_names.shrug_it_off,
        description: achievement_description.shrug_it_off,
        image: `${IMG_FOLDER.achievements}shrug_it_off.png`,
        has: false,
        boons: [quick_healing],
    }
}