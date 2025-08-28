
function jack_of_all_trades_achievement(){
    return {
        name: achievement_names.jack_of_all_trades,
        description: achievement_description.jack_of_all_trades,
        image: `${IMG_FOLDER.achievements}jack_of_all_trades.png`,
        has: false,
        boons: [spontaneous],
    }
}