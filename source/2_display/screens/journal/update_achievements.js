function update_achievements(){
    var achievements = GS.data.achievements.all();
    display.remove_children(UIIDS.achievement_list);
    display.show_achievements(UIIDS.achievement_list, achievements);
}
