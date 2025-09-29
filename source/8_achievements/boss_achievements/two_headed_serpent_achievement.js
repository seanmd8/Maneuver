function two_headed_serpent_achievement(){
    return {
        name: achievement_names.two_headed_serpent,
        description: achievement_description.two_headed_serpent,
        image: `${IMG_FOLDER.tiles}serpent_head.png`,
        has: false,
        boons: [slime_trail],
        cards: ACHIEVEMENT_CARDS.two_headed_serpent,
    }
}