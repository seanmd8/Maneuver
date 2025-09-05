function not_my_fault_achievement(){
    return {
        name: achievement_names.not_my_fault,
        description: achievement_description.not_my_fault,
        image: `${IMG_FOLDER.achievements}not_my_fault.png`,
        has: false,
        boons: [pressure_points],
    }
}