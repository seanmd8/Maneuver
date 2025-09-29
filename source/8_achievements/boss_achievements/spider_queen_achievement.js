function spider_queen_achievement(){
    return {
        name: achievement_names.spider_queen,
        description: achievement_description.spider_queen,
        image: `${IMG_FOLDER.tiles}spider_queen.png`,
        has: false,
        boons: [retaliate],
        cards: ACHIEVEMENT_CARDS.spider_queen,
    }
}