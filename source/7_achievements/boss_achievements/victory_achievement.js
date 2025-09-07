function victory_achievement(){
    return {
        name: achievement_names.victory,
        description: achievement_description.victory,
        image: `${IMG_FOLDER.achievements}victory.png`,
        has: false,
        boons: [vicious_cycle],
        cards: []
    }
}