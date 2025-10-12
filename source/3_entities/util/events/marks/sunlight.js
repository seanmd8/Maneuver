function sunlight_mark(){
    return {
        name: event_names.sunlight,
        pic: `${IMG_FOLDER.tiles}sunlight.png`,
        description: event_descriptions.sunlight,
        telegraph: hazard_telegraph
    };
}