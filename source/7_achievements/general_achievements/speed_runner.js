
function speed_runner_achievement(){
    return {
        name: achievement_names.speed_runner,
        description: achievement_description.speed_runner,
        image: `${IMG_FOLDER.achievements}speed_runner.png`,
        has: false,
        boons: [repetition],
    }
}