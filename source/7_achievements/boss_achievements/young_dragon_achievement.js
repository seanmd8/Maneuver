
function young_dragon_achievement(){
    return {
        name: achievement_names.young_dragon,
        description: achievement_description.young_dragon,
        image: `${IMG_FOLDER.tiles}young_dragon_flight.png`,
        has: false,
        boons: [flame_strike],
        cards: []
    }
}