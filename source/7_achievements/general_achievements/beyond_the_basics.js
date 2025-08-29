function beyond_the_basics_achievement(){
    return {
        name: achievement_names.beyond_the_basics,
        description: achievement_description.beyond_the_basics,
        image: `${IMG_FOLDER.achievements}beyond_the_basics.png`,
        has: false,
        boons: [perfect_the_basics],
    }
}