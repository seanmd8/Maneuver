function without_a_scratch_achievement(){
    return {
        name: achievement_names.without_a_scratch,
        description: achievement_description.without_a_scratch,
        image: `${IMG_FOLDER.achievements}without_a_scratch.png`,
        has: false,
        boons: [practice_makes_perfect],
    }
}