function get_all_area_info(){
    return [
        basic_tiles_display_info(),
        ruins_display_info(),
        city_display_info(),
        sewers_display_info(),
        crypt_display_info(),
        magma_display_info(),
        forest_display_info(),
        library_display_info(),
        court_display_info(),
        assorted_tiles_display_info(),
        events_display_info(),
    ];
}

function unlock_all_tiles(){
    var areas = get_all_area_info();
    for(var area of areas){
        if(area.boss !== undefined){
            GS.data.add_tile(area.boss().name);
        }
        for(var tile of area.tiles){
            GS.data.add_tile(tile().name);
        }
    }
}

function unlock_all_areas(){
    const areas = get_all_area_info();
    for(var area of areas){
        if(area.boss !== undefined){
            GS.data.add_area(area.name);
        }
    }
}