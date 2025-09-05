function arcane_sentry_achievement(){
    return {
        name: achievement_names.arcane_sentry,
        description: achievement_description.arcane_sentry,
        image: `${IMG_FOLDER.tiles}arcane_sentry_core.png`,
        has: false,
        boons: [choose_your_path],
        cards: []
    }
}