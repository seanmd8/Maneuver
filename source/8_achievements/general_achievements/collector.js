function collector_achievement(){
    return {
        name: achievement_names.collector,
        description: achievement_description.collector,
        pic: `${IMG_FOLDER.achievements}collector.png`,
        has: false,
        boons: [hoarder],
    }
}