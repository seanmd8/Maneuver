function lich_achievement(){
    return {
        name: achievement_names.lich,
        description: achievement_description.lich,
        pic: `${IMG_FOLDER.tiles}lich_rest.png`,
        has: false,
        boons: [rift_touched],
        cards: ACHIEVEMENT_CARDS.lich,
    }
}