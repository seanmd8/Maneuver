function update_journal_areas(){
    display.remove_children(UIIDS.journal_areas);
    show_assorted_tiles();
    show_area(ruins_display_info());
    show_area(basement_display_info());
    show_area(sewers_display_info());
    show_area(crypt_display_info());
    show_area(magma_display_info());
    show_area(forest_display_info());
    show_area(library_display_info());
    show_area(court_display_info());
}

function show_assorted_tiles(){

}

function show_area(info){
    var visited = GS.data.areas.has(info.name);
    if(!visited){
        info.name = area_names.unknown;
    }
    var check_encountered = (t) => {
        t = t();
        if(!visited){
            return {
                name: boon_names.locked,
                pic: `${IMG_FOLDER.other}locked.png`,
                background: [info.background],
                description: boon_descriptions.locked,
            }
        }
        if(GS.data.tiles.has(t.name)){
            return {
                name: t.name,
                pic: t.display_pic ? t.display_pic : t.pic,
                background: [info.background],
                description: t.description,
            }
        }
        return {
            name: boon_names.not_encountered,
            pic: `${IMG_FOLDER.other}not_encountered.png`,
            background: [info.background],
            description: boon_descriptions.not_encountered,
        }
    };
    info.boss = check_encountered(info.boss);
    info.tiles = info.tiles.map(check_encountered).sort((a, b) => {
        if(a.name < b.name){
            return -1;
        }
        if(a.name > b.name){
            return 1;
        }
        return 0;
    });
    display.journal_area_section(UIIDS.journal_areas, info);
}