function peerless_sprinter_achievement(){
    return {
        name: achievement_names.peerless_sprinter,
        description: achievement_description.peerless_sprinter,
        pic: `${IMG_FOLDER.achievements}peerless_sprinter.png`,
        has: false,
        boons: [stealthy],
    }
}