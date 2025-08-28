
function spider_queen_achievement(){
    return {
        name: achievement_names.spider_queen,
        description: achievement_description.spider_queen,
        image: `${IMG_FOLDER.tiles}spider_queen.png`,
        has: false,
        boons: [retaliate],
        cards: [
            stunning_leap_vertical, stunning_leap_horizontal, stunning_punch_diagonal, stunning_punch_orthogonal, stunning_slice,
            stunning_tread_diagonal, stunning_tread_orthogonal, stunning_retreat
        ]
    }
}