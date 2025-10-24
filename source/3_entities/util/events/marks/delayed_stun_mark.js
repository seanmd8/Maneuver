function delayed_stun_mark(){
    return {
        name: event_names.delayed_stun,
        pic: `${IMG_FOLDER.tiles}delayed_stun_mark.png`,
        description: event_descriptions.delayed_stun,
        telegraph_other: hazard_telegraph,
    };
}