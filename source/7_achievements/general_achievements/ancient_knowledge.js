function ancient_knowledge_achievement(){
    return {
        name: achievement_names.ancient_knowledge,
        description: achievement_description.ancient_knowledge,
        image: `${IMG_FOLDER.achievements}ancient_knowledge.png`,
        has: false,
        boons: [clean_mind],
    }
}