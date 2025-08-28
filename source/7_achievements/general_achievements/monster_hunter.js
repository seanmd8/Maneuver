
function monster_hunter_achievement(){
    return {
        name: achievement_names.monster_hunter,
        description: achievement_description.monster_hunter,
        image: `${IMG_FOLDER.achievements}monster_hunter.png`,
        has: false,
        boons: [brag_and_boast],
    }
}